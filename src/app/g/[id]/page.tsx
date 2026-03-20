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
      <div className="flex justify-center py-16">
        <div className="text-purple-400/60 animate-fade-in">読み込み中...</div>
      </div>
    );
  }

  if (error || !group) {
    return (
      <div className="text-center py-16 animate-fade-in">
        <div className="text-gray-500 mb-4">{error || "グループが見つかりません"}</div>
        <a
          href="/"
          className="bg-gradient-to-r from-purple-600 to-indigo-500 bg-clip-text text-transparent font-medium hover:opacity-70 transition-opacity"
        >
          トップに戻る
        </a>
      </div>
    );
  }

  const totalAmount = group.expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-700 via-indigo-600 to-blue-600 bg-clip-text text-transparent">
          {group.name}
        </h1>
        <div className="text-sm text-gray-500 mt-1.5">
          {group.members.length}人 ・ 合計 {formatCurrency(totalAmount)}
        </div>
      </div>

      {/* Members */}
      <div className="glass-card-strong p-4">
        <h2 className="section-label mb-3">メンバー</h2>
        <div className="flex flex-wrap gap-2 mb-3">
          {group.members.map((m) => (
            <span
              key={m.id}
              className="glass-pill inline-flex items-center gap-1.5"
            >
              {m.name}
              <button
                onClick={() => handleDeleteMember(m.id)}
                className="delete-btn ml-0.5 text-xs"
              >
                ✕
              </button>
            </span>
          ))}
        </div>
        <AddMemberForm onAdd={handleAddMember} />
      </div>

      {/* Add Expense */}
      {group.members.length >= 2 && (
        <ExpenseForm members={group.members} onSubmit={handleAddExpense} />
      )}

      {/* Expense List */}
      <div>
        <h2 className="section-label mb-3">支出一覧</h2>
        <ExpenseList
          expenses={group.expenses}
          members={group.members}
          onDelete={handleDeleteExpense}
          onEdit={handleEditExpense}
        />
      </div>

      {/* Settlement */}
      <SettlementView group={group} />

      {/* Share */}
      <ShareButton groupId={groupId} />
    </div>
  );
}
