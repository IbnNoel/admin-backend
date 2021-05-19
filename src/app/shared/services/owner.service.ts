import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponse } from './Mongodb/api-response';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class OwnerService {

  readonly baseURL = `${environment.baseUrl}/owner`;
  constructor(private http: HttpClient) { }

  searchOwner(pg: number,pgS: number, searchedUser) {
    return this.http.get<ApiResponse<any[]>>(`${this.baseURL}/viewOwnerProp?pg=${pg}&pgS=${pgS}&name=${searchedUser.name}&date=${searchedUser.date}`)
  }
}
