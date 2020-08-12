import { Action } from '@ngrx/store';
import { Language } from '../shared/models/language';

export enum LanguageActionTypes {
  LOAD_LANGUAGES = "LOAD_LANGUAGES",
  LOAD_LANGUAGES_SUCCESS = "LOAD_LANGUAGES_SUCCESS",
  LOAD_LANGUAGES_FAIL = "LOAD_LANGUAGES_FAIL",
  ADD_LANGUAGE = "[Language] Add Language",
  ADD_LANGUAGE_SUCCESS = "[Language] Add Languages Success",
  ADD_LANGUAGE_FAIL = "[Language] Add Languages Fail",
}

export class LoadLanguages implements Action {
  readonly type = LanguageActionTypes.LOAD_LANGUAGES;
}
export class LoadLanguagesSuccess implements Action {
  readonly type = LanguageActionTypes.LOAD_LANGUAGES_SUCCESS;
  constructor(public payload: any) { }
}
export class LoadLanguagesFail implements Action {
  readonly type = LanguageActionTypes.LOAD_LANGUAGES_FAIL;
  constructor(public payload: string) { }
}
export class AddLanguage implements Action {
  readonly type = LanguageActionTypes.ADD_LANGUAGE;
  constructor(public payload: Language) { }
}
export class AddLanguageSuccess implements Action {
  readonly type = LanguageActionTypes.ADD_LANGUAGE_SUCCESS;
  constructor(public payload: any) { }
}
export class AddLanguageFail implements Action {
  readonly type = LanguageActionTypes.ADD_LANGUAGE_FAIL;
  constructor(public payload: any) { }
}

export type LanguageAction = LoadLanguages | LoadLanguagesSuccess | LoadLanguagesFail | AddLanguage | AddLanguageSuccess | AddLanguageFail;
