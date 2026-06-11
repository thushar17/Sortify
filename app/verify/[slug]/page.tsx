import VerifyPasswordForm from "@/components/VerifyPasswordForm";
type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function VerifyPage({ params }: Props) {
  const { slug } = await params;

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="glass-card w-full max-w-md p-6">
        <div className="mb-5">
          <p className="eyebrow">Protected link</p>
          <h1 className="mt-3 text-2xl font-semibold tracking-[-0.02em] text-[#0f172a]">
            Protected Link
          </h1>
          <p className="mt-2 text-sm text-[#475569]">
            Enter the password to continue to{" "}
            <span className="font-mono text-[#4f46e5]">/{slug}</span>.
          </p>
        </div>

        <VerifyPasswordForm slug={slug} />
      </div>
    </div>
  );
}
