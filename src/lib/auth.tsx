import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

type Auth = { user: User | null; isAdmin: boolean; loading: boolean };
const Ctx = createContext<Auth>({ user: null, isAdmin: false, loading: true });

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<Auth>({ user: null, isAdmin: false, loading: true });
  useEffect(() => {
    const load = async (user: User | null) => {
      if (!user) return setState({ user: null, isAdmin: false, loading: false });
      const { data } = await supabase.rpc("has_role", { _user_id: user.id, _role: "admin" });
      setState({ user, isAdmin: !!data, loading: false });
    };
    supabase.auth.getUser().then(({ data }) => load(data.user));
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "USER_UPDATED") {
        setTimeout(() => load(session?.user ?? null), 0);
      }
    });
    return () => sub.subscription.unsubscribe();
  }, []);
  return <Ctx.Provider value={state}>{children}</Ctx.Provider>;
}
export const useAuth = () => useContext(Ctx);
