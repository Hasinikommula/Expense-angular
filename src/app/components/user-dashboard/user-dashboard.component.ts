import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-User-dashboard',
  imports:[FormsModule,CommonModule],
  templateUrl: './User-dashboard.component.html',
  styleUrls: ['./User-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit {
  apiUrl = 'https://localhost:44331/api'; // ✅ update with your backend base URL

  currentUser: any = { username: 'Guest' };
  view: 'dashboard' | 'groupDetail' = 'dashboard';

  groups: any[] = [];
  selectedGroup: any = null;
  expenses: any[] = [];
  balances: any[] = [];

  // Add expense form
  showAddExpenseForm = false;
  newExpense = {
    description: '',
    amount: 0,
    paidBy: ''
  };

  // Payment form
  payment = {
    from: '',
    to: '',
    amount: 0
  };
  paymentMessage = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadUser();
    this.getGroups();
  }

  // ------------------------------
  // Navbar actions
  // ------------------------------
  loadUser() {
    // Example: Fetch user profile from backend
    this.http.get<any>(`${this.apiUrl}/User/current`).subscribe({
      next: (res) => (this.currentUser = res),
      error: () => (this.currentUser = { username: 'DemoUser' })
    });
  }

  refreshDashboard() {
    this.getGroups();
  }

  openSettings() {
    alert('⚙ Settings page coming soon!');
  }

  logout() {
    alert('🚪 Logged out!');
    // Implement your AuthService logout here
  }

  // ------------------------------
  // Groups
  // ------------------------------
  getGroups() {
    this.http.get<any[]>(`${this.apiUrl}/Group`).subscribe({
      next: (res) => (this.groups = res),
      error: () => {
        // Fallback demo data
        this.groups = [
          {
            id: 1,
            name: 'Goa Trip',
            description: 'Friends Goa trip',
            members: [{ username: 'Hasini' }, { username: 'Aarav' }]
          },
          {
            id: 2,
            name: 'Office Lunch',
            description: 'Monthly lunch at office',
            members: [{ username: 'Kiran' }]
          }
        ];
      }
    });
  }

  createNewGroup() {
    alert('Create group modal coming soon!');
  }

  openGroup(group: any) {
    this.selectedGroup = group;
    this.view = 'groupDetail';
    this.getExpenses(group.id);
    this.getBalances(group.id);
  }

  goBack() {
    this.view = 'dashboard';
    this.selectedGroup = null;
    this.expenses = [];
    this.balances = [];
  }

  editGroup() {
    alert('Edit group functionality coming soon!');
  }

  // ------------------------------
  // Expenses
  // ------------------------------
  getExpenses(groupId: number) {
    this.http.get<any[]>(`${this.apiUrl}/Expense/${groupId}`).subscribe({
      next: (res) => (this.expenses = res),
      error: () => {
        // Fallback demo expenses
        this.expenses = [
          { description: 'Hotel', amount: 2000, paidBy: 'Hasini' },
          { description: 'Food', amount: 500, paidBy: 'Aarav' }
        ];
      }
    });
  }

  addExpenseManually() {
    this.showAddExpenseForm = true;
    this.newExpense = { description: '', amount: 0, paidBy: '' };
  }

  addExpense() {
    if (!this.selectedGroup) return;
    const payload = {
      groupId: this.selectedGroup.id,
      ...this.newExpense
    };

    this.http.post(`${this.apiUrl}/Expense`, payload).subscribe({
      next: () => {
        this.expenses.push({ ...this.newExpense });
        this.showAddExpenseForm = false;
        this.getBalances(this.selectedGroup.id);
      },
      error: () => {
        // Fallback if backend is not ready
        this.expenses.push({ ...this.newExpense });
        this.showAddExpenseForm = false;
      }
    });
  }

  cancelAddExpense() {
    this.showAddExpenseForm = false;
  }

  // ------------------------------
  // Balances
  // ------------------------------
  getBalances(groupId: number) {
    this.http.get<any[]>(`${this.apiUrl}/Balance/${groupId}`).subscribe({
      next: (res) => (this.balances = res),
      error: () => {
        // Dummy balances
        this.balances = [
          { from: 'Aarav', to: 'Hasini', amount: 250 },
          { from: 'Kiran', to: 'Hasini', amount: 100 }
        ];
      }
    });
  }

  // ------------------------------
  // Payments
  // ------------------------------
  makePayment() {
    if (!this.selectedGroup) return;
    const payload = {
      groupId: this.selectedGroup.id,
      ...this.payment
    };

    this.http.post(`${this.apiUrl}/Payment`, payload).subscribe({
      next: () => {
        this.paymentMessage = `✅ ${this.payment.from} paid ${this.payment.to} $${this.payment.amount}`;
        this.getBalances(this.selectedGroup.id);
        this.payment = { from: '', to: '', amount: 0 };
      },
      error: () => {
        this.paymentMessage = `✅ (Dummy) ${this.payment.from} paid ${this.payment.to} $${this.payment.amount}`;
        this.payment = { from: '', to: '', amount: 0 };
      }
    });
  }

  cancelPayment() {
    this.payment = { from: '', to: '', amount: 0 };
    this.paymentMessage = '';
  }
}
