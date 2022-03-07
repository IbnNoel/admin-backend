import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { PropertyNewsService } from 'src/app/shared/services/property-news.service';
import { Location } from '@angular/common';
import * as _ from 'lodash';
import { take } from 'rxjs/operators';
import { environment } from 'src/environments/environment.prod';
import { AwsService } from 'src/app/admin-home/services/aws.service';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/state/models/app-state-models';

@Component({
  selector: 'app-see-post-info',
  templateUrl: './see-post-info.component.html',
  styleUrls: ['./see-post-info.component.css']
})
export class SeePostInfoComponent implements OnInit {

  editState = {
    post: false,
    image: false
  };

  postData: any;
  originalData: any;
  imageData: any;
  selectedImage: any;
  imageFormData: any;
  url;
  modifiedurl;
  msg = '';
  disabledButton = true;
  languages$: Observable<Array<any>>;
  selectedPostLang = 'en';

  f1Form = false;
  f2Form = false;

  constructor(private route: ActivatedRoute, private _location: Location, private store: Store<AppState>,
    private postService: PropertyNewsService, private s3: AwsService) {
    this.languages$ = this.store.select(store => store.language.list);
    this.route.params.pipe(take(1)).subscribe((data: any) => {

      data = JSON.parse(data.data);

      const articleHeadline = JSON.parse(data.articleHeadline);
      const text = JSON.parse(data.text);
      const articleSnippet = JSON.parse(data.articleSnippet);
      const modifiedText = text;

      const parsedData = { ..._.cloneDeep(data), articleHeadline, articleSnippet, text, modifiedText };
      this.postData = _.cloneDeep(parsedData);
      this.imageData = _.cloneDeep(parsedData);

      this.postData = { ...this.postData, modifiedText };

      this.originalData = _.cloneDeep(parsedData);
    });
  }

  ngOnInit(): void {
    this.url = this.imageData.images_key ? environment.awsS3 + this.imageData.images_key[0] : null;
    this.postData.articleHeadline = this.originalData.articleHeadline[this.selectedPostLang];
    this.postData.articleSnippet = this.originalData.articleSnippet[this.selectedPostLang];
    this.postData.text = this.originalData.text[this.selectedPostLang];
    this.postData.modifiedText = this.originalData.modifiedText[this.selectedPostLang];
  }

  selectImage(event) {
    this.disabledButton = true;
    this.selectedImage = null;
    if (!event.target.files[0] || event.target.files[0].length === 0) {
      this.msg = 'You must select an image';
      this.modifiedurl = 'null';
      return;
    }

    let mimeType = event.target.files[0].type;

    if (mimeType.match(/image\/*/) == null) {
      this.msg = 'Only images are supported';
      this.modifiedurl = 'null';
      return;
    }
    if (event.target.files[0].type !== ('image/png' || 'image/jpg')) {
      this.msg = 'Only images with .jpg or .png are supported';
      this.modifiedurl = 'null';
      return;
      }
    if (event.target.files[0].type === ('image/png' || 'image/jpg')) {
      var reader = new FileReader();
      this.disabledButton = false;
      reader.readAsDataURL(event.target.files[0]);
      this.selectedImage = event.target.files[0];
      reader.onload = (_event) => {
        this.msg = '';
        this.modifiedurl = reader.result;
      }
    }
  }

  getImageUrl() {
    
    let url = this.url ? this.url : environment.awsS3 + this.imageData.images_key;
    //  let url = this.url ? this.url : this.s3.getObj(this.imageData.images_key);
    console.log(url);
    return url;
  }

  changeStatus(value) {
    if (value === 'f1Form') {
      this.f1Form = true;
    }
    if (value === 'f2Form') {
      this.f2Form = true;
    }

  }

  submitPostData(data?) {
    console.log(data);
    this.editState.post = false;
    this.postData.text = this.postData.modifiedText;
    this.postService.editPost(this.postData, this.selectedPostLang)
      .subscribe(Data => console.log(Data));
  }

  uploadImage() {
    this.url = this.modifiedurl;
    this.editState.image = false;
    let imageFormData = new FormData();
    imageFormData.append('file', this.selectedImage);
    imageFormData.append('_id', this.imageData._id);
    this.postService.uploadImage(imageFormData)
      .subscribe((data: any) => {
        this.imageData.images_key = data.data.images_key;
        console.log(data);
      });
  }

  backButton() {
    this._location.back();
  }

  clickLang() {
    console.log(this.selectedPostLang)
    this.postData.articleHeadline = this.originalData.articleHeadline[this.selectedPostLang];
    this.postData.articleSnippet = this.originalData.articleSnippet[this.selectedPostLang];
    this.postData.text = this.originalData.text[this.selectedPostLang];
    this.postData.modifiedText = this.originalData.modifiedText[this.selectedPostLang];
  }

}
