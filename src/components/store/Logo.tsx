import { Link } from "@tanstack/react-router";
import { Crosshair } from "lucide-react";

export function Logo({ name: rawName, logoUrl }: { name?: string | undefined; logoUrl?: string | null | undefined }) {
  const name = rawName ?? "GLZADAS CHEATS";
  const [a, ...rest] = name.split(" ");
  return (
    <Link to="/" className="flex items-center gap-2">
      {logoUrl ? (
        <img src={logoUrl} alt={name} className="h-9 w-9 rounded-lg object-cover" />
      ) : (
        <span className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-primary shadow-glow">
          <Crosshair className="h-5 w-5 text-primary-foreground" />
        </span>
      )}
      <span className="font-display text-lg font-black tracking-wider">
        {a} <span className="text-gradient">{rest.join(" ")}</span>
      </span>
    </Link>
  );
}
