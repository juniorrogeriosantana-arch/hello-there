import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { MessageCircle, Mail, Phone } from "lucide-react";
import { settingsQuery } from "@/lib/store-queries";

export const Route = createFileRoute("/contato")({
  head: () => ({ meta: [
    { title: "Contato — GLZADAS CHEATS" },
    { name: "description", content: "Fale com a GLZADAS CHEATS pelo Discord, WhatsApp ou e-mail." },
    { property: "og:title", content: "Contato — GLZADAS CHEATS" },
    { property: "og:description", content: "Fale com a GLZADAS CHEATS pelo Discord, WhatsApp ou e-mail." },
  ] }),
  component: Contact,
});

function Contact() {
  const { data: s } = useQuery(settingsQuery);
  const items = [
    { Icon: MessageCircle, t: "Discord", v: s?.discord, href: s?.discord },
    { Icon: Phone, t: "WhatsApp", v: s?.whatsapp, href: s?.whatsapp ? `https://wa.me/${s.whatsapp.replace(/\D/g, "")}` : null },
    { Icon: Mail, t: "E-mail", v: s?.email, href: s?.email ? `mailto:${s.email}` : null },
  ].filter((i) => i.v);
  return (
    <div className="container mx-auto max-w-3xl px-4 py-16">
      <h1 className="mb-2 text-3xl font-black md:text-4xl">Entre em <span className="text-gradient">contato</span></h1>
      <p className="mb-10 text-muted-foreground">Tire dúvidas, peça orçamentos personalizados ou acompanhe seu pedido.</p>
      <div className="grid gap-4 sm:grid-cols-2">
        {items.map(({ Icon, t, v, href }) => (
          <a key={t} href={href ?? "#"} target="_blank" rel="noreferrer" className="card-glow flex items-center gap-4 p-6">
            <Icon className="h-8 w-8 text-primary-glow" /><div><p className="font-display font-bold">{t}</p><p className="text-sm text-muted-foreground break-all">{v}</p></div>
          </a>
        ))}
      </div>
    </div>
  );
}
