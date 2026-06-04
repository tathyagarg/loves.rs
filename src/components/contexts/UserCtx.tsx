import { createAsync } from "@solidjs/router";
import { createContext, useContext } from "solid-js";
import { getCurrentUser } from "~/lib/session";

type User = Awaited<ReturnType<typeof getCurrentUser>>;

const UserContext = createContext<ReturnType<typeof createAsync>>();

export function UserProvider(props: { children: any }) {
  const user = createAsync(() => getCurrentUser());

  return (
    <UserContext.Provider value={user}>
      {props.children}
    </UserContext.Provider>
  )
}

export function useUser(): User | undefined {
  const ctx = useContext(UserContext);

  if (!ctx) {
    throw new Error("useUser must be used within a UserProvider");
  }

  return ctx;
}
