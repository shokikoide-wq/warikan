"use client";

import { useState } from "react";
import { Member } from "@/types";

interface ExpenseFormProps {
  members: Member[];
  onSubmit: (
    payerId: string,
    title: string,
    amount: number,
    splitAmong: string[]
  ) => Promise<void>;
}

export default function ExpenseForm({ members, onSubmit }: ExpenseFormProps) {
  const [payerId, setPayerId] = useState("");
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [splitAmong, setSplitAmong] = useState<string[]>(
    members.map((m) => m.id)
  );
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const toggleMember = (id: string) => {
    setSplitAmong((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  const selectAll = () => setSplitAmong(members.map((m) => m.id));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!payerId || !title.trim() || !amount || splitAmong.length === 0) return;

    setLoading(true);
    try {
      await onSubmit(payerId, title.trim(), parseInt(amount, 10), splitAmong);
      setTitle("");
      setAmount("");
      setPayerId("");
      setSplitAmong(members.map((m) => m.id));
      setIsOpen(false);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="btn-gradient w-full py-3.5 text-base"
      >
        + 支出を追加
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="glass-card-strong p-5 space-y-4 animate-fade-in-up"
    >
      <h3 className="font-semibold text-gray-800">支出を追加</h3>

      <div>
        <label className="section-label mb-1.5 block">支払った人</label>
        <select
          value={payerId}
          onChange={(e) => setPayerId(e.target.value)}
          className="glass-select"
        >
          <option value="">選択してください</option>
          {members.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="section-label mb-1.5 block">内容</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="例: 夕食代"
          className="glass-input"
        />
        <div className="flex flex-wrap gap-1.5 mt-2.5">
          {["飲食費", "交通費", "宿泊費", "買い物", "その他"].map((label) => (
            <button
              key={label}
              type="button"
              onClick={() => setTitle(label)}
              className={`quick-tag ${
                title === label ? "quick-tag-active" : "quick-tag-inactive"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="section-label mb-1.5 block">金額（円）</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0"
          min="1"
          className="glass-input"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="section-label">割り勘対象</label>
          <button
            type="button"
            onClick={selectAll}
            className="text-xs font-medium bg-gradient-to-r from-purple-600 to-indigo-500 bg-clip-text text-transparent hover:opacity-70 transition-opacity"
          >
            全員選択
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {members.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => toggleMember(m.id)}
              className={`glass-pill text-sm ${
                splitAmong.includes(m.id)
                  ? "glass-pill-active"
                  : "glass-pill-inactive"
              }`}
            >
              {m.name}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-2.5 pt-1">
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="btn-ghost flex-1 py-2.5"
        >
          キャンセル
        </button>
        <button
          type="submit"
          disabled={loading || !payerId || !title.trim() || !amount}
          className="btn-gradient flex-1 py-2.5"
        >
          {loading ? "追加中..." : "追加"}
        </button>
      </div>
    </form>
  );
}
