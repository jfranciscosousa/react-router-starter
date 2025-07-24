import { useRouteLoaderData } from "react-router";
import { Route } from "../+types/root";

export type RootLoader = Route.ComponentProps["loaderData"];

export function useRootLoaderData() {
  return useRouteLoaderData<RootLoader>("root")!;
}
