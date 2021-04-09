import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs/operators';
import { OwnerService } from 'src/app/shared/services/owner.service';
import { PropertiesService } from 'src/app/shared/services/properties.service';
import { Location } from '@angular/common';
import * as _ from 'lodash';

@Component({
  selector: 'app-owner-property',
  templateUrl: './owner-property.component.html',
  styleUrls: ['./owner-property.component.css']
})
export class OwnerPropertyComponent implements OnInit {

  editState = {
    forSale: false,
    forRent: false,
    image: false
  };
  ownerData: any;
  modifiedForSale: any;
  modifiedForRent: any;
  selectedForSale = false;
  selectedForRent = false;
  forSaleIndex = 0;
  forRentIndex = 0;
  imageData: any;
  selectedImage: any;
  imageFormData: any;
  url: string;
  modifiedurl: string;

  constructor(private route: ActivatedRoute, private location: Location,
              private ownerService: OwnerService, private propertiesService: PropertiesService,
              private formBuilder: FormBuilder
    ) {
     this.route.params.pipe(take(1)).subscribe(data => {
      this.ownerData = _.cloneDeep(data);
      const forSale = JSON.parse(data.forSale);
      const forRent = JSON.parse(data.forRent);
      this.ownerData = { ...this.ownerData, forSale, forRent };
      console.log(this.ownerData);
    });
  }

  ngOnInit(): void {
    this.modifiedForSale = this.ownerData.forSale;
    console.log(this.modifiedForSale);
    this.modifiedForRent = this.ownerData.forRent;
  }

   submitProperty(entity) {
    if (entity === 'forSale') {
      this.propertiesService.updateProperty(this.modifiedForSale.property)
        .subscribe(data => {
          console.log(data);
        });
    }
    if (entity === 'forRent') {
      this.propertiesService.updateProperty(this.modifiedForRent.property)
        .subscribe(data => {
          console.log(data);
        });
    }
    this.editState[entity] = false;
  }

  selectProperty(value, type) {
    if (type === 'sale') {
      console.log(this.modifiedForSale);
      this.modifiedForSale = this.ownerData.forSale[+value];
      console.log(this.modifiedForSale);
    }
    if (type === 'rent') {
      this.modifiedForRent = this.ownerData.forRent[+value];
    }
  }

  uploadImage() {
    // this.url = this.modifiedurl;
    // this.editState.image = false;
    // let imageFormData = new FormData();
    // imageFormData.append('file', this.selectedImage);
    // imageFormData.append('_id', this.imageData._id);
    // this.postService.uploadImage(imageFormData)
    //   .subscribe((data: any) => {
    //     this.imageData.images_key = data.data.images_key;
    //     console.log(data);
    //   });
  }

  getImageUrl() {
    // let url = this.url ? this.url : environment.awsS3 + this.imageData.images_key;
    // //  let url = this.url ? this.url : this.s3.getObj(this.imageData.images_key);
    // return url;
  }

  selectImage(event) {
    // this.disabledButton = true;
    // this.selectedImage = null;
    // if (!event.target.files[0] || event.target.files[0].length === 0) {
    //   this.msg = 'You must select an image';
    //   this.modifiedurl = 'null';
    //   return;
    // }

    // let mimeType = event.target.files[0].type;

    // if (mimeType.match(/image\/*/) == null) {
    //   this.msg = 'Only images are supported';
    //   this.modifiedurl = 'null';
    //   return;
    // }
    // if (event.target.files[0].type !== ('image/png' || 'image/jpg')) {
    //   this.msg = 'Only images with .jpg or .png are supported';
    //   this.modifiedurl = 'null';
    //   return;
    //   }
    // if (event.target.files[0].type === ('image/png' || 'image/jpg')) {
    //   var reader = new FileReader();
    //   this.disabledButton = false;
    //   reader.readAsDataURL(event.target.files[0]);
    //   this.selectedImage = event.target.files[0];
    //   reader.onload = (_event) => {
    //     this.msg = '';
    //     this.modifiedurl = reader.result;
    //   }
    // }
  }

  backButton() {
    this.location.back();
  }

}
