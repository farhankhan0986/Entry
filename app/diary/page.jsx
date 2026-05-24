import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getDiaryEntries, getDiaryStats } from "@/lib/actions/diaryActions";
import DiaryHubClient from "@/components/DiaryHubClient";

export const metadata = {
  title: "Dear Diary — Private Journal | Entry",
  description: "Your private, encrypted diary. Write freely — your thoughts stay yours.",
  robots: { index: false, follow: false }, // Never index diary pages
};

export default async function DiaryPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/diary");
  }

  const [entries, stats] = await Promise.all([
    getDiaryEntries({ limit: 50 }),
    getDiaryStats(),
  ]);

  return (
    <DiaryHubClient
      entries={entries}
      stats={stats}
      userName={session.user.name?.split(" ")[0] || "there"}
    />
  );
}
