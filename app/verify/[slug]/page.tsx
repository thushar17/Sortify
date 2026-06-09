import VerifyPasswordForm from "@/components/VerifyPasswordForm";
type Props = {
    params:Promise<{
        slug: string
    }>
}

export default async function VerifyPage({
  params,
}: Props) {
  const { slug } = await params;

  return (
     <div className="flex min-h-screen items-center justify-center">
      <div className="glass-card w-full max-w-md p-6">
        <h1 className="mb-4 text-2xl font-semibold">
          Protected Link
        </h1>

        <VerifyPasswordForm slug={slug} />
      </div>
    </div>
  );
}