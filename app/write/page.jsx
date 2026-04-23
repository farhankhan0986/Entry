// app/write/page.jsx — Server Component (auth gate)
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import WriteForm from "@/components/WriteForm";

export const metadata = {
  title: "New Entry | Entry",
  description: "Write and publish your story on Entry.",
};

export default async function WritePage() {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/write");

  return <WriteForm session={session} />;
}