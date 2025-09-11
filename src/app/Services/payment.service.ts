import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


export interface Payment {
  id: number;
  fromUserId: number;
  fromUserName: string;
  toUserId: number;
  toUserName: string;
  amount: number;
  createdAt: string;
  isCompleted: boolean;
}

export interface CreatePaymentDTO {
  groupId: number;
  toUserId: number;
  amount: number;
}

// Interface for the response from the complete payment endpoint
export interface PaymentCompletionResponse {
  message: string;
  balances: { [key: number]: number };
  settlements: any[]; 
}


@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = `https://localhost:44331/api/Payment`;

  constructor(private http: HttpClient) { }

  // Creating a new payment record
  createPayment(paymentData: CreatePaymentDTO): Observable<any> {
    return this.http.post(this.apiUrl, paymentData);
  }

  // Gets all payments for a specific group
  getPaymentsForGroup(groupId: number): Observable<Payment[]> {
    return this.http.get<Payment[]>(`${this.apiUrl}/group/${groupId}`);
  }

  // Marks a payment as completed
  completePayment(paymentId: number): Observable<PaymentCompletionResponse> {
    return this.http.put<PaymentCompletionResponse>(`${this.apiUrl}/${paymentId}/complete`, {});
  }
}