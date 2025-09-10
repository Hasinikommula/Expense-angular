export interface Expense {
  id: number;
  description: string;
  amount: number;
  paidById: number;
  paidBy?: string;
  groupId: number;
  createdAt: Date;
}

export interface ExpenseCreatingDTO {
  description: string;
  amount: number;
  paidById: number;
  groupId: number;
}

export interface Balance {
  userId: number;
  username: string;
  balance: number;
}

export interface Settlement {
  fromUserId: number;
  fromUsername: string;
  toUserId: number;
  toUsername: string;
  amount: number;
}