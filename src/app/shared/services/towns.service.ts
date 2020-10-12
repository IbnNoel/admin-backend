import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class TownsService {

  readonly baseURL = `${environment.baseUrl}/towns`;

  constructor(private http: HttpClient) { }

  getTowns(pg, pgS, searchedQ) {
    return this.http.get(`${this.baseURL}/search?pg=${pg}&pgS=${pgS}&country=${searchedQ.country}`);
  }

  editCountryData(editObj) {
    return this.http.patch(`${this.baseURL}/editTowns/${editObj._id}`, editObj);
  }

  addCountryData(editObj) {
    return this.http.post(`${this.baseURL}/createTownsList/`, editObj);
  }

};