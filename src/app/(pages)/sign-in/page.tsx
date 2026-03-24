import { Github } from "lucide-react";

import { signIn } from "@/lib/auth";

/** Allow only same-origin relative paths to prevent open-redirect attacks. */
function safeRedirectTo(url: string | undefined): string {
  if (typeof url === "string" && url.startsWith("/") && !url.startsWith("//")) {
    return url;
  }
  return "/home";
}

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const { callbackUrl } = await searchParams;
  const redirectTo = safeRedirectTo(callbackUrl);

  return (
    <div className="min-h-[calc(100vh-4.5rem)] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Title */}
        <div className="text-center mb-10">
          <h1 className="font-[var(--font-bebas)] text-4xl tracking-[0.15em] text-[var(--color-sw-gold)] mb-2">
            ACCESS THE ARCHIVES
          </h1>
          <p className="text-sm text-[var(--color-sw-muted)]">
            Sign in to save favorites and rate entities
          </p>
        </div>

        {/* Provider buttons */}
        <div className="flex flex-col gap-3">
          <form
            action={async () => {
              "use server";
              await signIn("github", { redirectTo });
            }}
          >
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 border border-[var(--color-sw-border)] text-[var(--color-sw-muted)] hover:border-[var(--color-sw-gold-dim)] hover:text-[var(--color-sw-gold)] transition-all px-4 py-3 rounded text-sm font-[var(--font-bebas)] tracking-wider cursor-pointer"
            >
              <Github size={16} />
              Continue with GitHub
            </button>
          </form>

          <form
            action={async () => {
              "use server";
              await signIn("google", { redirectTo });
            }}
          >
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 border border-[var(--color-sw-border)] text-[var(--color-sw-muted)] hover:border-[var(--color-sw-gold-dim)] hover:text-[var(--color-sw-gold)] transition-all px-4 py-3 rounded text-sm font-[var(--font-bebas)] tracking-wider cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 48 48"
                width="16"
                height="16"
                fill="currentColor"
              >
                <path d="M43.6 20.5H42V20H24v8h11.3C33.7 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.4-.4-3.5z" />
              </svg>
              Continue with Google
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
