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
      className="btn-ghost w-full py-2.5 text-sm"
    >
      {copied ? "コピーしました!" : "共有URLをコピー"}
    </button>
  );
}
