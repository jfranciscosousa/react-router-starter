import { Form, Link, useActionData, useLoaderData } from "react-router";
import { Button } from "~/components/ui/button";
import { Card, CardTitle } from "~/components/ui/card";
import { CheckboxField } from "~/components/ui/checkbox-field";
import { InputField } from "~/components/ui/input-field";
import useIsLoading from "~/hooks/useIsLoading";
import { LoginRouteAction, LoginRouteLoader } from "~/routes/__unauthed.login";

export default function Login() {
  const { redirectTo } = useLoaderData<LoginRouteLoader>();
  const actionData = useActionData<LoginRouteAction>();
  const isLoading = useIsLoading();

  return (
    <Card className="mx-auto flex w-full max-w-lg items-center justify-center">
      <Form
        method="post"
        action="/login"
        className="flex w-full flex-col space-y-4 p-10"
      >
        <CardTitle className="mb-8">Please login</CardTitle>

        <InputField
          label="Email"
          name="email"
          type="text"
          required
          placeholder="hello@email.com"
          errors={actionData?.errors}
          defaultValue={actionData?.original?.email}
        />

        <InputField
          label="Password"
          name="password"
          type="password"
          placeholder="**************"
          required
          errors={actionData?.errors}
          defaultValue={actionData?.original?.password}
        />

        <CheckboxField name="rememberMe" label="Remember me" className="pb-4" />

        {redirectTo && (
          <input name="redirectTo" type="hidden" defaultValue={redirectTo} />
        )}

        <Button type="submit" isLoading={isLoading}>
          Login
        </Button>

        <Link to="/signup" className="link text-center">
          Or sign up instead
        </Link>
      </Form>
    </Card>
  );
}
