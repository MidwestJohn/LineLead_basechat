// lib/__tests__/attachments.test.ts
import { isImage, convertMediaToAttachments, mergeAttachments } from "../attachments";

describe("attachments", () => {
  describe("isImage", () => {
    it("should detect image MIME types", () => {
      expect(isImage("test.jpg", "image/jpeg")).toBe(true);
      expect(isImage("test.png", "image/png")).toBe(true);
      expect(isImage("test.gif", "image/gif")).toBe(true);
      expect(isImage("test.webp", "image/webp")).toBe(true);
      expect(isImage("test.svg", "image/svg+xml")).toBe(true);

      // Non-image types
      expect(isImage("test.mp4", "video/mp4")).toBe(false);
      expect(isImage("test.pdf", "application/pdf")).toBe(false);
      expect(isImage("test.txt", "text/plain")).toBe(false);
    });

    it("should detect image file extensions", () => {
      expect(isImage("photo.jpg")).toBe(true);
      expect(isImage("image.jpeg")).toBe(true);
      expect(isImage("icon.png")).toBe(true);
      expect(isImage("animated.gif")).toBe(true);
      expect(isImage("modern.webp")).toBe(true);
      expect(isImage("vector.svg")).toBe(true);

      // Case insensitive
      expect(isImage("PHOTO.JPG")).toBe(true);
      expect(isImage("Image.PNG")).toBe(true);

      // Non-images
      expect(isImage("video.mp4")).toBe(false);
      expect(isImage("document.pdf")).toBe(false);
      expect(isImage("archive.zip")).toBe(false);
    });

    it("should handle undefined/null inputs", () => {
      expect(isImage()).toBe(false);
      expect(isImage(undefined, undefined)).toBe(false);
      expect(isImage("", "")).toBe(false);
    });

    it("should prioritize MIME type over filename", () => {
      // MIME type says image, filename doesn't
      expect(isImage("document.pdf", "image/jpeg")).toBe(true);

      // Filename says image, MIME type doesn't
      expect(isImage("image.jpg", "application/pdf")).toBe(false);
    });
  });

  describe("convertMediaToAttachments", () => {
    it("should convert media array to attachments", () => {
      const media = [
        { kind: "image", mime: "image/jpeg", label: "Photo 1", url: "/api/stream/1" },
        { kind: "video", mime: "video/mp4", label: "Video 1", url: "/api/stream/2" },
        { kind: "audio", mime: "audio/mp3", url: "/api/stream/3" },
      ];

      const attachments = convertMediaToAttachments(media);

      expect(attachments).toEqual([
        {
          id: "image-0",
          filename: "Photo 1",
          mime: "image/jpeg",
          kind: "image",
          caption: "Photo 1",
        },
        {
          id: "video-1",
          filename: "Video 1",
          mime: "video/mp4",
          kind: "file",
          caption: "Video 1",
        },
        {
          id: "audio-2",
          filename: "audio-2",
          mime: "audio/mp3",
          kind: "file",
          caption: undefined,
        },
      ]);
    });

    it("should handle empty/invalid input", () => {
      expect(convertMediaToAttachments()).toEqual([]);
      expect(convertMediaToAttachments([])).toEqual([]);
      expect(convertMediaToAttachments(null as any)).toEqual([]);
      expect(convertMediaToAttachments("invalid" as any)).toEqual([]);
    });
  });

  describe("mergeAttachments", () => {
    it("should merge attachments by ID without duplicates", () => {
      const existing = [
        { id: "1", filename: "file1.jpg", mime: "image/jpeg", kind: "image" as const },
        { id: "2", filename: "file2.mp4", mime: "video/mp4", kind: "file" as const },
      ];

      const newAttachments = [
        { id: "2", filename: "file2-updated.mp4", mime: "video/mp4", kind: "file" as const }, // Duplicate ID
        { id: "3", filename: "file3.png", mime: "image/png", kind: "image" as const }, // New
      ];

      const merged = mergeAttachments(existing, newAttachments);

      expect(merged).toHaveLength(3);
      expect(merged.map((a) => a.id)).toEqual(["1", "2", "3"]);
      expect(merged.find((a) => a.id === "2")?.filename).toBe("file2.mp4"); // Original kept
    });

    it("should handle empty arrays", () => {
      const existing = [{ id: "1", filename: "file1.jpg", mime: "image/jpeg", kind: "image" as const }];

      expect(mergeAttachments([], [])).toEqual([]);
      expect(mergeAttachments(existing, [])).toEqual(existing);
      expect(mergeAttachments([], existing)).toEqual(existing);
    });
  });
});
