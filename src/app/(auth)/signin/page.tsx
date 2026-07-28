import { Sparkles } from "lucide-react";
import { signIn } from "@/auth";

export const dynamic = "force-dynamic";

function GithubMark() {
  return (
    <svg viewBox="0 0 24 24" width={17} height={17} fill="currentColor" aria-hidden="true">
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.79-.25.79-.55 0-.27-.01-1.16-.02-2.11-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.75 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.56-.29-5.26-1.28-5.26-5.7 0-1.26.45-2.29 1.18-3.09-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.15 1.18a10.9 10.9 0 0 1 5.74 0c2.19-1.49 3.15-1.18 3.15-1.18.62 1.59.23 2.76.11 3.05.74.8 1.18 1.83 1.18 3.09 0 4.43-2.71 5.41-5.29 5.69.42.36.78 1.08.78 2.18 0 1.58-.01 2.84-.01 3.23 0 .31.21.66.8.55A11.5 11.5 0 0 0 23.5 12c0-6.35-5.15-11.5-11.5-11.5Z" />
    </svg>
  );
}

export default function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  return (
    <div className="glow-violet flex min-h-screen w-full items-center justify-center bg-bg px-4">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-surface p-8 text-center">
        <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-white">
          <Sparkles size={22} strokeWidth={2.25} />
        </div>
        <h1 className="mt-5 font-display text-xl font-semibold text-text">PromptVault</h1>
        <p className="mt-2 text-sm text-text-muted">
          Sign in with your GitHub account to access your team's prompt library.
        </p>

        <form
          className="mt-6"
          action={async () => {
            "use server";
            const params = await searchParams;
            await signIn("github", { redirectTo: params?.callbackUrl ?? "/" });
          }}
        >
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition hover:bg-primary-hover"
          >
            <GithubMark />
            Sign in with GitHub
          </button>
        </form>
      </div>
    </div>
  );
}
