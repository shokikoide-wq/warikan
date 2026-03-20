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
    <div className="glass-card-strong p-5">
      <h3 className="font-semibold text-gray-800 mb-3">精算結果</h3>

      <div className="text-sm text-gray-500 mb-4">
        合計: {formatCurrency(totalAmount)}
      </div>

      {settlements.length === 0 ? (
        <div className="text-gray-400/70 text-sm">精算の必要はありません</div>
      ) : (
        <div className="space-y-2.5">
          {settlements.map((s: Settlement, i: number) => (
            <div
              key={i}
              className="settlement-row flex items-center gap-2"
            >
              <span className="font-medium text-gray-800">{getMemberName(s.fromId)}</span>
              <span className="text-purple-300">→</span>
              <span className="font-medium text-gray-800">{getMemberName(s.toId)}</span>
              <span className="ml-auto font-bold bg-gradient-to-r from-purple-700 to-indigo-600 bg-clip-text text-transparent">
                {formatCurrency(s.amount)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
