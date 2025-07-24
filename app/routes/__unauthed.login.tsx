import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "react-router";
import { login } from "~/data/login.server";
import Login from "~/modules/Auth/Login";
import { authenticate } from "~/data/sessions.server";
import { Route } from "./+types/__unauthed.login";

export type LoginRouteLoader = Route.ComponentProps["loaderData"];

export const loader = async ({ request }: LoaderFunctionArgs) => ({
  redirectTo: new URL(request.url).searchParams.get("redirectTo"),
});

export type LoginRouteAction = Route.ComponentProps["actionData"];

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const original = Object.fromEntries(formData) as Record<string, string>;
  const result = await login(formData);

  if (result.errors) return { errors: result.errors, original };

  return authenticate(request, result.data, {
    redirectTo: result.data.redirectTo,
  }) as never;
};

export const meta: MetaFunction = () => [
  {
    title: "Login",
  },
];

export default function LoginPage() {
  return <Login />;
}
