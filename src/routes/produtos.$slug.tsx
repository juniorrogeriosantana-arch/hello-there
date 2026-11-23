import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ShoppingCart, ArrowLeft, Check } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ProductImage } from "@/components/store/ProductCard";
import { productQuery } from "@/lib/store-queries";
import { useCart } from "@/lib/cart";
import { brl } from "@/lib/format";

export const Route = createFileRoute("/produtos/$slug")({
  loader: async ({ context, params }) => {
    const p = await context.queryClient.ensureQueryData(productQuery(params.slug));
    if (!p) throw notFound();
    return { name: p.name, description: p.description };
  },
  head: ({ loaderData }) => ({ meta: [
    { title: loaderData ? `${loaderData.name} — GLZADAS CHEATS` : "Produto — GLZADAS CHEATS" },
    { name: "description", content: loaderData?.description ?? "Produto GLZADAS CHEATS" },
    { property: "og:title", content: loaderData?.name ?? "Produto" },
    { property: "og:description", content: loaderData?.description ?? "Produto GLZADAS CHEATS" },
  ] }),
  notFoundComponent: () => <div className="py-32 text-center"><h1 className="text-2xl font-bold">Produto não encontrado</h1><Link to="/produtos" search={{ cat: "", q: "" }} className="text-primary-glow">Voltar ao catálogo</Link></div>,
  component: ProductPage,
});

function ProductPage() {
  const { slug } = Route.useParams();
  const { data: p } = useSuspenseQuery(productQuery(slug));
  const cart = useCart();
  const navigate = useNavigate();
  if (!p) return null;
  const add = () => { cart.add({ product_id: p.id, name: p.name, price: Number(p.price), image_url: p.image_url }); toast.success("Adicionado ao carrinho"); };
  return (
    <div className="container mx-auto px-4 py-12">
      <Link to="/produtos" search={{ cat: "", q: "" }} className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Catálogo</Link>
      <div className="grid gap-10 md:grid-cols-2">
        <div className="aspect-square overflow-hidden rounded-2xl border border-border shadow-glow"><ProductImage src={p.image_url} name={p.name} /></div>
        <div className="space-y-5">
          <span className="text-sm font-semibold uppercase tracking-widest text-primary-glow">{p.categories?.name}</span>
          <h1 className="text-3xl font-black md:text-4xl">{p.name}</h1>
          <p className="font-display text-3xl font-bold text-gradient">{brl(p.price)}</p>
          <p className={`inline-flex items-center gap-2 text-sm font-semibold ${p.available ? "text-success" : "text-destructive"}`}><Check className="h-4 w-4" />{p.available ? "Disponível" : "Indisponível no momento"}</p>
          <p className="whitespace-pre-line text-muted-foreground">{p.description}</p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Button variant="hero" size="xl" disabled={!p.available} onClick={() => { add(); navigate({ to: "/carrinho" }); }}>Comprar agora</Button>
            <Button variant="glow" size="xl" disabled={!p.available} onClick={add}><ShoppingCart /> Adicionar</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
