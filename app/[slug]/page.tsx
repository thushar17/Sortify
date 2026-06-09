import { AlertCircle } from "lucide-react";
import Link from "next/link";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import axios from "axios";
import { getBrowser, getDevice } from "@/lib/analytics";
import { prisma } from "@/lib/prisma";
import { redis } from "@/lib/redis";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function PageRedirect({ params }: Props) {
  const { slug } = await params;
  // chaching 
const chachedLink = await redis.get(slug)
let link 
if(chachedLink){
  link = chachedLink 
}
else{
 link = await prisma.link.findUnique({
    where: {
      slug,
    },
  });
}
if(link){
  await redis.set(
    slug ,
    JSON.stringify(link)
  )
  {
    ex: 60*60
  }
}
  

  // Link not found
  if (!link) {
    return (
      <main className="page-shell min-h-screen items-center justify-center">
        <section className="glass-card section-shell w-full max-w-xl text-center">
          <div className="relative flex flex-col items-center gap-5">
            <div className="flex size-16 items-center justify-center rounded-[1.5rem] bg-rose-50 text-rose-600">
              <AlertCircle className="size-7" />
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
                Link not found
              </h1>

              <p className="text-sm leading-7 text-slate-600">
                The short link{" "}
                <span className="font-semibold">
                  /{slug}
                </span>{" "}
                does not exist.
              </p>
            </div>

            <Link
              href="/"
              className="secondary-button"
            >
              Return Home
            </Link>
          </div>
        </section>
      </main>
    );
  }

  const cookieStore = await cookies()

  const verified = cookieStore.get(`verified-${slug}`)
  if(link.password && !verified){
     redirect(`/verify/${slug}`);
  }
  // Expired link
  if (
    link.expiresAt &&
    link.expiresAt < new Date()
  ) {
    return (
      <main className="page-shell min-h-screen items-center justify-center">
        <section className="glass-card section-shell w-full max-w-xl text-center">
          <div className="space-y-4">
            <h1 className="text-3xl font-semibold text-slate-950">
              Link Expired
            </h1>

            <p className="text-slate-600">
              This short link has expired and is
              no longer available.
            </p>

            <Link
              href="/"
              className="secondary-button"
            >
              Return Home
            </Link>
          </div>
        </section>
      </main>
    );
  }

  const headersList = await headers();

  const userAgent =
    headersList.get("user-agent") || "";

  const browser = getBrowser(userAgent);
  const device = getDevice(userAgent);

  const forwardedFor =
    headersList.get("x-forwarded-for");

  const ip =
    forwardedFor?.split(",")[0] || "";

  let country = "Unknown";

  if (ip) {
    try {
      const { data } = await axios.get(
        `http://ip-api.com/json/${ip}`
      );

      country =
        data.country || "Unknown";
    } catch (error) {
      console.log(error);
    }
  }

  await prisma.click.create({
    data: {
      browser,
      device,
      country,
      linkId: link.id,
    },
  });

  redirect(link.originalUrl);
}