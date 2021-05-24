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
    urlParams = {pgS, pg, 'approved': data.approved, userId: data.userId, articleHeadline: data.articleHeadline} as any;
    return this.http.get(`${this.baseURL}/datatable`, {params: urlParams});
  }

  editArticle(news) {
    return this.http.patch(`${this.baseURL}/editArticleHeadLine`, news);
  }

  editPost(news, lang) {
    return this.http.patch(`${this.baseURL}/editPostInfo/${lang}`, news);
  }

  uploadImage(post) {
    return this.http.patch(`${this.baseURL}/uploadImage`, post);
  }

  publishUnPublish(post) {
    return this.http.patch(`${this.baseURL}/ChangePub/${post._id}`, post);
  }

  createPost(post) {
    return this.http.post(`${this.baseURL}/createNewPost`, post);
  }
}

export class News {
  constructor() {}
}
