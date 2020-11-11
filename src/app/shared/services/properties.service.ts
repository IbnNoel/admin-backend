import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { ApiResponse } from './Mongodb/api-response';

@Injectable({
  providedIn: 'root'
})
export class PropertiesService {

  readonly baseURL = `${environment.baseUrl}`;

  constructor(private http: HttpClient) { }
  
  searchProperty(pg: number,pgS: number, searchedUser) {
    return this.http.get<ApiResponse<any[]>>(`${this.baseURL}/forSale/dataTable?pg=${pg}&pgS=${pgS}&_id=${searchedUser._id}`)
  }

}
