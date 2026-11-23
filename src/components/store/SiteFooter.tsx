import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Instagram, Youtube, MessageCircle, Mail, Music2 } from "lucide-react";
import { Logo } from "./Logo";
import { settingsQuery } from "@/lib/store-queries";

export function SiteFooter() {
  const { data: s } = useQuery(settingsQuery);
  const socials = [
    { href: s?.instagram, Icon: Instagram, label: "Instagram" },
    { href: s?.youtube, Icon: Youtube, label: "YouTube" },
    { href: s?.tiktok, Icon: Music2, label: "TikTok" },
    { href: s?.discord, Icon: MessageCircle, label: "Discord" },
  ].filter((x) => x.href);
  return (
    <footer className="mt-24 border-t border-border/60 bg-card/40">
      <div className="container mx-auto grid gap-8 px-4 py-12 md:grid-cols-3">
        <div className="space-y-3">
          <Logo name={s?.store_name} logoUrl={s?.logo_url} />
          <p className="text-sm text-muted-foreground">Artes, banners, overlays e personalizações premium para gamers e criadores.</p>
        </div>
        <div className="space-y-2 text-sm">
          <h4 className="font-display text-sm font-bold uppercase">Navegação</h4>
          <Link to="/produtos" search={{ cat: "", q: "" }} className="block text-muted-foreground hover:text-foreground">Produtos</Link>
          <Link to="/contato" className="block text-muted-foreground hover:text-foreground">Contato</Link>
          <Link to="/conta" className="block text-muted-foreground hover:text-foreground">Minha conta</Link>
        </div>
        <div className="space-y-3 text-sm">
          <h4 className="font-display text-sm font-bold uppercase">Redes sociais</h4>
          <div className="flex gap-2">
            {socials.map(({ href, Icon, label }) => (
              <a key={label} href={href!} target="_blank" rel="noreferrer" aria-label={label} className="grid h-10 w-10 place-items-center rounded-lg border border-border hover:border-primary hover:text-primary-glow"><Icon className="h-4 w-4" /></a>
            ))}
          </div>
          {s?.email && <p className="flex items-center gap-2 text-muted-foreground"><Mail className="h-4 w-4" /> {s.email}</p>}
        </div>
      </div>
      <p className="border-t border-border/60 py-4 text-center text-xs text-muted-foreground">© {new Date().getFullYear()} {s?.store_name ?? "GLZADAS CHEATS"}. Todos os direitos reservados.</p>
    </footer>
  );
}
