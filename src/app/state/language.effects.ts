import { Injectable } from '@angular/core';
import { TranslationsMdbService } from '../shared/services/Mongodb/translations-mdb.service';
import { Observable, of, pipe } from 'rxjs';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { LanguageAction, LanguageActionTypes, LoadLanguagesSuccess, LoadLanguagesFail, LoadLanguages, AddLanguage, AddLanguageSuccess, AddLanguageFail } from './language.actions';
import { mergeMap, map, catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';


@Injectable()
export class LanguageEffects {

    constructor(
        private router: Router,
        private actions$: Actions,
        private translationMDBService: TranslationsMdbService
    ) {}

    @Effect() loadlanguages$ = this.actions$
    .pipe(
        ofType<LoadLanguages>(LanguageActionTypes.LOAD_LANGUAGES),
        mergeMap(
            () => this.translationMDBService.getTranslationLanguages()
                .pipe(
                    map(data => new LoadLanguagesSuccess(data)),
                    catchError(error => of(new LoadLanguagesFail(error)))
                )
        )
    );
    @Effect() addLanguage$ = this.actions$
    .pipe(
        ofType<AddLanguage>(LanguageActionTypes.ADD_LANGUAGE),
        mergeMap(
            (data) => this.translationMDBService.addNewLanguage(data.payload)
            .pipe(
                map(() => new AddLanguageSuccess(data.payload)),
                tap(() => this.router.navigate(['admin/add-lang'])),
                catchError(error => of(new AddLanguageFail(error)))
            )
        )
    );
}