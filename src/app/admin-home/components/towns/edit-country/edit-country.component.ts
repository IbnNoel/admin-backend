import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { take } from 'rxjs/operators';
import { TownsService } from 'src/app/shared/services/towns.service';
import * as _ from 'lodash';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-edit-country',
  templateUrl: './edit-country.component.html',
  styleUrls: ['./edit-country.component.css']
})
export class EditCountryComponent implements OnInit {

  countryData: any;
  editState = {
    town: false,
    list: false
  };
  modifiedTown: any;
  selectedTown = false;
  townIndex = 0;
  newTown: any;
  newTownFormGroup: FormGroup;

  constructor(private route: ActivatedRoute, private location: Location,
              private formBuilder: FormBuilder ,private townsService: TownsService) {
    this.route.params.pipe(take(1)).subscribe(data => {
      this.countryData = _.cloneDeep(data);
      const list = JSON.parse(data.list);
      this.countryData = {...this.countryData, list};
    });
  }

  ngOnInit(): void {
    this.townIndex = 0;
    this.newTownFormGroup = this.formBuilder.group({
      name: ['', Validators.required],
      longitude: ['', Validators.required],
      latitude: ['', Validators.required],
      pop: ['', Validators.required]
    });

    this.modifiedTown = {
      _id: this.countryData.list[this.townIndex]._id || '',
      name: this.countryData.list[this.townIndex].name || '',
      pop: this.countryData.list[this.townIndex].pop || '',
      location: this.countryData.list[this.townIndex].location || ''
    };
  }

  clickTown(value) {
    this.selectedTown = true;
    value = JSON.parse(value);
    this.townIndex = value;
    this.modifiedTown._id = this.countryData.list[value]._id,
    this.modifiedTown.name = this.countryData.list[value].name,
    this.modifiedTown.pop = this.countryData.list[value].pop,
    this.modifiedTown.location = this.countryData.list[value].location;
  }

  submitEditcountryData() {
    this.modifiedTown.pop = +this.modifiedTown.pop;
    this.countryData.list[this.townIndex] = this.modifiedTown;
    this.countryData.list = this.countryData.list.sort((a, b) => -a.pop + b.pop);
    this.townsService.editCountryData(this.countryData)
     .subscribe(Data => console.log(Data));
     this.location.back();
  }

  backButton() {
    this.location.back();
  }

}
