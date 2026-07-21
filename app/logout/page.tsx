"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAppDispatch } from "@/store/hooks";
import { logoutThunk } from "@/store/slices/auth.slice";
import { PageLoader } from "@/components/ui/states";

export default function LogoutPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    let mounted = true;
    (async () => {
      await dispatch(logoutThunk());
      if (!mounted) return;
      toast.success("Signed out");
      router.replace("/login");
    })();
    return () => {
      mounted = false;
    };
  }, [dispatch, router]);

  return <PageLoader label="Signing you out…" />;
}
