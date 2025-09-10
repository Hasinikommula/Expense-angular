import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AdminDashboardComponent } from "./components/admin-dashboard/admin-dashboard.component";
import { UserDashboardComponent } from "./components/user-dashboard/user-dashboard.component";

@Component({
  selector: 'app-root',
  imports: [UserDashboardComponent, AdminDashboardComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'ExpenseShare';
}
