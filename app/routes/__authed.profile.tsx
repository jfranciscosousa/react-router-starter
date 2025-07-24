import { ActionFunctionArgs, type MetaFunction } from "react-router";
import { updateUser } from "~/data/users.server";
import { userIdFromRequest } from "~/web/auth.server";

export type ProfileRouteActionType = typeof action;

export const action = async ({ request }: ActionFunctionArgs) => {
  const userId = await userIdFromRequest(request);
  const form = await request.formData();

  return await updateUser(userId, form);
};

export const meta: MetaFunction = () => [
  {
    title: "Profile",
  },
];

export { default } from "~/modules/Profile/ProfileView";
