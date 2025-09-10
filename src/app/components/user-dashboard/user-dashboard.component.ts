import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-dashboard',
  
  imports: [CommonModule],
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit {
  groups: any[] = [];
  isLoading = true;
  private apiUrl = 'https://localhost:44331/api'; 

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  loadDashboardData(): void {
    this.isLoading = true;
    this.http.get<any[]>(`${this.apiUrl}/user/dashboard`, { headers: this.getAuthHeaders() }).subscribe({
      next: (data) => {
        this.groups = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load dashboard data', err);
        this.isLoading = false;
      }
    });
  }

  viewGroup(groupId: number): void {
    this.router.navigate(['/groups', groupId]);
  }

  getBalanceClass(balance: number): string {
    if (balance > 0) return 'balance-positive';
    if (balance < 0) return 'balance-negative';
    return 'balance-neutral';
  }

  getBalanceLabel(balance: number): string {
    if (balance > 0) return 'You are owed';
    if (balance < 0) return 'You owe';
    return 'Your balance:';
  }

  getAbsValue(value: number): number {
    return Math.abs(value);
  }
  logout(){
     localStorage.removeItem('token');
      this.router.navigate(['/login']);
  }
}