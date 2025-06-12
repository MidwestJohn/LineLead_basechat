import "./style.css";
import "./markdown.css";
import { FileAudio, FileImage, FileVideo } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import rehypeStringify from "rehype-stringify";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

import CONNECTOR_MAP from "@/lib/connector-map";
import { IMAGE_FILE_TYPES, VIDEO_FILE_TYPES, AUDIO_FILE_TYPES } from "@/lib/file-utils";
import { LLM_DISPLAY_NAMES, LLMModel } from "@/lib/llm/types";

import { SourceMetadata } from "../../lib/types";
import Logo from "../tenant/logo/logo";

const MAX_CITATION_LENGTH = 30;

function format(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);

  const pad = (n: number): string => n.toString().padStart(2, "0");

  return hours > 0 ? `${pad(hours)}:${pad(minutes)}:${pad(seconds)}` : `${pad(minutes)}:${pad(seconds)}`;
}

const Citation = ({ source, onClick = () => {} }: { source: SourceMetadata; onClick?: () => void }) => {
  const connector = CONNECTOR_MAP[source.source_type];
  const isAudio =
    source.documentName?.toLowerCase() &&
    AUDIO_FILE_TYPES.some((ext) => source.documentName?.toLowerCase().endsWith(ext));
  const isVideo =
    source.documentName?.toLowerCase() &&
    VIDEO_FILE_TYPES.some((ext) => source.documentName?.toLowerCase().endsWith(ext));
  const isImage =
    source.documentName?.toLowerCase() &&
    IMAGE_FILE_TYPES.some((ext) => source.documentName?.toLowerCase().endsWith(ext));

  const formatSourceName = (input: string) => {
    if (input.length <= MAX_CITATION_LENGTH) return input;
    return "..." + input.slice(-1 * MAX_CITATION_LENGTH);
  };

  return (
    <button className="rounded-[20px] flex items-center border px-3 py-1.5 mr-3 mb-3" onClick={onClick}>
      {connector && <Image src={connector[1]} alt={connector[0]} className="mr-1" />}
      {(!source.source_type || source.source_type === "manual") && (
        <>
          {isAudio && <FileAudio className="w-4 h-4 mr-1" />}
          {isVideo && <FileVideo className="w-4 h-4 mr-1" />}
          {isImage && <FileImage className="w-4 h-4 mr-1" />}
        </>
      )}
      {formatSourceName(source.documentName)}
      {source.startTime && source.endTime && (
        <span className="pl-2 text-xs text-muted-foreground">
          ({format(source.startTime)} - {format(source.endTime)})
        </span>
      )}
    </button>
  );
};

interface Props {
  tenantId: string;
  content: string | undefined;
  id?: string | null;
  name: string;
  logoUrl?: string | null;
  sources: SourceMetadata[];
  onSelectedSource: (source: SourceMetadata) => void;
  model: LLMModel;
  isGenerating?: boolean;
}

export default function AssistantMessage({
  name,
  logoUrl,
  content,
  sources,
  onSelectedSource,
  model,
  isGenerating,
  tenantId,
}: Props) {
  const [htmlContent, setHtmlContent] = useState<string>("");

  useEffect(() => {
    async function renderMarkdown() {
      if (content) {
        const { default: rehypeShiki } = await import("@shikijs/rehype");
        const processor = await unified()
          .use(remarkParse)
          .use(remarkRehype)
          .use(rehypeShiki, { theme: "catppuccin-latte" })
          .use(rehypeStringify)
          .process(content);

        setHtmlContent(String(processor));
      }
    }
    renderMarkdown();
  }, [content]);

  const dedupe = sources.reduce<Record<string, SourceMetadata>>((acc, v) => {
    acc[v.documentId] = v;
    return acc;
  }, {});

  const dedupedSources = Object.values(dedupe);

  return (
    <div className="flex">
      <div className="mb-8 shrink-0">
        <Logo
          name={name}
          url={logoUrl}
          width={40}
          height={40}
          className="text-[13px] h-[40px] w-[40px]"
          tenantId={tenantId}
        />
      </div>
      <div className="self-start mb-6 rounded-md ml-7">
        {content?.length ? (
          <div
            className="markdown mt-[10px] prose prose-sm max-w-none dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        ) : (
          <div className="dot-pulse mt-[14px]" />
        )}
        <div className="flex flex-wrap mt-4">
          {dedupedSources.map((source, i) => (
            <Citation key={i} source={source} onClick={() => onSelectedSource(source)} />
          ))}
        </div>
        <div className="text-xs text-muted-foreground">
          {isGenerating ? `Generating with ${LLM_DISPLAY_NAMES[model]}` : `Generated with ${LLM_DISPLAY_NAMES[model]}`}
        </div>
      </div>
    </div>
  );
}
