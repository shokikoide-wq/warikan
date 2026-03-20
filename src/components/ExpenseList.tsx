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
      <div className="text-center text-gray-400/70 py-10 text-sm">
        まだ支出がありません
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      {expenses.map((expense) =>
        editingId === expense.id ? (
          <div
            key={expense.id}
            className="glass-card-strong p-4 space-y-3 animate-fade-in"
            style={{ borderColor: "rgba(124, 58, 237, 0.25)" }}
          >
            <div>
              <label className="section-label mb-1.5 block">
                支払った人
              </label>
              <select
                value={editPayerId}
                onChange={(e) => setEditPayerId(e.target.value)}
                className="glass-select text-sm"
              >
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
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="glass-input text-sm"
              />
            </div>
            <div>
              <label className="section-label mb-1.5 block">
                金額（円）
              </label>
              <input
                type="number"
                value={editAmount}
                onChange={(e) => setEditAmount(e.target.value)}
                min="1"
                className="glass-input text-sm"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="section-label">割り勘対象</label>
                <button
                  type="button"
                  onClick={() => setEditSplitAmong(members.map((m) => m.id))}
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
                      editSplitAmong.includes(m.id)
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
                onClick={cancelEdit}
                className="btn-ghost flex-1 py-2 text-sm"
              >
                キャンセル
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={loading}
                className="btn-gradient flex-1 py-2 text-sm"
              >
                {loading ? "保存中..." : "保存"}
              </button>
            </div>
          </div>
        ) : (
          <div
            key={expense.id}
            className="glass-card p-4 cursor-pointer hover:scale-[1.01] transition-all duration-200"
            onClick={() => startEdit(expense)}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="font-medium text-gray-800">{expense.title}</div>
                <div className="text-sm text-gray-500 mt-0.5">
                  {getMemberName(expense.payerId)} が支払い
                </div>
                {expense.splitAmong.length < members.length && (
                  <div className="text-xs text-gray-400 mt-1">
                    対象: {expense.splitAmong.map(getMemberName).join("、")}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2.5">
                <span className="font-bold text-lg bg-gradient-to-r from-purple-700 to-indigo-600 bg-clip-text text-transparent">
                  {formatCurrency(expense.amount)}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(expense.id);
                  }}
                  className="delete-btn text-sm"
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
