// app/dashboard/page.jsx — Server Component
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getDashboardData } from "@/lib/actions/userActions";
import DashboardClient from "@/components/DashboardClient";

export const metadata = {
  title: "Dashboard",
  description: "Your personal writing dashboard on Entry.",
  robots: { index: false },
};

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/dashboard");

  const data = await getDashboardData();

  return <DashboardClient data={data} />;
}
