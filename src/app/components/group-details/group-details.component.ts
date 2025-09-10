import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,  RouterModule } from '@angular/router';
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
  
  showExpenseModal = false;
  newExpense = {
    description: '',
    amount: null,
    paidById: 0, // Will be set to the current user's ID
    groupId: 0
  };

  showPaymentModal = false;
  newPayment = {
    fromUserId: 0, // Will be set to the current user's ID
    toUserId: null as number | null, // The person they are paying
    amount: null as number | null,
    groupId: 0,
    isCompleted: true // Automatically mark as completed
  };

  private apiUrl = 'https://localhost:44331/api'; 

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
     this.groupId = +idParam;
    this.newExpense.groupId = this.groupId;
    this.newPayment.groupId = this.groupId;

    //Gets the current user's ID once from localStorage
    const currentUserId = parseInt(localStorage.getItem('userId') || '0', 10);

    //Assigns the ID to both newExpense and newPayment
    this.newExpense.paidById = currentUserId;
    this.newPayment.fromUserId = currentUserId;
    
    //Loads all the data
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
    const groupDetails$ = this.http.get(`${this.apiUrl}/group/${this.groupId}/details`, { headers: this.getAuthHeaders() });
    const expenses$ = this.http.get(`${this.apiUrl}/expense/group/${this.groupId}`, { headers: this.getAuthHeaders() });
    const balances$ = this.http.get(`${this.apiUrl}/expense/group/${this.groupId}/balances`, { headers: this.getAuthHeaders() });

    forkJoin([groupDetails$, expenses$, balances$]).subscribe({
      next: ([groupData, expenseData, balanceData]: [any, any, any]) => {
        this.group = groupData;
        this.expenses = expenseData;
        this.balances = balanceData.balances;
        this.settlements = balanceData.settlements;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load group data', err);
        this.isLoading = false;
      }
    });
  }
 onMakePayment(): void {
  // --- Validation checks ---
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
      next: (response: any) => {
        console.log('Payment recorded. API response:', response);
        
       
        this.balances = response.balances;
        this.settlements = response.settlements;

        // Closes the modal and reset the form
        this.showPaymentModal = false;
        this.newPayment.toUserId = null;
        this.newPayment.amount = null;
      },
      error: (err) => {
        console.error('Failed to record payment', err);
        alert('Error recording payment. Please try again.');
      }
  });
}

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
      next: () => {
        this.showExpenseModal = false;
        this.newExpense.description = '';
        this.newExpense.amount = null;
        this.loadAllGroupData(); // Refreshes the data
      },
      error: (err) => {
        console.error('Failed to add expense', err);
        alert('Error adding expense. Please try again.');
      }
    });
  }
}