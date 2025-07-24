import { useEffect } from "react";
import { ActionFunctionArgs, Form, useActionData } from "react-router";
import { Button } from "~/components/ui/button";
import { Card, CardTitle } from "~/components/ui/card";
import { InputField } from "~/components/ui/input-field";
import { useToast } from "~/components/ui/use-toast";
import { userIdFromRequest } from "~/data/sessions.server";
import { updateUser } from "~/data/users.server";
import useIsLoading from "~/hooks/useIsLoading";
import useUser from "~/hooks/useUser";

export type ProfileRouteAction = typeof action;

export const action = async ({ request }: ActionFunctionArgs) => {
  const userId = await userIdFromRequest(request, "loggedIn");
  const form = await request.formData();

  return await updateUser(userId, form, request);
};

export default function ProfileTab() {
  const user = useUser();
  const actionData = useActionData<ProfileRouteAction>();
  const { toast } = useToast();
  const isLoading = useIsLoading();

  useEffect(() => {
    if (actionData?.errors) {
      toast({ title: "Failed to update profile!", variant: "destructive" });
    } else if (actionData?.data) toast({ title: "Updated profile!" });
  }, [actionData, toast]);

  return (
    <Card className="mx-auto flex w-full max-w-lg items-center justify-center">
      <Form method="post" className="flex w-full flex-col space-y-4 p-10">
        <CardTitle className="mb-8">Edit your profile</CardTitle>

        <InputField
          label="Name"
          name="name"
          type="text"
          required
          placeholder="How you would like to be called"
          defaultValue={user.name}
          errors={actionData?.errors}
        />

        <InputField
          label="Email"
          name="email"
          type="text"
          required
          placeholder="hello@email.com"
          defaultValue={user.email}
          errors={actionData?.errors}
        />

        <InputField
          label="Current password"
          name="currentPassword"
          type="password"
          placeholder="**************"
          required
          errors={actionData?.errors}
        />

        <InputField
          label="New password"
          name="newPassword"
          type="password"
          placeholder="**************"
          errors={actionData?.errors}
        />

        <InputField
          label="Confirm password"
          name="passwordConfirmation"
          type="password"
          placeholder="**************"
          errors={actionData?.errors}
          className="pb-4"
        />

        <Button
          type="submit"
          isLoading={isLoading}
          name="_action"
          value="update-profile"
        >
          Update profile
        </Button>
      </Form>
    </Card>
  );
}
