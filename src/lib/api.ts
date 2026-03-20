import { getSupabase } from "./supabase";
import { Group, Member, Expense } from "@/types";
import { nanoid } from "nanoid";

export async function createGroup(
  name: string,
  memberNames: string[]
): Promise<string> {
  const groupId = nanoid(8);

  const { error: groupError } = await getSupabase()
    .from("groups")
    .insert({ id: groupId, name });

  if (groupError) throw groupError;

  if (memberNames.length > 0) {
    const members = memberNames.map((n) => ({
      group_id: groupId,
      name: n,
    }));
    const { error: membersError } = await getSupabase()
      .from("members")
      .insert(members);
    if (membersError) throw membersError;
  }

  return groupId;
}

export async function getGroup(id: string): Promise<Group | null> {
  const { data: groupData, error: groupError } = await getSupabase()
    .from("groups")
    .select("*")
    .eq("id", id)
    .single();

  if (groupError || !groupData) return null;

  const { data: membersData } = await getSupabase()
    .from("members")
    .select("*")
    .eq("group_id", id)
    .order("created_at", { ascending: true });

  const { data: expensesData } = await getSupabase()
    .from("expenses")
    .select("*, expense_splits(member_id)")
    .eq("group_id", id)
    .order("created_at", { ascending: false });

  const members: Member[] = (membersData ?? []).map((m) => ({
    id: m.id,
    name: m.name,
  }));

  const expenses: Expense[] = (expensesData ?? []).map((e) => ({
    id: e.id,
    payerId: e.payer_id,
    title: e.title,
    amount: e.amount,
    splitAmong: (e.expense_splits ?? []).map(
      (s: { member_id: string }) => s.member_id
    ),
    createdAt: e.created_at,
  }));

  return {
    id: groupData.id,
    name: groupData.name,
    members,
    expenses,
    createdAt: groupData.created_at,
  };
}

export async function addMember(
  groupId: string,
  name: string
): Promise<Member> {
  const { data, error } = await getSupabase()
    .from("members")
    .insert({ group_id: groupId, name })
    .select()
    .single();

  if (error || !data) throw error;
  return { id: data.id, name: data.name };
}

export async function deleteMember(memberId: string): Promise<void> {
  const { error } = await getSupabase()
    .from("members")
    .delete()
    .eq("id", memberId);
  if (error) throw error;
}

export async function addExpense(
  groupId: string,
  payerId: string,
  title: string,
  amount: number,
  splitAmong: string[]
): Promise<Expense> {
  const { data, error } = await getSupabase()
    .from("expenses")
    .insert({
      group_id: groupId,
      payer_id: payerId,
      title,
      amount,
    })
    .select()
    .single();

  if (error || !data) throw error;

  if (splitAmong.length > 0) {
    const splits = splitAmong.map((memberId) => ({
      expense_id: data.id,
      member_id: memberId,
    }));
    const { error: splitsError } = await getSupabase()
      .from("expense_splits")
      .insert(splits);
    if (splitsError) throw splitsError;
  }

  return {
    id: data.id,
    payerId: data.payer_id,
    title: data.title,
    amount: data.amount,
    splitAmong,
    createdAt: data.created_at,
  };
}

export async function updateExpense(
  expenseId: string,
  payerId: string,
  title: string,
  amount: number,
  splitAmong: string[]
): Promise<void> {
  const { error } = await getSupabase()
    .from("expenses")
    .update({ payer_id: payerId, title, amount })
    .eq("id", expenseId);
  if (error) throw error;

  // Delete existing splits and re-insert
  const { error: deleteError } = await getSupabase()
    .from("expense_splits")
    .delete()
    .eq("expense_id", expenseId);
  if (deleteError) throw deleteError;

  if (splitAmong.length > 0) {
    const splits = splitAmong.map((memberId) => ({
      expense_id: expenseId,
      member_id: memberId,
    }));
    const { error: splitsError } = await getSupabase()
      .from("expense_splits")
      .insert(splits);
    if (splitsError) throw splitsError;
  }
}

export async function deleteExpense(expenseId: string): Promise<void> {
  const { error } = await getSupabase()
    .from("expenses")
    .delete()
    .eq("id", expenseId);
  if (error) throw error;
}
