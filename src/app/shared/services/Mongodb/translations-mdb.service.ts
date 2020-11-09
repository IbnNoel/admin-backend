import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Word } from '../../models/wordTrans';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Language } from '../../models/language';
import { NewWord } from '../../models/newWord';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class TranslationsMdbService {
  
  readonly baseURL = `${environment.baseUrl}/translations`;
  // readonly baseURL = 'https://gas-apiv0.herokuapp.com/translations';
  // readonly baseURL = 'http://localhost:3000/translations';
  word : Word;
  translations: Word[];
  constructor(private http: HttpClient) { }

  saveWord(word): Observable<NewWord> {
    return this.http.post<NewWord>(this.baseURL + '/addNewWord/', word);
  }

  getDataTableTranslations(lang, pg, pgS, word) {
    console.log(`${this.baseURL}/dataTable/search/${lang}?pg=${pg}&pgS=${pgS}&wordId=${word.id}&Word=${word.word}`);
    
    return this.http.get<Word[]>(`${this.baseURL}/dataTable/search/${lang}?pg=${pg}&pgS=${pgS}&wordId=${word.id}&&Word=${word.word}`);
  }

  getTranslationLanguages(): Observable<Language> {
    return this.http.get<Language>(this.baseURL +'/TranslationsLanguage');
  }

  getTotalRecord(language: Language, word: Word) {
    return this.http.get(this.baseURL +`/dataTable/totalRecord/${language.language}?wordId=${word.id}&Word=${word.word}`)
  }

  addNewLanguage(language: Language ) {
    return this.http.patch<Language>(this.baseURL + '/AddLanguage', language);
  }

  updateTranslation( lang, word: NewWord): Observable<Word> {
    return this.http.patch<Word>(`${this.baseURL}/EditTranslation/${lang}`, word);
  }

  deleteTranslation(_id) {
    return this.http.delete<void>(this.baseURL+ `/${_id}`)
   }

   searchWord(language: Language, word: Word): Observable<Word[]> {
    return this.http.get<Word[]>(`${this.baseURL}/dataTable/search/${language.language}?wordId=${word.id}&&Word=${word.word}`);
   }
  }