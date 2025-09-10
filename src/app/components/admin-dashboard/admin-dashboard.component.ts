import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GroupService } from '../../Services/group.service';
import { Router } from '@angular/router';

interface User {
  id: number;
  name: string;
  email: string;
}

interface Group {
  id: number;
  name: string;
  description: string;
  members: number;
  total: number;
}

interface Assignment {
  userEmail: string;
  groupName: string;
}

@Component({
  selector: 'app-admin-dashboard',
  imports:[CommonModule,FormsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  activeSection: 'overview' | 'users' | 'manage' = 'overview';
  users: any[] = [];
  groups: any[] = [];

  // Inline form toggles
  showUserForm = false;
  showGroupForm = false;

  showAssignForm = false; 
  assignments: Assignment[] = [];
  successMessage: string = '';

  // Form models
  newUser = { username: '', email: '', password: '' };
  newGroup = { name: '', description: '' };
  AssigningGroup: string = '';
  Email: string = '';

  private readonly apiUrl = 'https://localhost:44331/api';

  constructor(private http: HttpClient,private groupService:GroupService,private router:Router) {}

  ngOnInit(): void {
    this.getUsers();
    this.getGroups();
    this.getAssignments();
  }

  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    if (token) headers = headers.set('Authorization', `Bearer ${token}`);
    return { headers };
  }

  showSection(section: 'overview' | 'users'|'manage') {
    this.activeSection = section;
    if (section === 'overview') this.getGroups();
    if (section === 'users') this.getUsers();
    if(section==='manage') this.getAssignments();
  }

  // Toggle forms
  toggleUserForm() {
    this.showUserForm = !this.showUserForm;
  }
  toggleGroupForm() {
    this.showGroupForm = !this.showGroupForm;
  }

  // Users
  getUsers() {
    this.http.get<any[]>(`${this.apiUrl}/user`, this.getAuthHeaders()).subscribe({
      next: res => this.users = res.map(u => ({ id: u.id, name: u.username, email: u.email })),
      error: err => console.error(err)
    });
  }
  getAssignments() {
    this.http.get<Assignment[]>(`${this.apiUrl}/group/assignments`, this.getAuthHeaders()).subscribe({
      next: res => {
        this.assignments = res;
      },
      error: err => console.error('Failed to fetch assignments', err)
    });
  }

  createUser() {
  if (!this.newUser.username || !this.newUser.email || !this.newUser.password) {
    console.warn('Form is invalid');
    return;
  }

  this.http.post<any>(`${this.apiUrl}/auth/register`, this.newUser, this.getAuthHeaders()).subscribe({
    next: res => {
      this.users.unshift({ id: res.id, name: res.username, email: res.email });
      this.newUser = { username: '', email: '', password: '' }; // reset form
      this.showUserForm = false;
    },
    error: err => console.error(err)
  });
}
  // Groups
getGroups() {
  this.http.get<any[]>(`${this.apiUrl}/group/Getallgroups`, this.getAuthHeaders()).subscribe({
    next: (res) => {
      this.groups = res.map(g => ({
        id: g.id,
        name: g.name,
        description: g.description || '',
        members: g.memberCount, 
        total: g.total ?? 0 
      }));
    },
    error: (err) => {
      console.error('Failed to get groups:', err);
    }
  });
}

  createGroup() {
    this.http.post<any>(`${this.apiUrl}/group/CreateGroup`, this.newGroup, this.getAuthHeaders()).subscribe({
      next: res => {
        this.groups.unshift({ id: res.id, name: res.name, description: res.description, members: 0, total: 0 });
        this.newGroup = { name: '', description: '' };
        this.showGroupForm = false;
      },
      error: err => console.error(err)
    });
  }
  
  addUserToGroup(GroupName: string, email: string) {
  this.groupService.addUserToGroup(GroupName, email).subscribe({
    next: (res) => {
      alert("successfully added user to the group");
      console.log(`User ${email} added to group ${GroupName}`, res);
      this.Email = '';
      this.AssigningGroup = '';
    },
    error: (err) => {
      console.error('Error adding user to group', err);
    }
  });
}
logout(){
     localStorage.removeItem('token');
      this.router.navigate(['/login']);
  }
}