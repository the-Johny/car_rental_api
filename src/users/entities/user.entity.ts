// src/users/entities/user.entity.ts
export class User {
  id: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  role: 'ADMIN' | 'AGENT' | 'CUSTOMER';
  createdAt: Date;
  updatedAt: Date;
}
