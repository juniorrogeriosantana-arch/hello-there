import { Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Menu, ShoppingCart, User, Shield, LogOut } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Logo } from "./Logo";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/lib/auth";
import { settingsQuery } from "@/lib/store-queries";
import { supabase } from "@/integrations/supabase/client";

const nav = [
  { to: "/", label: "Início" },
  { to: "/produtos", label: "Produtos" },
  { to: "/contato", label: "Contato" },
] as const;

export function SiteHeader() {
  const { count } = useCart();
  const { user, isAdmin } = useAuth();
  const { data: s } = useQuery(settingsQuery);
  const [open, setOpen] = useState(false);
  const qc = useQueryClient();
  const navigate = useNavigate();
  const signOut = async () => {
    await qc.cancelQueries(); qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  };
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4">
        <Logo name={s?.store_name} logoUrl={s?.logo_url} />
        <nav className="hidden items-center gap-6 md:flex">
          {nav.map((n) => (
            <Link key={n.to} to={n.to} className="text-sm font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground" activeProps={{ className: "text-primary-glow" }} activeOptions={{ exact: n.to === "/" }}>{n.label}</Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          {isAdmin && <Button asChild variant="glow" size="sm" className="hidden sm:inline-flex"><Link to="/admin"><Shield /> Admin</Link></Button>}
          <Button asChild variant="ghost" size="icon" className="relative">
            <Link to="/carrinho" aria-label="Carrinho">
              <ShoppingCart />
              {count > 0 && <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-xs font-bold text-primary-foreground">{count}</span>}
            </Link>
          </Button>
          {user ? (
            <>
              <Button asChild variant="ghost" size="icon"><Link to="/conta" aria-label="Minha conta"><User /></Link></Button>
              <Button variant="ghost" size="icon" onClick={signOut} aria-label="Sair" className="hidden sm:inline-flex"><LogOut /></Button>
            </>
          ) : (
            <Button asChild variant="hero" size="sm"><Link to="/auth">Entrar</Link></Button>
          )}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setOpen(!open)} aria-label="Menu"><Menu /></Button>
        </div>
      </div>
      {open && (
        <div className="border-t border-border/60 px-4 py-3 md:hidden">
          {nav.map((n) => <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="block py-2 font-semibold uppercase">{n.label}</Link>)}
          {isAdmin && <Link to="/admin" onClick={() => setOpen(false)} className="block py-2 font-semibold uppercase text-primary-glow">Painel Admin</Link>}
          {user && <button onClick={signOut} className="block py-2 font-semibold uppercase text-muted-foreground">Sair</button>}
        </div>
      )}
    </header>
  );
}
