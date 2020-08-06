import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RefDataService } from 'src/app/moopla/services/ref-data.service';
import { LocalService } from 'src/app/shared/services/local.service';
import { PriceListService } from 'src/app/shared/services/price-list.service';
import { MatChipInputEvent } from '@angular/material/chips';
import { ENTER, COMMA } from '@angular/cdk/keycodes';


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
  
  selectable = true;
  removable = true;
  addOnBlur = false;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  inputCtrl = new FormControl();
  
  constructor(private _formBuilder: FormBuilder, private route: ActivatedRoute, private _location: Location, 
    private refDataService: RefDataService, private localService: LocalService, private priceListServer: PriceListService) {
    this.refDataId = this.route.snapshot.paramMap.get('id');
   }

  ngOnInit(): void {
      this.refDataService.getRefData(this.refDataId).subscribe((data: any) => {
      console.log(data);
      this.firstFormGroup = this._formBuilder.group({
        _id: [data._id],
        country: [data.country, {updateOn: 'submit'}],
        currencyCode: [data.currencyCode, {updateOn: 'submit'}],
        rentPeriod: [data.rentPeriod, {updateOn: 'submit'}],
        
      });
      this.secondFormGroup = this._formBuilder.group({
        _id: [data.local._id],
        local: [data.local.local, {updateOn: 'submit'}],
        description: [data.local.description, {updateOn: 'submit'}],
        shortDateFormat: [data.local.shortDateFormat, {updateOn: 'submit'}],
        longDateFormat: [data.local.longDateFormat, {updateOn: 'submit'}],
        timeFormat: [data.local.timeFormat, {updateOn: 'submit'}],
        decimalFormat: [data.local.decimalFormat, {updateOn: 'submit'}],
        systemDefault: [data.local.systemDefault, {updateOn: 'submit'}],
      });
      this.thirdFormGroup = this._formBuilder.group({
        _id: [!data.priceList._id? '': data.priceList._id],
        rentRange: [data.priceList.rentRange, {updateOn: 'submit'}],
        saleRange: [data.priceList.saleRange, {updateOn: 'submit'}]
      });
    })
  }

  change(data, value) {
    if(value == 'rentRange') {
      this.thirdFormGroup.patchValue({
        rentRange: data
      });
      // this.thirdFormGroup.controls(rentRange).
    }
    if(value == 'saleRange') {
      this.thirdFormGroup.patchValue({
        saleRange: data
      })
    }
  }

  onSubmit(entity){
    this.editState[entity] = false;
    if(entity == 'refData'){ 
      this.refDataService.updateRefData(this.firstFormGroup.value._id,this.firstFormGroup.value)
      .subscribe(data => {
        console.log(data);
      })
    }
    if(entity == 'local') {
      this.localService.updateLocal(this.secondFormGroup.value._id, this.secondFormGroup.value)
      .subscribe(data => {
        console.log(data);
      })
    }
    if(entity = 'priceList') {
      console.log(this.thirdFormGroup.value.rentRange);
      this.priceListServer.updatepriceList(this.thirdFormGroup.value._id, this.thirdFormGroup.value)
      .subscribe(data => {
        console.log(data);
      })
    }
  }

  backButton(){
    this._location.back();
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    debugger;
    let testInput: any = this.thirdFormGroup.value.rentRange;
    if (value) {
      testInput.push(+value);
    }
    if (input) {
      input.value = ''
;    }
    this.inputCtrl.setValue(null);
  }

  remove(data: any): void {
    let testInput: any = this.thirdFormGroup.value.rentRange;

    const index = testInput.indexOf(data);
    if (index >= 0) {
      testInput.splice(index, 1);
    }
  }

  test() {
    console.log(this.thirdFormGroup.value.rentRange);
  }
}
