import type { Metadata } from "next";

import StatusPage from "@/components/marketing/status-page";
import VerifyPasswordForm from "@/components/marketing/verify-password-form";
import { getShortHost } from "@/lib/format";

export const metadata: Metadata = {
  title: "Password required",
  robots: { index: false },
};

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function VerifyPage({ params }: Props) {
  const { slug } = await params;

  return (
    <StatusPage
      title="This link is password protected"
      action={<VerifyPasswordForm slug={slug} />}
    >
      Enter the password for{" "}
      <span className="font-mono text-foreground">
        {getShortHost()}/{slug}
      </span>{" "}
      to continue. The person who shared it can tell you what it is.
    </StatusPage>
  );
}
