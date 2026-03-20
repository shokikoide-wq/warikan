"use client";

import { useState } from "react";

interface AddMemberFormProps {
  onAdd: (name: string) => Promise<void>;
}

export default function AddMemberForm({ onAdd }: AddMemberFormProps) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;

    setLoading(true);
    try {
      await onAdd(trimmed);
      setName("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="メンバー名"
        className="glass-input flex-1 text-sm"
      />
      <button
        type="submit"
        disabled={loading || !name.trim()}
        className="btn-ghost px-4 py-2 text-sm"
      >
        追加
      </button>
    </form>
  );
}
