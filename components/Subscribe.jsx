"use client";
import { toast } from "sonner";
import { Mail } from "lucide-react";

export default function Subscribe() {
    const handleSubscribe = () => {
        toast.success("Thank you for subscribing!");
    };
    return (
        <section className="my-20 p-8 md:p-12 bg-(--card)/10 border border-(--border) rounded-[48px] text-center shadow-sm">
            <div className="w-16 h-16 bg-(--background) rounded-full flex items-center justify-center mx-auto mb-6 text-(--accent) border border-(--border)">
                <Mail size={28} />
            </div>
            <h3 className="text-3xl font-bold mb-4 text-(--foreground)">Join the Newsletter</h3>
            <p className="text-(--muted) mb-8 max-w-md mx-auto italic text-lg">
                Weekly stories on design, tech, and travel directly to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input type="email" placeholder="Enter your email" className="flex-1 bg-(--input) border border-(--border) rounded-full px-6 h-14 outline-none focus:ring-2 focus:ring-(--accent)/20 transition-all" />
                <button onClick={handleSubscribe} className="btn-primary h-14 px-10 cursor-pointer rounded-full whitespace-nowrap" >Subscribe</button>
            </div>
        </section>
    );
}