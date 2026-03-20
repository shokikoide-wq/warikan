"use client";

import { Expense, Member } from "@/types";
import { formatCurrency } from "@/lib/utils";

interface ExpenseListProps {
  expenses: Expense[];
  members: Member[];
  onDelete: (id: string) => Promise<void>;
}

export default function ExpenseList({
  expenses,
  members,
  onDelete,
}: ExpenseListProps) {
  const getMemberName = (id: string) =>
    members.find((m) => m.id === id)?.name ?? "不明";

  if (expenses.length === 0) {
    return (
      <div className="text-center text-gray-400 py-8">
        まだ支出がありません
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {expenses.map((expense) => (
        <div
          key={expense.id}
          className="bg-white rounded-lg border border-gray-200 p-4"
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
                onClick={() => onDelete(expense.id)}
                className="text-gray-300 hover:text-red-500 text-sm"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
