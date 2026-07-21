import { AuthCard } from "@/features/auth/components/auth-card";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { StatusPulse } from "@/components/layout/status-pulse";

export default function RegisterPage() {
  return (
    <>
      <Header />

      <main className="flex-grow flex items-center justify-center px-4 py-20 relative overflow-hidden">
        {/* Abstract Background Texture */}
        <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[80px]"></div>
        </div>

        <AuthCard />
      </main>

      {/* <StatusPulse /> */}
      <Footer />
    </>
  );
}
