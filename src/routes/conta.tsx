import { createFileRoute } from "@tanstack/react-router";
export const Route = createFileRoute("/conta")({
  head: () => ({ meta: [{ title: "Minha conta — GLZADAS CHEATS" }, { name: "description", content: "Minha conta da loja GLZADAS CHEATS." }, { property: "og:title", content: "Minha conta — GLZADAS CHEATS" }, { property: "og:description", content: "Minha conta da loja GLZADAS CHEATS." }] }),
  component: () => <div className="container mx-auto px-4 py-24 text-center"><h1 className="text-3xl font-black">Minha conta</h1><p className="mt-3 text-muted-foreground">Esta página ainda está sendo construída.</p></div>,
});
