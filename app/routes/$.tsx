import Error404Page from "~/components/Error404Page";

export const config = { runtime: "edge" };

export default function FallbackRoute() {
  return <Error404Page />;
}
