import { Link } from "@tanstack/react-router";
import { ShoppingCart, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";
import { brl } from "@/lib/format";

export type ProductLite = {
  id: string; name: string; slug: string; description: string; price: number;
  image_url: string | null; available: boolean; categories: { name: string } | null;
};

export function ProductImage({ src, name, className = "" }: { src: string | null; name: string; className?: string }) {
  if (src) return <img src={src} alt={name} loading="lazy" className={`h-full w-full object-cover ${className}`} />;
  return (
    <div className={`grid h-full w-full place-items-center bg-hero-glow grid-bg ${className}`}>
      <Sparkles className="h-10 w-10 text-primary-glow" />
    </div>
  );
}

export function ProductCard({ p }: { p: ProductLite }) {
  const cart = useCart();
  return (
    <div className="card-glow group flex flex-col overflow-hidden">
      <Link to="/produtos/$slug" params={{ slug: p.slug }} className="aspect-[4/3] overflow-hidden">
        <ProductImage src={p.image_url} name={p.name} className="transition-transform duration-500 group-hover:scale-105" />
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-center justify-between text-xs uppercase tracking-wider">
          <span className="text-primary-glow">{p.categories?.name ?? "Geral"}</span>
          <span className={p.available ? "text-success" : "text-destructive"}>{p.available ? "Disponível" : "Indisponível"}</span>
        </div>
        <Link to="/produtos/$slug" params={{ slug: p.slug }} className="font-display text-base font-bold hover:text-primary-glow">{p.name}</Link>
        <p className="line-clamp-2 text-sm text-muted-foreground">{p.description}</p>
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="font-display text-xl font-bold">{brl(p.price)}</span>
          <Button size="sm" variant="hero" disabled={!p.available}
            onClick={() => { cart.add({ product_id: p.id, name: p.name, price: Number(p.price), image_url: p.image_url }); toast.success("Adicionado ao carrinho"); }}>
            <ShoppingCart /> Comprar
          </Button>
        </div>
      </div>
    </div>
  );
}
