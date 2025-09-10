import { Routes } from '@angular/router';
import { UserDashboardComponent } from './components/user-dashboard/user-dashboard.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { LoginComponent } from './components/login/login.component';


import { GroupDetailsComponent } from './components/group-details/group-details.component';
import { AuthGuard } from './Guards/auth.guard';

export const routes: Routes = [

  {path:'user-dashboard',component:UserDashboardComponent,canActivate: [AuthGuard] },
  {path:'admin-dashboard',component:AdminDashboardComponent,canActivate: [AuthGuard] },
  {path:'login',component:LoginComponent},
  {path:'',component:LoginComponent},
  { path: 'groups/:id', component: GroupDetailsComponent,canActivate: [AuthGuard]  }
    
];
