import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { PropertyNewsService } from 'src/app/shared/services/property-news.service';
import { AppState } from 'src/app/state/models/app-state-models';
import { Location } from '@angular/common';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css']
})
export class CreatePostComponent implements OnInit {

  isLinear = true;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  selectedImage: any;
  formData = new FormData();
  userId: string;
  languages$: Observable<Array<any>>;
  languageFormData = new FormData();

  selectedLanguage = 'en';

  constructor(private formBuilder: FormBuilder, private router: Router, private location: Location,
    private store: Store<AppState>, private newsService: PropertyNewsService) { }

  ngOnInit(): void {
    this.store.select(store => store.language.list)
      .subscribe((data: any) => {
        this.languages$ = data;
        data.forEach(data => {
          this.languageFormData.append('articleHeadline'[data], null);
          this.languageFormData.append('articleSnippet'[data], null);
          this.languageFormData.append('text'[data], null);
        });
      });

    this.store.select(store => store.User.user._id).pipe(take(1)).subscribe(data => this.userId = data);
    this.languages$ = this.store.select(store => store.language.list);

    this.firstFormGroup = this.formBuilder.group({
      userId: [this.userId || ''],
      articleHeadline: ['', Validators.required],
      articleSnippet: ['', Validators.required],
      text: ['', Validators.required],
      readingTime: ['', Validators.required],
      language: ['', Validators.required]
    });
    this.secondFormGroup = this.formBuilder.group({
      images: [''],
      locationCode: ['', Validators.required],
    });
  }

  selectImage(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.selectedImage = file;
    }
  }

  selectLanguage(language) {
    this.secondFormGroup.patchValue({
      'language': language
    });
  }

  submit() {
    const sendFormData = new FormData();
    sendFormData.append('file', this.selectedImage);
    sendFormData.append('userId', this.firstFormGroup.get('userId').value);
    
    sendFormData.append(`articleHeadline`, this.languageFormData.get('articleHeadLine'));
    sendFormData.append(`articleHeadline[${this.selectedLanguage}]`, this.firstFormGroup.get('articleHeadline').value);
    
    
    sendFormData.append(`text`, this.languageFormData.get('text'));
    sendFormData.append(`text[${this.selectedLanguage}]`, this.firstFormGroup.get('text').value);
    
    sendFormData.append(`articleSnippet`, this.languageFormData.get('articleSnippet'));
    sendFormData.append(`articleSnippet[${this.selectedLanguage}]`, this.firstFormGroup.get('articleSnippet').value);
    
    sendFormData.append('locationCode', this.secondFormGroup.get('locationCode').value);
    sendFormData.append('language', this.firstFormGroup.get('language').value);
    sendFormData.append('readingTime', this.firstFormGroup.get('readingTime').value);

    console.log(sendFormData.getAll);
    console.log(sendFormData.getAll(''));
    this.newsService.createPost(sendFormData)
      .subscribe(Data => console.log(Data));
  }

  backButton() {
    this.location.back();
  }
}
