import { AuthSession } from "@supabase/supabase-js";
import { ChangeEvent, useState } from "react";
import { supabaseClient } from "../api/supabaseClient";
import { AVATAR_BUCKET } from "../constants";

export const useUpload = ({ session }: { session?: AuthSession }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [error, setError] = useState<{ message: string } | null>(null);

  const onUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    if (!session) {
      return;
    }

    try {
      setLoading(true);

      if (!event.target.files || event.target.files.length == 0) {
        throw "You must select an image to upload.";
      }

      const user = supabaseClient.auth.user();
      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();

      // use uuid
      const fileName = `${session?.user.id}${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      let { error: uploadError } = await supabaseClient.storage
        .from(AVATAR_BUCKET)
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      let { error: updateError } = await supabaseClient
        .from("profiles")
        .upsert({
          id: user!.id,
          avatar_url: filePath,
        });

      if (updateError) {
        throw updateError;
      }

      setAvatarUrl(null);
      setAvatarUrl(filePath);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return [onUpload, loading, avatarUrl, error];
};
