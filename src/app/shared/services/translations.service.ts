import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { map } from 'rxjs/operators';
import { Word } from '../models/wordTrans';

@Injectable({
  providedIn: 'root'
})
export class TranslationsService {

  constructor(private db: AngularFireDatabase) {
  }

  addNewLang(newLanguage, word: Word) {
    this.db.object('/translates/' + newLanguage + '/' + word.word).set(word.trans);
  }
  updateArTrans(lang, word: Word) {
    this.db.object('/translates/' + lang + '/' + word.word).set(word.trans);
  }

  getTrans(selectedLanguage): AngularFireList<Word> {
    return this.db.list('/translates/' + selectedLanguage + '/');
  }

  getWordTrans(lang, key) {
    return this.db.object('/translates/' + lang + '/' + key);
  }

  deleteTranslation(data) {
    return this.db.list('/translates/ar/').remove(data.key);
  }

  getLang(prefix: string = 'translates') {
    return this.db.list(`${prefix}`);
  }

  getSpecificRecordtranslations(page: number, pageSize: number) {
    let ar = "ar";
    let limitToLast = page * pageSize;
    let startingPoint = limitToLast - pageSize + 1;
    return this.db.list('/translates/ar')
      .snapshotChanges()
      .pipe(
        map(changes =>
          changes.map(c =>
            ({ key: c.payload.key, ...c.payload })))
      );
  }

  getPrevPage(selectedLang: string, pageSize: number, endingPoint: string) {
    console.log(endingPoint);
    return this.db.list('/translates/ar',
      ref => ref.orderByKey()
        .limitToLast(2).endAt(endingPoint)
    )
      .snapshotChanges()
      .pipe(
        map(changes =>
          changes.map(c =>
            ({ key: c.payload.key, ...c.payload })))
      );
  }
  getNumChildren(selectedLang) {
    return this.db.object(`/translates/${selectedLang}/`).snapshotChanges().pipe();
  }

  updatePageSetting(currentPage, pageSize) {
    return this.db.object('/pagination/').update({
      currentPage: currentPage,
      pageSize: pageSize
    });
  }

}
