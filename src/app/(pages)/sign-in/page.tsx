import { SignInButtons } from "./_sign-in-buttons";

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

        <SignInButtons redirectTo={redirectTo} />
      </div>
    </div>
  );
}
