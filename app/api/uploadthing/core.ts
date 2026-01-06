// app/api/uploadthing/core.ts
import { createUploadthing, type FileRouter } from "uploadthing/next";

// Initialize UploadThing (reads UPLOADTHING_TOKEN automatically)
const f = createUploadthing();

export const OurFileRouter = {
  imageUploader: f({
    image: { maxFileSize: "4MB", maxFileCount: 5 },
  }).onUploadComplete(async ({ file }) => {
    return { url: file.url }; // uploaded file URL
  }),
} satisfies FileRouter;

export type OurFileRouter = typeof OurFileRouter;
