import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import { CommonModule, KeyValuePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-group-detail',
  imports: [CommonModule, RouterModule, FormsModule, KeyValuePipe],
  templateUrl: './group-details.component.html',
  styleUrls: ['./group-details.component.css']
})
export class GroupDetailsComponent implements OnInit {
  group: any;
  expenses: any[] = [];
  balances: { [key: string]: number } = {};
  settlements: any[] = [];
  isLoading = true;
  groupId!: number;
  
  payments: any[] = [];
  currentUserId: number | null = null; 

  showExpenseModal = false;
  newExpense = {
    description: '',
    amount: null,
    paidById: 0,
    groupId: 0
  };

  showPaymentModal = false;
  newPayment = {
    toUserId: null,
    amount: null,
    groupId: 0,
    fromUserId: 0
  };

  private apiUrl = 'https://localhost:44331/api'; 

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  get hasPendingPayments(): boolean {
    return this.payments.some(p => !p.isCompleted);
  }

  get hasCompletedPayments(): boolean {
    return this.payments.some(p => p.isCompleted);
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.groupId = +idParam;
      this.newExpense.groupId = this.groupId;
      this.newPayment.groupId = this.groupId;
      this.currentUserId = parseInt(localStorage.getItem('userId') || '0', 10);
      this.newExpense.paidById = this.currentUserId;
      this.newPayment.fromUserId = this.currentUserId;
      this.loadAllGroupData();
    }
  }
  
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  loadAllGroupData(): void {
    this.isLoading = true;
    const headers = this.getAuthHeaders();
    const groupDetails$ = this.http.get(`${this.apiUrl}/group/${this.groupId}/details`, { headers });
    const expenses$ = this.http.get(`${this.apiUrl}/expense/group/${this.groupId}`, { headers });
    const balances$ = this.http.get(`${this.apiUrl}/expense/group/${this.groupId}/balances`, { headers });
    const payments$ = this.http.get(`${this.apiUrl}/payment/group/${this.groupId}`, { headers });

    forkJoin([groupDetails$, expenses$, balances$, payments$]).subscribe({
      next: ([groupData, expenseData, balanceData, paymentData]: [any, any, any, any]) => {
        this.group = groupData;
        // Sorting expenses to show newest first
        this.expenses = expenseData.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        this.balances = balanceData.balances;
        this.settlements = balanceData.settlements;
        this.payments = paymentData.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load group data', err);
        this.isLoading = false;
      }
    });
  }

  onMakePayment(): void {
    if (!this.newPayment.toUserId || !this.newPayment.amount || this.newPayment.amount <= 0) {
      alert('Please select a recipient and enter a valid amount.');
      return;
    }
    if (this.newPayment.fromUserId === this.newPayment.toUserId) {
      alert("You cannot record a payment to yourself.");
      return;
    }
    
    this.http.post(`${this.apiUrl}/payment`, this.newPayment, { headers: this.getAuthHeaders() })
      .subscribe({
        next: () => {
          this.showPaymentModal = false;
          this.newPayment.toUserId = null;
          this.newPayment.amount = null;
          this.loadAllGroupData();
        },
        error: (err) => {
          console.error('Failed to record payment', err);
          alert('Error recording payment. Please try again.');
        }
      });
  }
  
  onCompletePayment(paymentId: number): void {
    
    if (!confirm('Are you sure you have received this payment? This will permanently update the group balances.')) {
        return;
    }
    this.http.put(`${this.apiUrl}/payment/${paymentId}/complete`, {}, { headers: this.getAuthHeaders() })
        .subscribe({
            next: (response: any) => {
              
                this.balances = response.balances;
                this.settlements = response.settlements;
              
                const confirmedPayment = this.payments.find(p => p.id === paymentId);
                if (confirmedPayment) {
                    confirmedPayment.isCompleted = true;
                }
            },
            error: (err) => {
                console.error('Failed to confirm payment', err);
                alert('An error occurred while confirming the payment.');
            }
        });
  }
 //helper method
  getMemberName(memberId: number): string {
    const member = this.group?.members.find((m: any) => m.id === memberId);
    return member ? member.username : 'Unknown';
  }

  getBalanceClass(balance: number): string {
    if (balance > 0) return 'balance-positive';
    if (balance < 0) return 'balance-negative';
    return 'balance-neutral';
  }

  onAddExpense(): void {
    if (!this.newExpense.description || !this.newExpense.amount) {
      alert('Description and amount are required.');
      return;
    }

    this.http.post(`${this.apiUrl}/expense`, this.newExpense, { headers: this.getAuthHeaders() }).subscribe({
      next: (response: any) => {
        this.showExpenseModal = false;
        this.newExpense.description = '';
        this.newExpense.amount = null;
        this.balances = response.balances;
        this.settlements = response.settlements;
        this.loadAllGroupData(); //  reloads all data including the new expense
      },
      error: (err) => {
        console.error('Failed to add expense', err);
        alert('Error adding expense. Please try again.');
      }
    });
  }
}
