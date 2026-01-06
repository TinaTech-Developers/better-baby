"use client";

import { UploadButton } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";

export function ImageUploadButton(props: {
  onClientUploadComplete: (res: { url: string }[] | undefined) => void;
  onUploadError?: (err: Error) => void;
  className?: string;
}) {
  return (
    <UploadButton<OurFileRouter, "imageUploader">
      endpoint="imageUploader"
      onClientUploadComplete={props.onClientUploadComplete}
      onUploadError={props.onUploadError}
      className={props.className}
    />
  );
}
