import React, { ChangeEventHandler } from "react";
import Button from "@material-ui/core/Button";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";

export type UploadButtonProps = {
  onUpload: ChangeEventHandler<HTMLInputElement>;
  isLoading?: boolean;
  className?: string;
};

export const UploadButton = ({
  onUpload,
  isLoading,
  className,
}: UploadButtonProps) => {
  return (
    <div>
      <Button
        className={className}
        variant="contained"
        component="label"
        startIcon={<CloudUploadIcon />}
      >
        Upload Avatar
        <input
          style={{
            visibility: "hidden",
            position: "absolute",
          }}
          type="file"
          accept="image/*"
          onChange={onUpload}
          disabled={isLoading}
        />
      </Button>
    </div>
  );
};
