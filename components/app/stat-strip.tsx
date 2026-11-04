import Sparkline from "@/components/app/sparkline";
import { cn } from "@/lib/utils";

export type Stat = {
  label: string;
  value: string;
  change?: number | null;
  hint?: string;
  trend?: number[];
};

function Change({ value }: { value: number }) {
  const rounded = Math.round(value);
  return (
    <span
      className={cn(
        "font-mono text-xs tabular-nums",
        rounded > 0 && "text-success",
        rounded < 0 && "text-destructive",
        rounded === 0 && "text-muted-foreground"
      )}
    >
      {rounded > 0 ? "+" : ""}
      {rounded}%
    </span>
  );
}

export default function StatStrip({ stats }: { stats: Stat[] }) {
  return (
    <div className="grid grid-cols-2 overflow-hidden rounded-lg border bg-card lg:grid-cols-4">
      {stats.map((stat, index) => (
        <div
          key={stat.label}
          className={cn(
            "flex flex-col gap-1 p-4",
            index % 2 === 1 && "border-l",
            index >= 2 && "border-t lg:border-t-0",
            index === 2 && "lg:border-l"
          )}
        >
          <p className="text-[13px] text-muted-foreground">{stat.label}</p>
          <div className="flex items-end justify-between gap-3">
            <p className="font-mono text-2xl font-medium tracking-tight tabular-nums text-foreground">
              {stat.value}
            </p>
            {stat.trend && <Sparkline values={stat.trend} width={72} height={24} className="mb-1" />}
          </div>
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            {stat.change != null && <Change value={stat.change} />}
            {stat.hint}
          </p>
        </div>
      ))}
    </div>
  );
}
