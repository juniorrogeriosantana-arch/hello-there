import { createFileRoute } from "@tanstack/react-router";
export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Entrar — GLZADAS CHEATS" }, { name: "description", content: "Entrar da loja GLZADAS CHEATS." }, { property: "og:title", content: "Entrar — GLZADAS CHEATS" }, { property: "og:description", content: "Entrar da loja GLZADAS CHEATS." }] }),
  component: () => <div className="container mx-auto px-4 py-24 text-center"><h1 className="text-3xl font-black">Entrar</h1><p className="mt-3 text-muted-foreground">Esta página ainda está sendo construída.</p></div>,
});
