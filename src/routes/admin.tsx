import { createFileRoute } from "@tanstack/react-router";
export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Painel administrativo — GLZADAS CHEATS" }, { name: "description", content: "Painel administrativo da loja GLZADAS CHEATS." }, { property: "og:title", content: "Painel administrativo — GLZADAS CHEATS" }, { property: "og:description", content: "Painel administrativo da loja GLZADAS CHEATS." }] }),
  component: () => <div className="container mx-auto px-4 py-24 text-center"><h1 className="text-3xl font-black">Painel administrativo</h1><p className="mt-3 text-muted-foreground">Esta página ainda está sendo construída.</p></div>,
});
