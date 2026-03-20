"use client";

import { useState } from "react";
import { Expense, Member } from "@/types";
import { formatCurrency } from "@/lib/utils";

interface ExpenseListProps {
  expenses: Expense[];
  members: Member[];
  onDelete: (id: string) => Promise<void>;
  onEdit: (
    id: string,
    payerId: string,
    title: string,
    amount: number,
    splitAmong: string[]
  ) => Promise<void>;
}

export default function ExpenseList({
  expenses,
  members,
  onDelete,
  onEdit,
}: ExpenseListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPayerId, setEditPayerId] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editAmount, setEditAmount] = useState("");
  const [editSplitAmong, setEditSplitAmong] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const getMemberName = (id: string) =>
    members.find((m) => m.id === id)?.name ?? "不明";

  const startEdit = (expense: Expense) => {
    setEditingId(expense.id);
    setEditPayerId(expense.payerId);
    setEditTitle(expense.title);
    setEditAmount(String(expense.amount));
    setEditSplitAmong(expense.splitAmong);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const toggleMember = (id: string) => {
    setEditSplitAmong((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  const handleSave = async () => {
    if (
      !editingId ||
      !editPayerId ||
      !editTitle.trim() ||
      !editAmount ||
      editSplitAmong.length === 0
    )
      return;
    setLoading(true);
    try {
      await onEdit(
        editingId,
        editPayerId,
        editTitle.trim(),
        parseInt(editAmount, 10),
        editSplitAmong
      );
      setEditingId(null);
    } finally {
      setLoading(false);
    }
  };

  if (expenses.length === 0) {
    return (
      <div className="text-center text-gray-400 py-8">
        まだ支出がありません
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {expenses.map((expense) =>
        editingId === expense.id ? (
          <div
            key={expense.id}
            className="bg-white rounded-lg border border-indigo-300 p-4 space-y-3"
          >
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                支払った人
              </label>
              <select
                value={editPayerId}
                onChange={(e) => setEditPayerId(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
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
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                金額（円）
              </label>
              <input
                type="number"
                value={editAmount}
                onChange={(e) => setEditAmount(e.target.value)}
                min="1"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm text-gray-600">割り勘対象</label>
                <button
                  type="button"
                  onClick={() => setEditSplitAmong(members.map((m) => m.id))}
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
                      editSplitAmong.includes(m.id)
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
                onClick={cancelEdit}
                className="flex-1 py-2 rounded-lg border border-gray-300 text-gray-600 text-sm hover:bg-gray-50"
              >
                キャンセル
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={loading}
                className="flex-1 bg-indigo-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
              >
                {loading ? "保存中..." : "保存"}
              </button>
            </div>
          </div>
        ) : (
          <div
            key={expense.id}
            className="bg-white rounded-lg border border-gray-200 p-4 cursor-pointer hover:border-gray-300"
            onClick={() => startEdit(expense)}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="font-medium">{expense.title}</div>
                <div className="text-sm text-gray-500">
                  {getMemberName(expense.payerId)} が支払い
                </div>
                {expense.splitAmong.length < members.length && (
                  <div className="text-xs text-gray-400 mt-1">
                    対象: {expense.splitAmong.map(getMemberName).join("、")}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg">
                  {formatCurrency(expense.amount)}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(expense.id);
                  }}
                  className="text-gray-300 hover:text-red-500 text-sm"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
}
