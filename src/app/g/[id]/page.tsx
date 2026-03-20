"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { Group } from "@/types";
import { getGroup, addMember, deleteMember, addExpense, updateExpense, deleteExpense } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import ExpenseForm from "@/components/ExpenseForm";
import ExpenseList from "@/components/ExpenseList";
import SettlementView from "@/components/SettlementView";
import ShareButton from "@/components/ShareButton";
import AddMemberForm from "@/components/AddMemberForm";

export default function GroupPage() {
  const params = useParams();
  const groupId = params.id as string;

  const [group, setGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchGroup = useCallback(async () => {
    try {
      const data = await getGroup(groupId);
      if (!data) {
        setError("グループが見つかりません");
      } else {
        setGroup(data);
      }
    } catch {
      setError("データの取得に失敗しました");
    } finally {
      setLoading(false);
    }
  }, [groupId]);

  useEffect(() => {
    fetchGroup();
  }, [fetchGroup]);

  const handleAddMember = async (name: string) => {
    await addMember(groupId, name);
    await fetchGroup();
  };

  const handleDeleteMember = async (memberId: string) => {
    const memberExpenses = group?.expenses.filter(
      (e) => e.payerId === memberId || e.splitAmong.includes(memberId)
    );
    if (memberExpenses && memberExpenses.length > 0) {
      alert("このメンバーに関連する支出があるため削除できません。先に支出を削除してください。");
      return;
    }
    await deleteMember(memberId);
    await fetchGroup();
  };

  const handleAddExpense = async (
    payerId: string,
    title: string,
    amount: number,
    splitAmong: string[]
  ) => {
    await addExpense(groupId, payerId, title, amount, splitAmong);
    await fetchGroup();
  };

  const handleEditExpense = async (
    expenseId: string,
    payerId: string,
    title: string,
    amount: number,
    splitAmong: string[]
  ) => {
    await updateExpense(expenseId, payerId, title, amount, splitAmong);
    await fetchGroup();
  };

  const handleDeleteExpense = async (expenseId: string) => {
    await deleteExpense(expenseId);
    await fetchGroup();
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="text-gray-400">読み込み中...</div>
      </div>
    );
  }

  if (error || !group) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 mb-4">{error || "グループが見つかりません"}</div>
        <a href="/" className="text-indigo-600 hover:text-indigo-800">
          トップに戻る
        </a>
      </div>
    );
  }

  const totalAmount = group.expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{group.name}</h1>
        <div className="text-sm text-gray-500 mt-1">
          {group.members.length}人 ・ 合計 {formatCurrency(totalAmount)}
        </div>
      </div>

      {/* メンバー */}
      <div>
        <h2 className="text-sm font-medium text-gray-500 mb-2">メンバー</h2>
        <div className="flex flex-wrap gap-2 mb-2">
          {group.members.map((m) => (
            <span
              key={m.id}
              className="inline-flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full text-sm"
            >
              {m.name}
              <button
                onClick={() => handleDeleteMember(m.id)}
                className="text-gray-300 hover:text-red-500 ml-1"
              >
                ✕
              </button>
            </span>
          ))}
        </div>
        <AddMemberForm onAdd={handleAddMember} />
      </div>

      {/* 支出追加 */}
      {group.members.length >= 2 && (
        <ExpenseForm members={group.members} onSubmit={handleAddExpense} />
      )}

      {/* 支出一覧 */}
      <div>
        <h2 className="text-sm font-medium text-gray-500 mb-2">支出一覧</h2>
        <ExpenseList
          expenses={group.expenses}
          members={group.members}
          onDelete={handleDeleteExpense}
          onEdit={handleEditExpense}
        />
      </div>

      {/* 精算結果 */}
      <SettlementView group={group} />

      {/* 共有 */}
      <ShareButton groupId={groupId} />
    </div>
  );
}
