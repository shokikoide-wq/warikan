"use client";

import { useState } from "react";

interface ShareButtonProps {
  groupId: string;
}

export default function ShareButton({ groupId }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const url = `${window.location.origin}/g/${groupId}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: select text in a temporary input
      const input = document.createElement("input");
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="w-full border border-indigo-300 text-indigo-600 py-2 rounded-lg font-medium hover:bg-indigo-50"
    >
      {copied ? "コピーしました!" : "共有URLをコピー"}
    </button>
  );
}
