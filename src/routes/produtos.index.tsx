import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ProductCard } from "@/components/store/ProductCard";
import { categoriesQuery, productsQuery } from "@/lib/store-queries";

export const Route = createFileRoute("/produtos/")({
  validateSearch: (s: Record<string, unknown>) => ({ cat: typeof s.cat === "string" ? s.cat : "", q: typeof s.q === "string" ? s.q : "" }),
  head: () => ({ meta: [
    { title: "Produtos — GLZADAS CHEATS" },
    { name: "description", content: "Catálogo completo de artes, banners, overlays e personalizações gamer." },
    { property: "og:title", content: "Produtos — GLZADAS CHEATS" },
    { property: "og:description", content: "Catálogo completo de artes, banners, overlays e personalizações gamer." },
  ] }),
  loader: ({ context }) => Promise.all([context.queryClient.ensureQueryData(productsQuery), context.queryClient.ensureQueryData(categoriesQuery)]),
  component: Catalog,
});

function Catalog() {
  const { cat, q } = Route.useSearch();
  const navigate = useNavigate({ from: "/produtos/" });
  const { data: products } = useSuspenseQuery(productsQuery);
  const { data: cats } = useSuspenseQuery(categoriesQuery);
  const list = products.filter((p) => (!cat || p.categories?.slug === cat) && (!q || (p.name + p.description).toLowerCase().includes(q.toLowerCase())));
  const chip = (active: boolean) => `rounded-full border px-4 py-1.5 text-sm font-semibold transition ${active ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary"}`;
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="mb-2 text-3xl font-black md:text-4xl">Catálogo</h1>
      <p className="mb-8 text-muted-foreground">Encontre o serviço ideal para sua identidade gamer.</p>
      <div className="mb-6 relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input className="pl-9" placeholder="Pesquisar produtos..." value={q} onChange={(e) => navigate({ search: { cat, q: e.target.value }, replace: true })} />
      </div>
      <div className="mb-8 flex flex-wrap gap-2">
        <button className={chip(!cat)} onClick={() => navigate({ search: { cat: "", q } })}>Todos</button>
        {cats.map((c) => <button key={c.id} className={chip(cat === c.slug)} onClick={() => navigate({ search: { cat: c.slug, q } })}>{c.name}</button>)}
      </div>
      {list.length === 0 ? <p className="py-20 text-center text-muted-foreground">Nenhum produto encontrado.</p> :
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{list.map((p) => <ProductCard key={p.id} p={p} />)}</div>}
    </div>
  );
}
