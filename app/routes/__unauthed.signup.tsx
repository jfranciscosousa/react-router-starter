import type { ActionFunctionArgs, MetaFunction } from "react-router";
import { createUser } from "~/data/users.server";
import SignUp from "~/modules/Auth/SignUp";
import { authenticate } from "~/data/sessions.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const form = await request.formData();
  const result = await createUser(form);

  if (result.errors) return result.errors;

  return authenticate(request, result.data);
};

export const meta: MetaFunction = () => [
  {
    title: "Sign up",
  },
];

export default function SignUpPage() {
  return <SignUp />;
}
