export interface Group {
  id: number;
  name: string;
  description?: string;
  adminId: number;
  createdAt?: Date;
  groupMembers?: GroupMember[];
}

export interface GroupMember {
  userId: number;
  username: string;
  email: string;
}

export interface CreateGroupDTO {
  name: string;
  description?: string;
  memberIds?: number[];
}

export interface AssigningUserDTO {
  email: string;
  groupName: string;
}