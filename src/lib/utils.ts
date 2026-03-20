export function formatCurrency(amount: number): string {
  return `¥${amount.toLocaleString("ja-JP")}`;
}
