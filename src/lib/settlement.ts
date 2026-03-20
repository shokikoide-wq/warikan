import { Group, Settlement } from "@/types";

export function calculateSettlements(group: Group): Settlement[] {
  const balances = new Map<string, number>();

  group.members.forEach((m) => balances.set(m.id, 0));

  group.expenses.forEach((expense) => {
    const splitCount = expense.splitAmong.length;
    if (splitCount === 0) return;

    const perPerson = Math.floor(expense.amount / splitCount);
    const remainder = expense.amount - perPerson * splitCount;

    // Payer gets credited the full amount
    balances.set(
      expense.payerId,
      (balances.get(expense.payerId) ?? 0) + expense.amount
    );

    // Each participant gets debited their share
    expense.splitAmong.forEach((memberId, i) => {
      const share = perPerson + (i < remainder ? 1 : 0);
      balances.set(memberId, (balances.get(memberId) ?? 0) - share);
    });
  });

  const creditors: { id: string; amount: number }[] = [];
  const debtors: { id: string; amount: number }[] = [];

  balances.forEach((balance, id) => {
    if (balance > 0) creditors.push({ id, amount: balance });
    else if (balance < 0) debtors.push({ id, amount: -balance });
  });

  creditors.sort((a, b) => b.amount - a.amount);
  debtors.sort((a, b) => b.amount - a.amount);

  const settlements: Settlement[] = [];
  let ci = 0,
    di = 0;

  while (ci < creditors.length && di < debtors.length) {
    const transfer = Math.min(creditors[ci].amount, debtors[di].amount);
    if (transfer > 0) {
      settlements.push({
        fromId: debtors[di].id,
        toId: creditors[ci].id,
        amount: transfer,
      });
    }
    creditors[ci].amount -= transfer;
    debtors[di].amount -= transfer;
    if (creditors[ci].amount === 0) ci++;
    if (debtors[di].amount === 0) di++;
  }

  return settlements;
}
