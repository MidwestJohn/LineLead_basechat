// components/chat/InlineMedia.tsx
export type ChatMedia = { kind: "image" | "video" | "audio"; url: string; mime: string; label?: string };

export function InlineMedia({ media }: { media?: ChatMedia[] }) {
  if (!media?.length) return null;
  return (
    <div className="mt-3 flex flex-col gap-3">
      {media.map((m, i) => {
        if (m.kind === "image") {
          // Use <img> (not Next/Image) so no remotePatterns needed; our proxy is same-origin.
          return (
            <figure key={i} className="rounded-lg overflow-hidden border border-neutral-200 bg-white">
              <img src={m.url} alt={m.label ?? "image"} className="w-full h-auto block" />
              {m.label ? <figcaption className="px-3 py-2 text-sm text-neutral-600">{m.label}</figcaption> : null}
            </figure>
          );
        }
        if (m.kind === "video") {
          return (
            <video key={i} src={m.url} controls className="w-full rounded-lg border border-neutral-200 bg-black" />
          );
        }
        if (m.kind === "audio") {
          return <audio key={i} src={m.url} controls className="w-full" />;
        }
        return null;
      })}
    </div>
  );
}
