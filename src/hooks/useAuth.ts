import { useMemo, useCallback } from "react";
import { auth } from "~/lib/auth";

export function useAuth() {
  const session = auth.useSession();

  const user = useMemo(() => {
    const u = session.data?.user;
    if (!u) return null;
    return { id: u.id, email: u.email ?? "" };
  }, [session.data?.user?.id, session.data?.user?.email]);

  const signOut = useCallback(() => auth.signOut(), []);

  return { user, loading: session.isPending, signOut };
}
