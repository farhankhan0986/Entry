"use client"

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

export default function Button({ href }) {
    const router = useRouter();
    return (
        <button
            onClick={() => router.push(href)}
            className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-[var(--foreground)] group/btn">
            Visit Studio <ArrowRight size={16} className="group-hover/btn:translate-x-2 transition-transform" />
        </button>
    )
}