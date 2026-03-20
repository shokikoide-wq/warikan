export interface Member {
  id: string;
  name: string;
}

export interface Expense {
  id: string;
  payerId: string;
  title: string;
  amount: number;
  splitAmong: string[];
  createdAt: string;
}

export interface Group {
  id: string;
  name: string;
  members: Member[];
  expenses: Expense[];
  createdAt: string;
}

export interface Settlement {
  fromId: string;
  toId: string;
  amount: number;
}
