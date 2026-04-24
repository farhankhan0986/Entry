"use client";
import React from 'react'
import Share from './Share'
import {
    FaWhatsapp, FaPinterestP, FaXTwitter,
    FaFacebookF, FaTelegram, FaInstagram,
    FaReddit
} from "react-icons/fa6";

export default function SocialButton() {

    return (
        <div className="flex flex-col gap-3">
            <button
                onClick={() => {
                    window.open(`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`, "_blank");
                }}
                className="w-10 h-10 cursor-pointer rounded-full flex items-center justify-center border border-[var(--border)] bg-[var(--card)]/10 hover:bg-[#1877F2] hover:text-white transition-all shadow-sm"><FaFacebookF size={14} /></button>
            <button
                onClick={() => {
                    const url = encodeURIComponent(window.location.href);
                    window.open(`https://www.instagram.com/?url=${url}`, "_blank");
                }}
                className="w-10 h-10 cursor-pointer rounded-full flex items-center justify-center border border-[var(--border)] bg-[var(--card)]/10 hover:bg-[#E1306C] hover:text-white transition-all shadow-sm"><FaInstagram size={14} /></button>
            <button
                onClick={() => {
                    window.open(`https://twitter.com/intent/tweet?url=${window.location.href}`, "_blank");
                }}
                className="w-10 h-10 cursor-pointer rounded-full flex items-center justify-center border border-[var(--border)] bg-[var(--card)]/10 hover:bg-black hover:text-white transition-all shadow-sm"><FaXTwitter size={14} /></button>
            <button
                onClick={() => {
                    window.open(`https://wa.me/?text=${window.location.href}`, "_blank");
                }}
                className="w-10 h-10 cursor-pointer rounded-full flex items-center justify-center border border-[var(--border)] bg-[var(--card)]/10 hover:bg-[#25D366] hover:text-white transition-all shadow-sm"><FaWhatsapp size={16} /></button>
            <button
                onClick={() => {
                    window.open(`https://pinterest.com/pin/create/button/?url=${window.location.href}`, "_blank");
                }}
                className="w-10 h-10 cursor-pointer rounded-full flex items-center justify-center border border-[var(--border)] bg-[var(--card)]/10 hover:bg-[#E60023] hover:text-white transition-all shadow-sm"><FaPinterestP size={14} /></button>
            <button
                onClick={() => {
                    window.open(`https://t.me/share/url?url=${window.location.href}`, "_blank");
                }}
                className="w-10 h-10 cursor-pointer rounded-full flex items-center justify-center border border-[var(--border)] bg-[var(--card)]/10 hover:bg-[#0088CC] hover:text-white transition-all shadow-sm"><FaTelegram size={16} /></button>
            <button
                onClick={() => {
                    window.open(`https://reddit.com/submit?url=${window.location.href}`, "_blank");
                }}
                className="w-10 h-10 cursor-pointer rounded-full flex items-center justify-center border border-[var(--border)] bg-[var(--card)]/10 hover:bg-[#FF4500] hover:text-white transition-all shadow-sm"><FaReddit size={16} /></button>
        </div>
    )
}