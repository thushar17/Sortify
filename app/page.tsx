import { ArrowRight, ChartColumnBig, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="page-shell min-h-screen justify-center">
      <section className="glass-card section-shell">
        <div className="relative grid gap-8 xl:grid-cols-[1.15fr_0.85fr] xl:items-center">
          <div className="space-y-6">
            <span className="eyebrow">Sortify</span>
            <div className="space-y-4">
              <h1 className="max-w-3xl text-balance text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl xl:text-[3.7rem]">
                Short links with a{" "}
                <span className="gradient-text">premium analytics workspace</span>
                .
              </h1>
              <p className="max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
                Create compact URLs, monitor engagement, and manage your link
                library inside a polished blue-purple glassmorphism dashboard.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/dashboard" className="primary-button">
                <span>Open dashboard</span>
                <ArrowRight className="size-4" />
              </Link>
              <Link href="/api/auth/signin" className="secondary-button">
                <Sparkles className="size-4" />
                <span>Sign in</span>
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
            <article className="metric-card">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-500">
                    Cleaner insights
                  </p>
                  <p className="text-xl font-semibold tracking-tight text-slate-950">
                    Data-first analytics
                  </p>
                  <p className="text-sm leading-6 text-slate-600">
                    Review browsers, devices, and total clicks with sharper
                    visual hierarchy.
                  </p>
                </div>
                <div className="flex size-12 items-center justify-center rounded-2xl border border-white/80 bg-white/85 text-blue-700 shadow-[0_14px_30px_rgba(59,130,246,0.12)]">
                  <ChartColumnBig className="size-5" />
                </div>
              </div>
            </article>

            <article className="metric-card">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-500">
                    Safer workflows
                  </p>
                  <p className="text-xl font-semibold tracking-tight text-slate-950">
                    Thoughtful destructive states
                  </p>
                  <p className="text-sm leading-6 text-slate-600">
                    QR, delete, copy, and toast feedback now feel cohesive and
                    production-ready.
                  </p>
                </div>
                <div className="flex size-12 items-center justify-center rounded-2xl border border-white/80 bg-white/85 text-violet-700 shadow-[0_14px_30px_rgba(139,92,246,0.14)]">
                  <ShieldCheck className="size-5" />
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}
