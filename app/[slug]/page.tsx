import { AlertCircle } from "lucide-react";
import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { getBrowser, getDevice } from "@/lib/analytics";
import { prisma } from "@/lib/prisma";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function PageRedirect({ params }: Props) {
  const { slug } = await params;
  const link = await prisma.link.findUnique({
    where: {
      slug,
    },
  });

  if (!link) {
    return (
      <main className="page-shell min-h-screen items-center justify-center">
        <section className="glass-card section-shell w-full max-w-xl text-center">
          <div className="relative flex flex-col items-center gap-5">
            <div className="flex size-16 items-center justify-center rounded-[1.5rem] bg-rose-50 text-rose-600 shadow-[0_18px_40px_rgba(244,63,94,0.12)]">
              <AlertCircle className="size-7" />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
                Link not found
              </h1>
              <p className="text-sm leading-7 text-slate-600 sm:text-base">
                The short link <span className="font-semibold">/{slug}</span>{" "}
                does not exist or is no longer available.
              </p>
            </div>
            <Link href="/" className="secondary-button">
              Return home
            </Link>
          </div>
        </section>
      </main>
    );
  }

  const headersList = await headers();

  const userAgent = headersList.get("user-agent") || "";
  const browser = getBrowser(userAgent);
  const device = getDevice(userAgent);
  await prisma.click.create({
    data: {
      browser,
      device,
      linkId: link.id,
    },
  });
  redirect(link.originalUrl);
}
