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
    return this.http.get(`${this.baseURL}/for${searchedUser.searchType}/dataTable?pg=${pg}&pgS=${pgS}&propertyType=${searchedUser.propertyType}&city=${searchedUser.city}`)
  }

  updateProperty(property) {
    return this.http.patch(`${this.baseURL}/property/AdminEditProperty/${property._id}`, property);
  }

  updateEditPropertyData(property, type) {
    return this.http.patch(`${this.baseURL}/for${type}/AdminEdit/${property._id}`, property);
  }

}
