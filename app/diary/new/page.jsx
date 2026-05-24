import { auth } from "@/auth";
import { redirect } from "next/navigation";
import DiaryEditor from "@/components/DiaryEditor";

export const metadata = {
  title: "New Diary Entry | Entry",
  robots: { index: false, follow: false },
};

export default async function NewDiaryPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/diary/new");
  }

  return <DiaryEditor />;
}
