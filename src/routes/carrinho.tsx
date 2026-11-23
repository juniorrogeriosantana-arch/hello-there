import { createFileRoute } from "@tanstack/react-router";
export const Route = createFileRoute("/carrinho")({
  head: () => ({ meta: [{ title: "Carrinho — GLZADAS CHEATS" }, { name: "description", content: "Carrinho da loja GLZADAS CHEATS." }, { property: "og:title", content: "Carrinho — GLZADAS CHEATS" }, { property: "og:description", content: "Carrinho da loja GLZADAS CHEATS." }] }),
  component: () => <div className="container mx-auto px-4 py-24 text-center"><h1 className="text-3xl font-black">Carrinho</h1><p className="mt-3 text-muted-foreground">Esta página ainda está sendo construída.</p></div>,
});
