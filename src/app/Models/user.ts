export interface User {
  id: number;
  username: string;
  email: string;
  isAdmin: boolean;
  createdAt?: Date;
}

export interface Login {
  email: string;
  password: string;
}

export interface Register {
  username: string;
  email: string;
  password: string;
  isAdmin: boolean;
}