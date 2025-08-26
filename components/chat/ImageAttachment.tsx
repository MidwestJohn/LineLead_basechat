// components/chat/ImageAttachment.tsx
import Image from "next/image";

interface ImageAttachmentProps {
  src: string;
  alt: string;
  caption?: string;
}

export const ImageAttachment = ({ src, alt, caption }: ImageAttachmentProps) => (
  <figure className="mb-3 overflow-hidden rounded-xl border border-black/5">
    <Image
      src={src}
      alt={alt}
      width={1024}
      height={768}
      className="h-auto w-full"
      unoptimized // Since we're using a proxy URL
    />
    {caption && <figcaption className="px-3 py-2 text-sm text-muted-foreground">{caption}</figcaption>}
  </figure>
);
