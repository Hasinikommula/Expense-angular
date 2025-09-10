export interface Payment {
  id: number;
  amount: number;
  fromUserId: number;
  fromUsername: string;
  toUserId: number;
  toUsername: string;
  groupId: number;
  isCompleted: boolean;
  createdAt: Date;
  completedAt?: Date;
}

export interface CreatePaymentDTO {
  fromUserId: number;
  toUserId: number;
  amount: number;
  groupId: number;
}