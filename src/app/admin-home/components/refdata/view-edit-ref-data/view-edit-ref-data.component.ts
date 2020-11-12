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

  Data: any;
  refDataParams: any;
  localParams: any;
  priceListParams: any;

  constructor(private route: ActivatedRoute, private _location: Location,
              private refDataService: RefDataService, private localService: LocalService,
              private priceListServer: PriceListService, private store: Store<AppState>) {
    this.refDataId = this.route.snapshot.paramMap.get('id');

    this.route.params.pipe(take(1)).subscribe(data => {
      const rentPeriod = JSON.parse(data.rentPeriod);
      const rentPeriodModified = JSON.parse(data.rentPeriod);
      this.Data = _.cloneDeep(data);
      this.refDataParams = { ...this.Data, rentPeriod, rentPeriodModified };

      this.localParams = JSON.parse(data.local);

      this.priceListParams = JSON.parse(data.priceList);
      const rentRangeModified = this.priceListParams.rentRange;
      const saleRangeModified = this.priceListParams.saleRange;
      this.priceListParams = { ...this.priceListParams, rentRangeModified, saleRangeModified };
    });
  }

  ngOnInit(): void {
  }

  onSubmit(entity, value?) {
    console.log(value);
    this.editState[entity] = false;
    this.refDataParams.rentPeriod = this.refDataParams.rentPeriodModified;
    if (entity === 'refData') {
      this.refDataService.updateRefData(this.refDataParams._id, this.refDataParams)
        .subscribe(data => {
          console.log(data);
        });
    }
    if (entity === 'local') {
      this.localService.updateLocal(this.localParams._id, this.localParams)
        .subscribe(data => {
          console.log(data);
        });
    }
    if (entity === 'priceList') {
      this.priceListParams.saleRange = this.priceListParams.saleRangeModified.sort((a, b) => a - b);
      this.priceListParams.rentRange = this.priceListParams.rentRangeModified.sort((a, b) => a - b);
      this.priceListServer.updatepriceList(this.priceListParams._id, this.priceListParams)
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
    // this.store.pipe(take(1)).subscribe(store => {
    //   this.thirdFormGroup.patchValue(store.priceList.priceList);
    // });
  }

}
