import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RefDataService } from 'src/app/moopla/services/ref-data.service';
import { LocalService } from 'src/app/shared/services/local.service';
import { PriceListService } from 'src/app/shared/services/price-list.service';
import { MatChipInputEvent } from '@angular/material/chips';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import * as _ from 'lodash';
import { take } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { UpdatePriceListForm } from 'src/app/state/models/price-list-form.actions';
import { AppState } from 'src/app/state/models/app-state-models';

@Component({
  selector: 'app-view-edit-ref-data',
  templateUrl: './view-edit-ref-data.component.html',
  styleUrls: ['./view-edit-ref-data.component.css'],
})

export class ViewEditRefDataComponent implements OnInit {

  refDataId: string;
  editState = {
    refData: false,
    priceList: false,
    local: false
  };
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  periodArr = [];

  selectable = true;
  removable = true;
  addOnBlur = false;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  inputCtrl = new FormControl();

  constructor(private _formBuilder: FormBuilder, private route: ActivatedRoute,
              private _location: Location, private refDataService: RefDataService,
              private localService: LocalService, private priceListServer: PriceListService,
              private store: Store<AppState>) {
    this.refDataId = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    // this.refDataService.getRefData(this.refDataId).subscribe(data =>
    //   this.store.dispatch(new UpdatePriceListForm(data.priceList)));

    this.refDataService.getRefData(this.refDataId).subscribe(data => {
      this.updateState(data.priceList);
      this.periodArr = _.cloneDeep(data.rentPeriod);
      this.firstFormGroup = this._formBuilder.group({
        _id: [data._id],
        country: [data.country, { updateOn: 'onSubmit' }],
        currencyCode: [data.currencyCode, { updateOn: 'onSubmit' }],
        rentPeriod: [data.rentPeriod, { updateOn: 'onSubmit' }],
      });
      this.secondFormGroup = this._formBuilder.group({
        _id: [data.local._id],
        local: [data.local.local, { updateOn: 'onSubmit' }],
        description: [data.local.description, { updateOn: 'onSubmit' }],
        shortDateFormat: [data.local.shortDateFormat, { updateOn: 'onSubmit' }],
        longDateFormat: [data.local.longDateFormat, { updateOn: 'onSubmit' }],
        timeFormat: [data.local.timeFormat, { updateOn: 'onSubmit' }],
        decimalFormat: [data.local.decimalFormat, { updateOn: 'onSubmit' }],
        systemDefault: [data.local.systemDefault, { updateOn: 'onSubmit' }],
      });
      this.thirdFormGroup = this._formBuilder.group({
        _id: [!data.priceList._id ? '' : data.priceList._id],
        rentRange: [data.priceList.rentRange, { updateOn: 'onSubmit' }],
        saleRange: [data.priceList.saleRange, { updateOn: 'onSubmit' }],
      });
    });
  }

  onSubmit(entity) {
    this.editState[entity] = false;
    if (entity === 'refData') {
      this.periodArr = this.firstFormGroup.value.rentPeriod;
      this.refDataService.updateRefData(this.firstFormGroup.value._id, this.firstFormGroup.value)
        .subscribe(data => {
          this.periodArr = this.firstFormGroup.value.rentPeriod;
          console.log(data);
        });
    }
    if (entity === 'local') {
      this.localService.updateLocal(this.secondFormGroup.value._id, this.secondFormGroup.value)
        .subscribe(data => {
          console.log(data);
        });
    }
    if (entity === 'priceList') {
      this.thirdFormGroup.patchValue({
        rentRange: this.thirdFormGroup.value.rentRange.sort((a, b) => a - b),
        saleRange: this.thirdFormGroup.value.saleRange.sort((a, b) => a - b)
      });
      this.updateState(this.thirdFormGroup.value);
      this.priceListServer.updatepriceList(this.thirdFormGroup.value._id, this.thirdFormGroup.value)
        .subscribe(data => {
          console.log(data);
        });
    }
  }
  updateState(value) {
    this.store.dispatch(new UpdatePriceListForm(_.cloneDeep(value)));
  }

  backButton() {
    this._location.back();
  }

  cancel(value) {
    this.editState.priceList = !this.editState.priceList;
    this.store.pipe(take(1)).subscribe(store => {
      this.thirdFormGroup.patchValue(store.priceList.priceList);
    });
  }

}
