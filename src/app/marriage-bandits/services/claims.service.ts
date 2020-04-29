import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Claim } from '../models/claim';
import { Observable } from 'rxjs';
import { ApiResponse } from 'src/app/shared/services/Mongodb/api-response';

@Injectable({
  providedIn: 'root'
})
export class ClaimsService {
  readonly url = 'https://marriage-bandits.herokuapp.com/claims';

  constructor(private http: HttpClient) { }

  getClaims() {
    return this.http.get(`${this.url}/all`);
  }
  getClaim(id) {
    return this.http.get(`${this.url}/${id}`);
  }
  makeClaime(claim) {
    return this.http.post<ApiResponse<any>>(`${this.url}/makeClaim`,  claim);
  }
  deleteClaim(id) {
    return this.http.get(`${this.url}/deleteClaim/${id}`)
  }

}