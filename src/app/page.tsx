import { Header } from "@/components/header";
import { Main } from "@/components/main";

export default function Home() {
  return (
    <div className="h-screen flex flex-col bg-cover bg-[url(/bg.jpg)]">
      <Header />
      <Main />
    </div>
  );
}
