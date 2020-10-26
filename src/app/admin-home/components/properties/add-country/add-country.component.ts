import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { RefDataService } from 'src/app/moopla/services/ref-data.service';
import { LocalService } from 'src/app/shared/services/local.service';
import { tap, switchMap } from 'rxjs/operators';
import { PriceListService } from 'src/app/shared/services/price-list.service';
import { Location } from '@angular/common';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';

@Component({
  selector: 'app-add-country',
  templateUrl: './add-country.component.html',
  styleUrls: ['./add-country.component.css']
})
export class AddCountryComponent implements OnInit {
  isLinear = true;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;

  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  addOnBlur = false;
  inputCtrl = new FormControl();

  newPostValidation = {
    local: [
      { type: 'required', message: 'local is required' }
    ],
    description: [
      { type: 'required', message: 'description is required' }
    ],
    shortDateFormat: [
      { type: 'required', message: 'shortDateFormat is required' }
    ],
    longDateFormat: [
      { type: 'required', message: 'longDateFormat is required' }
    ],
    timeFormat: [
      { type: 'required', message: 'Time Format is required' }
    ],
    decimalFormat: [
      { type: 'required', message: 'Decimal Format is required' }
    ],
    systemDefault: [
      { type: 'required', message: 'System Default is required' }
    ],
    country: [
      { type: 'required', message: 'country is required' }
    ],
    currencyCode: [
      { type: 'required', message: 'Currency Code is required' }
    ],
    rentPeriod: [
      { type: 'required', message: 'Rent Period is required' }
    ],
    images: [
      { type: 'required', message: 'images is required' }
    ],
    locationCode: [
      { type: 'required', message: 'location code is required' }
    ],
    rentRange: [
      { type: 'required', message: 'rent Range code is required & must only contain numbers' },
      { type: 'notNumber', message: 'rent Range must only contain numbers' }
    ],
    saleRange: [
      { type: 'required', message: 'sale Range code is required & must only contain numbers' },
      { type: 'notNumber', message: 'rent Range must only contain numbers' }
    ],

  };

  constructor(private _formBuilder: FormBuilder, private router: Router, private priceListService: PriceListService,
              private refDataService: RefDataService, private localService: LocalService, private _location: Location) { }

  ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      local: ['', Validators.required],
      description: ['', Validators.required],
      shortDateFormat: ['', Validators.required],
      longDateFormat: ['', Validators.required],
      timeFormat: ['', Validators.required],
      decimalFormat: ['', Validators.required],
      systemDefault: ['', Validators.required],
    });
    this.secondFormGroup = this._formBuilder.group({
      country: ['', Validators.required],
      currencyCode: ['', Validators.required],
      rentPeriod: [[], Validators.required],
      local_id: [''],
      priceList_id: ['']
    });
    this.thirdFormGroup = this._formBuilder.group({
      rentRange: [[],  Validators.required],
      saleRange: [[],  Validators.required]
    });
  }

  createRefData() {
    this.localService.createLocal(this.firstFormGroup.value).pipe(
      (tap((data: any) => {
        console.log(data);
        this.secondFormGroup.patchValue({ local_id: data._id });
      })
      ),
      switchMap(data => this.priceListService.createpriceList(this.thirdFormGroup.value).pipe(
        (tap((data: any) => {
          this.secondFormGroup.patchValue({ priceList_id: data._id });
        }))
      )),
      switchMap(data => this.refDataService.creatRefData(this.secondFormGroup.value))
    ).subscribe(data => {
      console.log(data);
      this._location.back();
    });
  }

  add(event: MatChipInputEvent, type): void {
    const input = event.input;
    const value = event.value;
    let controlName = type;
    let copiedInput = [];

    if (type !== 'rentPeriod') {
    copiedInput = (type == 'sale') ? this.thirdFormGroup.value.saleRange : this.thirdFormGroup.value.rentRange;
    controlName = (type === 'sale') ? 'saleRange' : 'rentRange';
    } else {
      copiedInput = this.secondFormGroup.value.rentPeriod;
      controlName = type;
    }

    if(type === 'rentPeriod') {
      this.secondFormGroup.controls[controlName].setErrors(null);
      this.secondFormGroup.controls[controlName].clearValidators();
      copiedInput.push(value);
    } else {
      if (!!+value) {
        this.thirdFormGroup.controls[controlName].setErrors(null);
        this.thirdFormGroup.controls[controlName].clearValidators();
        copiedInput.push(+value);
      }
      if (!+value) {
        this.thirdFormGroup.controls[controlName].setErrors(null);
        this.thirdFormGroup.controls[controlName].clearValidators();
      }
      if (!this.thirdFormGroup.value.saleRange.length || !this.thirdFormGroup.value.rentRange.length) {
        if (!this.thirdFormGroup.value.saleRange.length && type === 'sale') {
          this.thirdFormGroup.controls[controlName].setValidators([Validators.required]);
          this.thirdFormGroup.controls[controlName].setErrors(null);
        }
        if (!this.thirdFormGroup.value.rentRange.length && type === 'rent') {
          this.thirdFormGroup.controls[controlName].setValidators([Validators.required]);
          this.thirdFormGroup.controls[controlName].setErrors(null);
        }
      }
    }
    if (input) {
      input.value = '';
    }
    this.inputCtrl.setValue(null);
    console.log(this.thirdFormGroup.value);
  }

  remove(data: any, type): void {
    const copiedInput = (type == 'sale') ? this.thirdFormGroup.value.saleRange : this.thirdFormGroup.value.rentRange;
    const index = copiedInput.indexOf(data);
    const controlName = (type === 'sale') ? 'saleRange' : 'rentRange';

    if (index >= 0) {
      if(type === 'rentPeriod') {
        copiedInput.splice(index, 1);
      } else {
         copiedInput.splice(index, 1);
        }
    }

    if (!this.thirdFormGroup.value.saleRange.length || !this.thirdFormGroup.value.rentRange.length) {
      if (!this.thirdFormGroup.value.saleRange.length && type === 'sale') {
        this.thirdFormGroup.controls[controlName].setValidators([Validators.required]);
        this.thirdFormGroup.controls[controlName].setErrors(null);

      }
      if (!this.thirdFormGroup.value.rentRange.length && type === 'rent') {
        this.thirdFormGroup.controls[controlName].setValidators([Validators.required]);
        this.thirdFormGroup.controls[controlName].setErrors(null);

      }
      if (!this.secondFormGroup.value.rentPeriod.length && type === 'rentPeriod') {
        this.thirdFormGroup.controls[controlName].setValidators([Validators.required]);
        this.thirdFormGroup.controls[controlName].setErrors(null);
      }
    }

    console.log(this.thirdFormGroup.value);
  }

}

