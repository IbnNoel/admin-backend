import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TownsService } from 'src/app/shared/services/towns.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-add-country-list',
  templateUrl: './add-country-list.component.html',
  styleUrls: ['./add-country-list.component.css']
})
export class AddCountryListComponent implements OnInit {

  isLinear = true;
  firstFormGroup: FormGroup;
  town: FormGroup;
  listLength = [0];
  list = new FormArray([]);
  pushedlist: any;

  constructor(private formBuilder: FormBuilder, private router: Router,
              private location: Location, private townsService: TownsService) { }

  ngOnInit(): void {
    this.list = new FormArray([]);
    this.firstFormGroup = this.formBuilder.group({
      country: ['', Validators.required],
    });

    this.pushedlist = new FormGroup({
      longitude: new FormControl('',  Validators.required),
      latitude: new FormControl('',  Validators.required),
      name: new FormControl('',  Validators.required),
      pop: new FormControl('',  Validators.required)
    });
    this.list.push(this.pushedlist);
  }

  changeListLength(value) {
    if (value === 'plus') {
      const pushedlist = new FormGroup({
        longitude: new FormControl('',  Validators.required),
        latitude: new FormControl('',  Validators.required),
        name: new FormControl('',  Validators.required),
        pop: new FormControl('',  Validators.required)
      });
      this.list.push(pushedlist);
    }
    if (value === 'minus' && (this.list.controls.length > 1)) {
      this.list.removeAt(this.list.controls.length -1);
    }
  }
  validValue() {
    return (this.firstFormGroup.valid && this.list.valid);
  }
  submitTownList() {
    const obj = {
    country : this.firstFormGroup.controls.country.value,
    list : this.list.value
    };
    this.townsService.addCountryData(obj).subscribe(Data => console.log(Data));
  }

  backButton() {
    this.location.back();
  }
}
