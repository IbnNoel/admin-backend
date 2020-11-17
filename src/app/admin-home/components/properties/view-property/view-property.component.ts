import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { PropertiesService } from 'src/app/shared/services/properties.service';
import { AppState } from 'src/app/state/models/app-state-models';
import { Location } from '@angular/common';
import { take } from 'rxjs/operators';
import * as _ from 'lodash';

@Component({
  selector: 'app-view-property',
  templateUrl: './view-property.component.html',
  styleUrls: ['./view-property.component.css']
})
export class ViewPropertyComponent implements OnInit {

  editState = {
    property: false,
    data: false,
  };
  firstFormGroup: FormGroup;
  oForm = false;
  f1Form = false;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;

  Data: any;
  property: any;
  type: any;

  constructor(private route: ActivatedRoute, private location: Location,
              private store: Store<AppState>, private propertyService: PropertiesService) {
                this.route.params.pipe(take(1)).subscribe((data: any) => {
                  this.Data = _.cloneDeep(data);
                  this.Data.furnished = JSON.parse(data.furnished || null);
                  this.Data.sharedAccommodation = JSON.parse(data.sharedAccommodation || null);
                  this.property = JSON.parse(data.property);
                  this.type = data.type;
                });
               }

  ngOnInit(): void {
  }

  getFormStatus(value) {
    console.log('invalid: ' + value.invalid);
    console.log('touched: ' + value.touched);
    return (value.invalid || value.touched);
  }

  changeStatus(value) {
    if (value === 'o') {
      this.oForm = true;
    }
    if (value === 'f1') {
      this.f1Form = true;
    }

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
      this.propertyService.updateProperty(this.property)
        .subscribe(data => {
          console.log(data);
        });
    }
  }

  backButton() {
    this.location.back();
  }

}
