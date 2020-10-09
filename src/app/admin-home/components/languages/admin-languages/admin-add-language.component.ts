import { Component, ComponentFactoryResolver, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, switchMap, tap, map } from 'rxjs/operators';
import { Language } from 'src/app/shared/models/language';
import { NewWord } from 'src/app/shared/models/newWord';
import { Word } from 'src/app/shared/models/wordTrans';
import { LanguagesService } from 'src/app/shared/services/languages.service';
import { TranslationsMdbService } from 'src/app/shared/services/Mongodb/translations-mdb.service';
import { LoadLanguages } from 'src/app/state/language.actions';
import { AppState } from 'src/app/state/models/app-state-models';
import { SelectLanguage } from 'src/app/state/select-language.actions';
import { EditWordComponent } from '../edit-word/edit-word.component';
import { ExpansionSettings } from 'src/app/components/controls/data-table/classes/Expansion';
import { GeneralSettings } from 'src/app/components/controls/data-table/classes/General';
import { PageSettings } from 'src/app/components/controls/data-table/classes/Paging';
import { ActionMenuComponent, ActionButton } from 'src/app/components/controls/action-menu/action-menu.component';
import { ColumnDefs } from 'src/app/components/controls/data-table/classes/Columns';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-admin-add-language',
  templateUrl: './admin-add-language.component.html',
  styleUrls: ['./admin-add-language.component.css']
})
export class AdminAddLanguageComponent implements OnInit, OnDestroy {
  
  data = new BehaviorSubject<Array<any>>([]);
  colDefinitions: Array<ColumnDefs>;
  selectedLanguage: any;
  dataList: any;
  languages$: Observable<Array<any>>;
  languageExpansionSettings: ExpansionSettings;
  pageSettings: PageSettings;
  generalSettings = new GeneralSettings();
  newWord: NewWord = <any>{};
  selectedProject: any;
  searchedWord = new Word();
  
  searchFormGroup: FormGroup;
  constructor(private store: Store<AppState>, private wordLang: LanguagesService, private translationsMDBService: TranslationsMdbService,
    public CFR: ComponentFactoryResolver, private router: Router, private _formBuilder: FormBuilder) {
    this.languages$ = this.store.select(store => store.language.list);
    this.store.select(store => store.language.error);
    this.store.dispatch(new LoadLanguages());
    this.store.select(store => store.selectLang.selectedLang).subscribe(data => {
      this.selectedLanguage = data;
    });
    this.setUpColumnDefintion();
    this.languageExpansionSettings = this.setupExpansionSettings();
    this.setUppageSettings();
  }

  ngOnInit() {
    this.searchFormGroup = this._formBuilder.group({
      id: [''],
      word: ['']
     });

    if (this.selectedLanguage.language) {
      this.selectedProject = this.selectedLanguage.language;
      this.onPageChange();
    }
  }

  ngOnDestroy() {
  }

  setUpColumnDefintion() {
    this.colDefinitions = [
      {
        key: 'id',
        className: 'data_grid_left_align',
        header: "Id",
        responsivePriority: true
      },
      {
        key: 'trans',
        className: 'data_grid_left_align',
        header: "Translation",
        responsivePriority: true
      },
      {
        cellElement: (cellData, rowData, row) => {
          return this.generateActionMenuForRfr(cellData, rowData, row);
        }, className: 'data_grid_center_align', responsivePriority: true
      }
    ];
  }

  generateActionMenuForRfr(cellData, rowData, row) {
    let menu = new ActionMenuComponent();
    let deleteButton = new ActionButton();
    deleteButton.label = "delete";
    deleteButton.data = rowData;
    deleteButton.action = (data => {
      this.deleteTranslation(data.id)
    });
    let editLanguage = new ActionButton();
    editLanguage.label = "editLanguage";
    editLanguage.data = rowData;
    editLanguage.action = (data => {
      this.languageExpansionSettings.ExpandGrid({ id: rowData.id, propertyName: "id" })
    });
    menu.buttons.push(deleteButton, editLanguage);
    return menu;
  };

  setupExpansionSettings() {
    return new ExpansionSettings(false, (viewContainerRef, rowData, row) => {
      return new Promise<any>((resolve) => {
        const componentResolve =
          this.CFR.resolveComponentFactory(EditWordComponent);
        let component = viewContainerRef.createComponent(componentResolve);
        component.instance.newWord = rowData;
        this.newWord = component.instance.newWord;
        component.instance.notify.subscribe(event => {
          rowData.id = this.newWord.id;
          rowData.word = this.newWord.trans;
          this.translationsMDBService.updateTranslation(this.selectedLanguage.language, this.newWord)
            .pipe(filter((data: any) => data.ok === 1))
            .subscribe((success) => { this.generalSettings.UpddateRow({ id: this.newWord.id, propertyName: "id" }, rowData); });
          this.languageExpansionSettings.CollapseGrid({ id: rowData.id, propertyName: "id" });
        });
        component.instance.cancel.subscribe(event => {
          this.languageExpansionSettings.CollapseGrid({ id: rowData.id, propertyName: "id"});
        })
        resolve(component);
      });
    });
  }

  setUppageSettings() {
    this.pageSettings = new PageSettings(() => {
      this.onPageChange();
    });
  }

  onPageChange(value?) {
    (value) ? this.pageSettings.currentPage=1: this.pageSettings.currentPage; 

    let pg = this.pageSettings.currentPage - 1;    
    let pgS = this.pageSettings.pageSize;
    this.translationsMDBService.getDataTableTranslations(this.selectedLanguage.language, pg, pgS, this.searchFormGroup.value)
    .subscribe((data: any) => {
      this.pageSettings.setTotalRecords(data.total);
      (data.total>0)? this.data.next(data.data): this.data.next([]);
      console.log(data);
      
    });
  }

  deleteTranslation(_id) {
    this.translationsMDBService.deleteTranslation(_id)
      .pipe(filter((data: any) => data.ok === 1))
      .subscribe(
        (data) => {
          this.generalSettings.DeleteRow({ id: _id, propertyName: "id" });
          //Todo: refresh page number
        });
  }

  onLangChange(event) {
    const language = new Language();
    language.language = this.selectedProject;
    this.selectedLanguage = language;
    this.store.dispatch(new SelectLanguage(language));
    this.onPageChange();
  }

  AddLanguage() {
    this.router.navigate(['admin/adminAddnewLanguage']);
  }
  addNewWord() {
    if (this.selectedLanguage) {
      this.router.navigate(['admin/add-word/' + `${this.selectedLanguage.language}`]);
    }
  }

  getTranslationLanguages() {
    this.newWord.word = {};
    this.translationsMDBService.getTranslationLanguages().subscribe((data: any) => {
      data.forEach(data => { this.newWord['word'][data] = ''; });
      this.wordLang.changeWord(this.newWord);
    })
  }

}