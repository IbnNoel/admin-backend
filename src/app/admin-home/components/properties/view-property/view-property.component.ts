import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { PropertiesService } from 'src/app/shared/services/properties.service';
import { AppState } from 'src/app/state/models/app-state-models';
import { Location } from '@angular/common';
import { take } from 'rxjs/operators';
import * as _ from 'lodash';
import { environment } from 'src/environments/environment.prod';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-view-property',
  templateUrl: './view-property.component.html',
  styleUrls: ['./view-property.component.css']
})
export class ViewPropertyComponent implements OnInit {

  editState = {
    property: false,
    data: false,
    image: false,
    description: false
  };
  firstFormGroup: FormGroup;
  oForm = false;
  f1Form = false;
  f3Form = false;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;

  Data: any;
  property: any;
  type: any;

  imageData: any;
  selectedImage: any;
  imageFormData: any;
  url;
  modifiedurl;
  msg = '';
  disabledButton = true;
  
  languages$: Observable<Array<any>>;
  modifiedDescription: any;
  selectedPostLang = 'en';

  constructor(private route: ActivatedRoute, private location: Location,
              private store: Store<AppState>, private propertyService: PropertiesService) {
                this.languages$ = this.store.select(store => store.language.list);
                this.route.params.pipe(take(1)).subscribe((data: any) => {
                  this.Data = _.cloneDeep(data);
                  this.Data.furnished = JSON.parse(data.furnished || null);
                  this.Data.sharedAccommodation = JSON.parse(data.sharedAccommodation || null);
                  this.property = JSON.parse(data.property);
                  this.modifiedDescription = this.property.description[this.selectedPostLang];
                  this.type = data.type;
                  this.imageData = this.property.images_key;
                });
               }

  ngOnInit(): void {
  }

  getFormStatus(value) {
    console.log('invalid: ' + value.invalid);
    console.log('touched: ' + value.touched);
    return (value.invalid || value.touched);
  }

  onCancel(form) {
    if(form == 'f1') {
      this.property = JSON.parse(this.Data.property);
    }
  }

  changeStatus(value) {
    if (value === 'o') {
      this.oForm = true;
    }
    if (value === 'f1') {
      this.f1Form = true;
    }
    if (value === 'f3') {
      this.f3Form = true;
      console.log(this.f3Form);
    }

  }

  clickLang() {
    console.log(this.selectedPostLang)
    this.modifiedDescription = this.modifiedDescription = this.property.description[this.selectedPostLang];
   }
  
  onSubmit(entity, value?) {
    console.log(entity);
    this.editState[entity] = false;
    if (entity === 'data') {
      this.propertyService.updateEditPropertyData(this.Data, this.type)
        .subscribe(data => {
          console.log(data);
        });
    }
    if (entity === 'property') {
      this.Data.property = JSON.stringify(this.property);
      this.propertyService.updateProperty(this.property)
        .subscribe(data => {
          console.log(data);
        });
    }
    if (entity === 'description') {
      this.property.description[this.selectedPostLang] = this.modifiedDescription;
      this.Data.property = JSON.stringify(this.property);
      this.propertyService.updateDescription(this.property)
        .subscribe(data => {
          console.log(data);
        });
    }
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
      this.msg = 'Only images with .jpg or .png are supported';
      this.modifiedurl = 'null';
      return;
    }
    // if (event.target.files[0].type !== ('image/png' || 'image/jpg')) {
    //   this.msg = 'Only images with .jpg or .png are supported';
    //   this.modifiedurl = 'null';
    //   return;
    //   }
    else {
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
    let url = this.url ? this.url : environment.awsS3 + this.imageData[0];
    //  let url = this.url ? this.url : this.s3.getObj(this.imageData.images_key);
    return url;
  }

  uploadImage() {
    this.url = this.modifiedurl;
    this.editState.image = false;
    let imageFormData = new FormData();
    imageFormData.append('file', this.selectedImage);
    imageFormData.append('_id', this.imageData._id);
    // this.propertyService.updateImage(imageFormData, '')
    //   .subscribe((data: any) => {
    //     this.imageData.images_key = data.data.images_key;
    //     console.log(data);
    //   });
  }

  backButton() {
    this.location.back();
  }

}
