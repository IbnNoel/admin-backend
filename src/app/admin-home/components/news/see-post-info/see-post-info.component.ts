import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { PropertyNewsService } from 'src/app/shared/services/property-news.service';
import { Location } from '@angular/common';
import * as _ from 'lodash';
import { take } from 'rxjs/operators';
import { environment } from 'src/environments/environment.prod';

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
  imageData: any;
  selectedImage: any;
  imageFormData: any;
  url;
  modifiedurl;
  msg = '';
  disabledButton = true;

  constructor(private route: ActivatedRoute, private _location: Location, private postService: PropertyNewsService) {
    this.route.params.pipe(take(1)).subscribe(data => {
      this.postData = _.cloneDeep(data);
      const featured = (data.featured === 'true') ? true : false;
      const approved = (data.approved === 'true') ? true : false;
      const modifiedText = data.text;
      this.imageData = _.cloneDeep(data);
      this.postData = { ...this.postData, approved, featured, modifiedText };
    });
  }

  ngOnInit(): void {
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

    var reader = new FileReader();
    this.disabledButton = false;
    reader.readAsDataURL(event.target.files[0]);
    this.selectedImage = event.target.files[0];
    reader.onload = (_event) => {
      this.msg = '';
      this.modifiedurl = reader.result;
    }
  }

  getImageUrl() {
   let url = this.url ? this.url : environment.awsS3Small + this.imageData;
   return url;
  }

  submitPostData() {
    this.editState.post = false;
    this.postData.text = this.postData.modifiedText;
    this.postService.editPost(this.postData)
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

}
