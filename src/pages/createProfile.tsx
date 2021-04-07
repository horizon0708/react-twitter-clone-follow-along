import CircularProgress from "@material-ui/core/CircularProgress/CircularProgress";
import { AuthSession } from "@supabase/supabase-js";
import React, { useEffect, useState } from "react";
import { Redirect } from "react-router";
import { supabaseClient } from "../api/supabaseClient";
import { ProfileForm, ProfileFormProps } from "../components/profileForm";
import { PROFILES_TABLE } from "../constants";
import { WithAuth } from "../hocs/withAuth";

export type CreateProfilePageProps = {
  session: AuthSession;
};

const CreateProfilePage: React.FC<CreateProfilePageProps> = ({ session }) => {
  const [hasProfile, setHasProfile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const checkForExistingProfile = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabaseClient
        .from(PROFILES_TABLE)
        .select("*")
        .eq("id", session.user.id);

      if (data && data.length > 0) {
        setHasProfile(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkForExistingProfile();
  }, []);

  if (isLoading) {
    return <CircularProgress />
  }
  if (hasProfile) {
    return <Redirect to="/profile" />;
  }

  const onSubmit: ProfileFormProps["onSubmit"] = async ({
    username,
    website,
  }) => {
    try {
      setIsSubmitting(true);
      await supabaseClient.from(PROFILES_TABLE).insert({
        id: session.user.id,
        username,
        website,
      });
      setHasProfile(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <ProfileForm onSubmit={onSubmit} isSubmitting={isSubmitting} usernameExists={false} />
    </div>
  );
};

export default WithAuth(CreateProfilePage);
