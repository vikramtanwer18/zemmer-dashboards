import { redirect } from "next/navigation";

export default function LegacyTwoFactorPage() {
  redirect("/verify-email");
}
