import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

export const Route = createRootRoute({
  component: () => (
    <>
      <Link to="/" className="cursor-default">
        <h1 className="text-2xl font-medium">Harmonies</h1>
      </Link>

      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
});
