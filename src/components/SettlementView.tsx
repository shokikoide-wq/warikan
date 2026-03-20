"use client";

import { Group, Settlement, Member } from "@/types";
import { calculateSettlements } from "@/lib/settlement";
import { formatCurrency } from "@/lib/utils";

interface SettlementViewProps {
  group: Group;
}

export default function SettlementView({ group }: SettlementViewProps) {
  const settlements = calculateSettlements(group);
  const getMemberName = (id: string) =>
    group.members.find((m: Member) => m.id === id)?.name ?? "不明";

  if (group.expenses.length === 0) {
    return null;
  }

  const totalAmount = group.expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="font-medium mb-3">精算結果</h3>

      <div className="text-sm text-gray-500 mb-3">
        合計: {formatCurrency(totalAmount)}
      </div>

      {settlements.length === 0 ? (
        <div className="text-gray-400 text-sm">精算の必要はありません</div>
      ) : (
        <div className="space-y-3">
          {settlements.map((s: Settlement, i: number) => (
            <div
              key={i}
              className="flex items-center gap-2 bg-indigo-50 rounded-lg px-4 py-3"
            >
              <span className="font-medium">{getMemberName(s.fromId)}</span>
              <span className="text-gray-400">→</span>
              <span className="font-medium">{getMemberName(s.toId)}</span>
              <span className="ml-auto font-bold text-indigo-700">
                {formatCurrency(s.amount)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
