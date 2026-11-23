import { ORDER_STATUS } from "@/lib/format";
export function StatusBadge({ status }: { status: string }) {
  const s = ORDER_STATUS[status] ?? { label: status, cls: "" };
  return <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold ${s.cls}`}>{s.label}</span>;
}
