import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  url = 'https://localhost:44331/api/Group';
  token  = "";
  constructor(private http: HttpClient , private authService : AuthService) {
    this.token = this.authService.getToken() || '';
   }
   getAllGroups(){
    return this.http.get(this.url+'/GetAllGroups', {
      headers: {
        Authorization: `Bearer ${this.token}`
      }
    });
   }
   getGroupById(id: number) {
     return this.http.get(`${this.url}/${id}`, {
       headers: {
         Authorization: `Bearer ${this.token}`
       }
     });
   }
   addGroup(group: any) {
     return this.http.post(this.url+ '/CreateGroup', group, {
       headers: {
         Authorization: `Bearer ${this.token}`
       }
     });
   }
   
   addUserToGroup(GroupName: string, email: string) {
      return this.http.post('https://localhost:44331/api/Group/AddUserToGroup', { GroupName, email }, { responseType: 'text' });
   }
     getGroupMembers(groupId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/Group/GetGroupMembers/${groupId}`);
  }
}
