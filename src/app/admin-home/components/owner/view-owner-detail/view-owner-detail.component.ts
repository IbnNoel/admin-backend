import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';
import { take } from 'rxjs/operators';
import { OwnerService } from 'src/app/shared/services/owner.service';
import { Location } from '@angular/common';
import { PropertiesService } from 'src/app/shared/services/properties.service';

@Component({
  selector: 'app-view-owner-detail',
  templateUrl: './view-owner-detail.component.html',
  styleUrls: ['./view-owner-detail.component.css']
})
export class ViewOwnerDetailComponent implements OnInit {

  editState = {
    forSale: false,
    forRent: false,
  };
  ownerData: any;
  modifiedForSale: any;
  modifiedForRent: any;
  selectedForSale = false;
  selectedForRent = false;
  forSaleIndex = 0;
  forRentIndex = 0;

  constructor(private route: ActivatedRoute, private location: Location,
              private ownerService: OwnerService, private propertiesService: PropertiesService) {
    this.route.params.pipe(take(1)).subscribe(data => {
      this.ownerData = _.cloneDeep(data);
      const forSale = JSON.parse(data.forSale);
      const forRent = JSON.parse(data.forRent);
      this.ownerData = { ...this.ownerData, forSale, forRent };
      console.log(this.ownerData);
    });
  }

  ngOnInit(): void {
    this.modifiedForSale = this.ownerData.forSale[0];
    console.log(this.modifiedForSale);
    this.modifiedForRent = this.ownerData.forRent[0];
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

  backButton() {
    this.location.back();
  }
}
