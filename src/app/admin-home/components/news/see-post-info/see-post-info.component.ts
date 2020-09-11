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

  postData: any;

  constructor(private route: ActivatedRoute, private _location: Location, private postService: PropertyNewsService) {
    this.route.params.pipe(take(1)).subscribe(data => {
      this.postData = _.cloneDeep(data);
      const featured = (data.featured === 'true') ? true : false;
      const approved = (data.approved === 'true') ? true : false;
      const modifiedText = data.text;
      this.postData = {...this.postData, approved, featured, modifiedText};
    });
  }

  ngOnInit(): void {
  }

  onSubmit() {
    this.editState.post = false;
    this.postData.text = this.postData.modifiedText;
    this.postService.editPost(this.postData)
    .subscribe(Data => console.log(Data));
  }
  backButton() {
    this._location.back();
  }
}
