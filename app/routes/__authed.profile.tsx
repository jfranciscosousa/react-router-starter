import { useMemo } from "react";
import { Link, Outlet, useLocation, type MetaFunction } from "react-router";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";

export const meta: MetaFunction = () => [
  {
    title: "Profile",
  },
];

export default function Profile() {
  const location = useLocation();
  const value = useMemo(() => {
    if (location.pathname === "/profile") return "profile";

    if (location.pathname === "/profile/sessions") return "sessions";

    return undefined;
  }, [location.pathname]);

  return (
    <Tabs value={value} className="mx-auto w-full max-w-[512px]">
      <TabsList>
        <TabsTrigger
          value="profile"
          onClick={(e) => e.stopPropagation()}
          asChild
        >
          <Link to="/profile">Profile</Link>
        </TabsTrigger>
        <TabsTrigger value="sessions" asChild>
          <Link to="/profile/sessions">Sessions</Link>
        </TabsTrigger>
      </TabsList>

      <Outlet />
    </Tabs>
  );
}
