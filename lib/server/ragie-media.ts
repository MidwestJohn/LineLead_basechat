// lib/server/ragie-media.ts
export type ChatMedia = { kind: "image" | "video" | "audio"; url: string; mime: string; label?: string };

type Link = { href?: string; media_type?: string };
type ChunkLinks = Partial<
  Record<"self_image" | "preview_image" | "self_video" | "preview_video" | "self_audio" | "preview_audio", Link>
>;
type ScoredChunk = { links?: ChunkLinks; document?: { title?: string } | null };

export function extractMediaFromScoredChunks(scoredChunks: ScoredChunk[] = [], tenantSlug?: string): ChatMedia[] {
  const media: ChatMedia[] = [];
  for (const c of scoredChunks) {
    const links = c.links ?? {};

    const tryPush = (link: Link | undefined, kind: ChatMedia["kind"]) => {
      if (link?.href && link.media_type) {
        const lower = link.media_type.toLowerCase();
        const ok =
          (kind === "image" && lower.startsWith("image/")) ||
          (kind === "video" && lower.startsWith("video/")) ||
          (kind === "audio" && lower.startsWith("audio/"));
        if (ok) {
          const streamUrl = tenantSlug
            ? `/api/ragie/stream?url=${encodeURIComponent(link.href)}&tenant=${encodeURIComponent(tenantSlug)}`
            : `/api/ragie/stream?url=${encodeURIComponent(link.href)}`;
          media.push({
            kind,
            url: streamUrl,
            mime: link.media_type,
            label: c.document?.title ?? undefined,
          });
        }
      }
    };

    tryPush(links.self_image ?? links.preview_image, "image");
    tryPush(links.self_video ?? links.preview_video, "video");
    tryPush(links.self_audio ?? links.preview_audio, "audio");
  }
  return media;
}
