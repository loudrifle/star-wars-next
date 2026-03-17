import { Navbar } from "@/components/navbar";

export default function PagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="pt-18 min-h-screen">{children}</main>
    </>
  );
}
