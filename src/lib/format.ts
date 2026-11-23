export const brl = (v: number | string | null | undefined) =>
  Number(v ?? 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export const dateBR = (d: string) =>
  new Date(d).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });

export const ORDER_STATUS: Record<string, { label: string; cls: string }> = {
  pending: { label: "Aguardando pagamento", cls: "bg-warning/15 text-warning border-warning/40" },
  paid: { label: "Pago", cls: "bg-primary/15 text-primary-glow border-primary/40" },
  processing: { label: "Em produção", cls: "bg-primary/15 text-primary-glow border-primary/40" },
  sent: { label: "Enviado", cls: "bg-primary/15 text-primary-glow border-primary/40" },
  completed: { label: "Concluído", cls: "bg-success/15 text-success border-success/40" },
  cancelled: { label: "Cancelado", cls: "bg-destructive/15 text-destructive border-destructive/40" },
};

export const slugify = (s: string) =>
  s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
