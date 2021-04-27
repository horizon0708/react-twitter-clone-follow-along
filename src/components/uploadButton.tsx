import React, { ChangeEventHandler } from "react";
import Button from "@material-ui/core/Button";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";

export type UploadButtonProps = {
  onUpload: ChangeEventHandler<HTMLInputElement>;
  isLoading?: boolean;
  className?: string;
  avatarUrl?: string;
};

export const UploadButton = ({
  onUpload,
  isLoading,
  className,
  avatarUrl,
}: UploadButtonProps) => {
  return (
    <div>
      {avatarUrl ? <img src={avatarUrl} /> : null}
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
