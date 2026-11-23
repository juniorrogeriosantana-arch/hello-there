import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Palette, Image as ImageIcon, Monitor, Wand2, Sparkles, Zap, ShieldCheck, Headphones, Star, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ProductCard } from "@/components/store/ProductCard";
import { categoriesQuery, productsQuery } from "@/lib/store-queries";
import hero from "@/assets/hero.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "GLZADAS CHEATS — Artes e personalizações gamer" },
      { name: "description", content: "Logos, banners, overlays e personalizações premium para gamers e streamers." },
      { property: "og:title", content: "GLZADAS CHEATS — Loja Gamer" },
      { property: "og:description", content: "Logos, banners, overlays e personalizações premium para gamers e streamers." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: ({ context }) => Promise.all([
    context.queryClient.ensureQueryData(productsQuery),
    context.queryClient.ensureQueryData(categoriesQuery),
  ]),
  component: Home,
});

export const catIcons: Record<string, typeof Palette> = { palette: Palette, image: ImageIcon, monitor: Monitor, wand: Wand2 };

const perks = [
  { Icon: Zap, t: "Entrega rápida", d: "Produção ágil com prazos claros." },
  { Icon: ShieldCheck, t: "Pagamento seguro", d: "PIX com confirmação automática." },
  { Icon: Sparkles, t: "Qualidade premium", d: "Designs exclusivos e originais." },
  { Icon: Headphones, t: "Suporte no Discord", d: "Atendimento direto e humano." },
];
const reviews = [
  { n: "Lucas M.", t: "Overlay ficou absurda, minha live mudou de nível!" },
  { n: "Ana P.", t: "Logo do meu clã entregue antes do prazo. Recomendo demais." },
  { n: "Rafael S.", t: "Atendimento top no Discord e banner perfeito." },
];
const faq = [
  { q: "Como recebo meu produto?", a: "Após a confirmação do pagamento, as instruções e os arquivos ficam disponíveis na sua conta, em Meus pedidos." },
  { q: "Quais formas de pagamento?", a: "Aceitamos PIX, com confirmação automática do pagamento." },
  { q: "Posso pedir alterações?", a: "Sim, a maioria dos serviços inclui revisões. Veja a descrição de cada produto." },
  { q: "Qual o prazo de entrega?", a: "Depende do serviço, geralmente de 1 a 5 dias úteis." },
];

function Home() {
  const { data: products } = useSuspenseQuery(productsQuery);
  const { data: cats } = useSuspenseQuery(categoriesQuery);
  const featured = products.filter((p) => p.featured).slice(0, 4);
  return (
    <div>
      <section className="relative overflow-hidden">
        <img src={hero} alt="" width={1600} height={912} className="absolute inset-0 h-full w-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/70 to-background" />
        <div className="container relative mx-auto px-4 py-28 md:py-40">
          <div className="max-w-2xl space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/50 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-primary-glow"><Sparkles className="h-3 w-3" /> Loja gamer premium</span>
            <h1 className="text-5xl font-black leading-tight md:text-7xl">GLZADAS <span className="text-gradient">CHEATS</span></h1>
            <p className="text-lg text-muted-foreground md:text-xl">Eleve sua identidade gamer com logos, banners, overlays e personalizações feitas sob medida.</p>
            <div className="flex flex-wrap gap-3">
              <Button asChild variant="hero" size="xl"><Link to="/produtos">Ver produtos <ArrowRight /></Link></Button>
              <Button asChild variant="glow" size="xl"><Link to="/contato">Entrar em contato</Link></Button>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <h2 className="mb-8 text-2xl font-bold md:text-3xl">Categorias</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {cats.map((c) => { const Icon = catIcons[c.icon] ?? Sparkles; return (
            <Link key={c.id} to="/produtos" search={{ cat: c.slug, q: "" }} className="card-glow flex flex-col items-center gap-3 p-6 text-center">
              <span className="grid h-14 w-14 place-items-center rounded-xl bg-primary/15"><Icon className="h-7 w-7 text-primary-glow" /></span>
              <span className="font-display text-sm font-bold">{c.name}</span>
            </Link>); })}
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="text-2xl font-bold md:text-3xl">Em <span className="text-gradient">destaque</span></h2>
          <Link to="/produtos" className="text-sm font-semibold text-primary-glow">Ver todos →</Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{featured.map((p) => <ProductCard key={p.id} p={p} />)}</div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <h2 className="mb-8 text-center text-2xl font-bold md:text-3xl">Por que a GLZADAS?</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {perks.map(({ Icon, t, d }) => (
            <div key={t} className="card-glow p-6"><Icon className="mb-3 h-8 w-8 text-primary-glow" /><h3 className="mb-1 text-base font-bold">{t}</h3><p className="text-sm text-muted-foreground">{d}</p></div>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <h2 className="mb-8 text-center text-2xl font-bold md:text-3xl">O que dizem os clientes</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {reviews.map((r) => (
            <div key={r.n} className="card-glow p-6">
              <div className="mb-3 flex gap-1 text-primary-glow">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}</div>
              <p className="mb-4">"{r.t}"</p><p className="text-sm font-bold text-muted-foreground">{r.n}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container mx-auto max-w-3xl px-4 py-16">
        <h2 className="mb-8 text-center text-2xl font-bold md:text-3xl">Perguntas frequentes</h2>
        <Accordion type="single" collapsible className="card-glow px-6">
          {faq.map((f, i) => (
            <AccordionItem key={i} value={`f${i}`}><AccordionTrigger className="text-base font-semibold">{f.q}</AccordionTrigger><AccordionContent className="text-muted-foreground">{f.a}</AccordionContent></AccordionItem>
          ))}
        </Accordion>
      </section>
    </div>
  );
}
