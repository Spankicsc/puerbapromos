import { useState } from "react";
import type { ReactNode } from "react";
import Uppy from "@uppy/core";
import { DashboardModal } from "@uppy/react";
import "@uppy/core/dist/style.min.css";
import "@uppy/dashboard/dist/style.min.css";
import AwsS3 from "@uppy/aws-s3";
import type { UploadResult } from "@uppy/core";
import { Button } from "@/components/ui/button";

interface MultipleImageUploaderProps {
  maxNumberOfFiles?: number;
  maxFileSize?: number;
  onComplete?: (uploadedUrls: string[]) => void;
  buttonClassName?: string;
  children: ReactNode;
}

/**
 * A component for uploading multiple images that renders as a button and provides a modal interface.
 * 
 * Features:
 * - Renders as a customizable button that opens a file upload modal
 * - Supports multiple file uploads
 * - Provides modal interface for file selection, preview, and upload progress
 * - Returns array of uploaded image URLs
 */
export function MultipleImageUploader({
  maxNumberOfFiles = 10,
  maxFileSize = 10485760, // 10MB default
  onComplete,
  buttonClassName,
  children,
}: MultipleImageUploaderProps) {
  const [showModal, setShowModal] = useState(false);
  const [uppy] = useState(() =>
    new Uppy({
      restrictions: {
        maxNumberOfFiles,
        maxFileSize,
        allowedFileTypes: ['image/*'],
      },
      autoProceed: false,
    })
      .use(AwsS3, {
        shouldUseMultipart: false,
        getUploadParameters: async () => {
          // Get upload URL for each file
          const response = await fetch("/api/objects/upload", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
          });
          
          if (!response.ok) {
            throw new Error("Failed to get upload URL");
          }
          
          const data = await response.json();
          return {
            method: "PUT" as const,
            url: data.uploadURL,
          };
        },
      })
      .on("complete", (result) => {
        const uploadedUrls = result.successful?.map(file => file.uploadURL as string) || [];
        if (onComplete && uploadedUrls.length > 0) {
          onComplete(uploadedUrls);
        }
        setShowModal(false);
      })
  );

  return (
    <div>
      <Button onClick={() => setShowModal(true)} className={buttonClassName}>
        {children}
      </Button>

      <DashboardModal
        uppy={uppy}
        open={showModal}
        onRequestClose={() => setShowModal(false)}
        proudlyDisplayPoweredByUppy={false}
      />
    </div>
  );
}