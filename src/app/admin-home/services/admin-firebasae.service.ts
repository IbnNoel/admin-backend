import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AdminFirebasaeService {

  readonly baseURL = 'https://us-central1-marriagebandits.cloudfunctions.net';

  constructor( private http: HttpClient) {
  }

  deleteFBUser(uid) {
    return this.http.delete<void>(`${this.baseURL}/deleteUser?uid=${uid}`);
  }

  disableUser(uid) {
    return this.http.patch(`${this.baseURL}/disableUser?uid=${uid}`,{});
  }
}
