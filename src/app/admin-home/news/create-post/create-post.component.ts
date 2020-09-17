import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { PropertyNewsService } from 'src/app/shared/services/property-news.service';
import { AppState } from 'src/app/state/models/app-state-models';

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

  constructor(private formBuilder: FormBuilder, private router: Router, 
              private store: Store<AppState>, private newsService: PropertyNewsService) { }

  ngOnInit(): void {
    this.store.select(store => store.User.user._id).pipe(take(1)).subscribe(data => this.userId = data);
    this.languages$ = this.store.select(store => store.language.list);

    this.firstFormGroup = this.formBuilder.group({
      userId: [this.userId || ''],
      articleHeadline: ['', Validators.required],
      text: ['', Validators.required],
      readingTime: ['', Validators.required],
    });
    this.secondFormGroup = this.formBuilder.group({
      images: [''],
      locationCode: ['', Validators.required],
      language: ['', Validators.required]
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
    sendFormData.append('articleHeadline', this.firstFormGroup.get('articleHeadline').value);
    sendFormData.append('readingTime', this.firstFormGroup.get('readingTime').value);
    sendFormData.append('text', this.firstFormGroup.get('text').value);
    sendFormData.append('locationCode', this.secondFormGroup.get('locationCode').value);
    sendFormData.append('language', this.secondFormGroup.get('language').value);

    this.newsService.createPost(sendFormData)
    .subscribe(Data => console.log(Data));
  }
}
