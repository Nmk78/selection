import { Suspense } from "react";
import { LoaderCircle } from "lucide-react";
import { validateKey } from "@/actions/secretKey";
import { KeyStatus } from "@/components/key/KeyStatus";
import { KeyInputForm } from "@/components/key/Secretkeyform";

export default async function KeyStatusPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const key =
    typeof searchParams.key === "string" ? searchParams.key : undefined;
  const status = key ? await validateKey(key) : null;

  return (
    <div className="min-h-[75vh] w-full bg-Cbackground flex flex-col items-center justify-center p-4 px-10">
      <div className="mt-20 w-full max-w-md space-y-8">
        <h1 className="text-3xl font-bold text-center text-Cprimary">
          Key Status Check
        </h1>
        {!status && <KeyInputForm />}
        {status && (
          <Suspense
            fallback={<LoaderCircle className="w-8 h-8 animate-spin mx-auto" />}
          >
            <KeyStatus status={status} />
          </Suspense>
        )}
      </div>

    </div>
  );
}
