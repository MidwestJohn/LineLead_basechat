// lib/attachments.ts

export type Attachment = {
  id: string;
  filename: string;
  mime: string;
  kind: "image" | "file";
  caption?: string;
};

export type ChatMessage = {
  id: string;
  role: "assistant" | "user" | "system";
  text: string;
  attachments?: Attachment[];
  createdAt: number;
};

// Image detection helpers
const IMAGE_MIME = /^(image)\/(png|jpe?g|gif|webp|bmp|tiff|svg\+xml)$/i;

export const isImage = (name?: string, mime?: string): boolean => {
  // If MIME type is provided, use it as the authority
  if (mime) {
    return IMAGE_MIME.test(mime);
  }
  // Fall back to filename extension if no MIME type
  return /\.(png|jpe?g|gif|webp|bmp|tiff|svg)$/i.test(name || "");
};

// Convert existing media format to new attachment format
export const convertMediaToAttachments = (media?: any[]): Attachment[] => {
  if (!media || !Array.isArray(media)) return [];

  return media.map((item, index) => ({
    id: `${item.kind}-${index}`, // Generate ID from kind and index
    filename: item.label || `${item.kind}-${index}`,
    mime: item.mime,
    kind: item.kind === "image" ? "image" : "file",
    caption: item.label,
  }));
};

// Merge attachments by ID (no duplicates)
export const mergeAttachments = (existing: Attachment[], newAttachments: Attachment[]): Attachment[] => {
  const existingIds = new Set(existing.map((a) => a.id));
  const merged = [...existing];

  for (const attachment of newAttachments) {
    if (!existingIds.has(attachment.id)) {
      merged.push(attachment);
      existingIds.add(attachment.id);
    }
  }

  return merged;
};
