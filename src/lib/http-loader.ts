import { HttpClient } from "@angular/common/http";
import { TranslateLoader } from "@ngx-translate/core";
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

export class TranslateHttpLoader implements TranslateLoader {
  readonly translations$ = new BehaviorSubject<any>(null);

  readonly baseURL = `${environment.baseUrl}/translations/ngx-translate`;
  constructor(private http: HttpClient) { }
  getTranslation(lang: string) {
   return this.http.get(`${this.baseURL}/${lang}`);
  
}
    

}