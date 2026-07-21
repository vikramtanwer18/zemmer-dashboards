import { Suspense } from "react";
import { LoginCard } from "@/features/auth/components/login-card";
import { Footer } from "@/components/layout/footer";
import { NetworkPulse } from "@/components/layout/network-pulse";
import { Header } from "@/components/layout/header";
import { PageLoader } from "@/components/ui/states";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col bg-surface relative overflow-hidden">
      <Header />
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]"></div>
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-secondary/5 rounded-full blur-[120px]"></div>
      </div>

      <main className="flex-grow flex items-center justify-center px-6 py-12">
        <Suspense fallback={<PageLoader />}>
          <LoginCard />
        </Suspense>
      </main>

      <NetworkPulse />
      <Footer />
    </div>
  );
}
