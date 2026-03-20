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
        className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700"
      >
        + 支出を追加
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-lg border border-gray-200 p-4 space-y-4"
    >
      <h3 className="font-medium">支出を追加</h3>

      <div>
        <label className="block text-sm text-gray-600 mb-1">支払った人</label>
        <select
          value={payerId}
          onChange={(e) => setPayerId(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
        <label className="block text-sm text-gray-600 mb-1">内容</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="例: 夕食代"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label className="block text-sm text-gray-600 mb-1">金額（円）</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0"
          min="1"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-sm text-gray-600">割り勘対象</label>
          <button
            type="button"
            onClick={selectAll}
            className="text-xs text-indigo-600 hover:text-indigo-800"
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
              className={`px-3 py-1 rounded-full text-sm border ${
                splitAmong.includes(m.id)
                  ? "bg-indigo-100 border-indigo-300 text-indigo-700"
                  : "bg-gray-50 border-gray-200 text-gray-500"
              }`}
            >
              {m.name}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="flex-1 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50"
        >
          キャンセル
        </button>
        <button
          type="submit"
          disabled={loading || !payerId || !title.trim() || !amount}
          className="flex-1 bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? "追加中..." : "追加"}
        </button>
      </div>
    </form>
  );
}
