import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PropertyNewsService {

  readonly baseURL = `${environment.baseUrl}/news`;

  constructor(private http: HttpClient) { }

  getDataTable(pg, pgS, data): Observable<any> {
    let urlParams: HttpParams = new HttpParams();
    urlParams = {...urlParams, pgS, pg, userId: data.userId, articleHeadline: data.articleHeadline} as any;
    return this.http.get(`${this.baseURL}/datatable`, {params: urlParams});
  }

  editArticle(news) {
    return this.http.patch(`${this.baseURL}/editArticleHeadLine`, news);
  }

  editPost(news) {
    return this.http.patch(`${this.baseURL}/editPostInfo`, news);
  }
}

export class News {
  constructor() {}
}
