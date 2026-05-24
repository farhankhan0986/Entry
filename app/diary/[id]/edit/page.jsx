import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import { getDiaryEntry } from "@/lib/actions/diaryActions";
import DiaryEditor from "@/components/DiaryEditor";

export const metadata = {
  title: "Edit Entry | Entry",
  robots: { index: false, follow: false },
};

export default async function EditDiaryPage({ params }) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const { id } = await params;

  let entry;
  try {
    entry = await getDiaryEntry(id);
  } catch {
    notFound();
  }

  return <DiaryEditor initialEntry={entry} />;
}
