import Sidebar from "../components/Sidebar";
import TopNav from "../components/TopNav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TopNav />
      <Sidebar />
      <main className="pl-16 pt-14 min-h-screen bg-[#0a0a0f]">
        {children}
      </main>
    </>
  );
}
