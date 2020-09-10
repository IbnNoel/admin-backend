import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { PropertyNewsService } from 'src/app/shared/services/property-news.service';
import { Location } from '@angular/common';
import * as _ from 'lodash';
import { take } from 'rxjs/operators';


@Component({
  selector: 'app-see-post-info',
  templateUrl: './see-post-info.component.html',
  styleUrls: ['./see-post-info.component.css']
})
export class SeePostInfoComponent implements OnInit {

  editState = {
    post: false,
  };

  editForm: FormGroup;
  postData: any;

  constructor(private route: ActivatedRoute, private formBuilder: FormBuilder,
              private _location: Location, private postService: PropertyNewsService) {
    this.route.params.pipe(take(1)).subscribe(data => {
      this.postData = _.cloneDeep(data);
      const featured = (data.featured === 'true') ? true : false;
      const approved = (data.approved === 'true') ? true : false;
      this.postData = {...this.postData, approved, featured};
    });
  }

  ngOnInit(): void {
    this.editForm = this.formBuilder.group({
      _id: [this.postData._id],
      added: [this.postData.added],
      articleHeadline: [this.postData.articleHeadline, {updateOn: 'onSubmit'}],
      text: [this.postData.text, {updateOn: 'onSubmit'}],
      locationCode: [this.postData.locationCode, {updateOn: 'onSubmit'}],
      language: [this.postData.language, {updateOn: 'onSubmit'}],
      featured: [this.postData.featured, {updateOn: 'onSubmit'}],
      approved: [this.postData.approved, {updateOn: 'onSubmit'}],
      readingTime: [this.postData.readingTime, {updateOn: 'onSubmit'}],
      images_key: [this.postData.images_key, {updateOn: 'onSubmit'}],
    });
  }

  onSubmit() {
    this.editState.post = false;
    console.log(this.editForm.value);
    this.postService.editPost(this.editForm.getRawValue())
    .subscribe(Data => console.log(Data));
  }
  backButton() {
    this._location.back();
  }
}
