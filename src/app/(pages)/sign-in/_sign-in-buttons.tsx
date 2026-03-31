"use client";

import { signIn } from "@/lib/auth-client";

export function SignInButtons({ redirectTo }: { redirectTo: string }) {
  return (
    <div className="flex flex-col gap-3">
      <button
        type="button"
        onClick={() => { void signIn.social({ provider: "github", callbackURL: redirectTo }); }}
        className="w-full flex items-center justify-center gap-2 border border-[var(--color-sw-border)] text-[var(--color-sw-muted)] hover:border-[var(--color-sw-gold-dim)] hover:text-[var(--color-sw-gold)] transition-all px-4 py-3 rounded text-sm font-[var(--font-bebas)] tracking-wider cursor-pointer"
      >
        {/* GitHub mark — sourced from simpleicons.org */}
        <svg role="img" viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-label="GitHub">
          <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
        </svg>
        Continue with GitHub
      </button>

      <button
        type="button"
        onClick={() => { void signIn.social({ provider: "google", callbackURL: redirectTo }); }}
        className="w-full flex items-center justify-center gap-2 border border-[var(--color-sw-border)] text-[var(--color-sw-muted)] hover:border-[var(--color-sw-gold-dim)] hover:text-[var(--color-sw-gold)] transition-all px-4 py-3 rounded text-sm font-[var(--font-bebas)] tracking-wider cursor-pointer"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 48 48"
          width="16"
          height="16"
          fill="currentColor"
          aria-label="Google"
        >
          <path d="M43.6 20.5H42V20H24v8h11.3C33.7 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.4-.4-3.5z" />
        </svg>
        Continue with Google
      </button>
    </div>
  );
}
