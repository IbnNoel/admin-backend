import { Component, ComponentFactoryResolver, forwardRef, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';
import { take } from 'rxjs/operators';
import { OwnerService } from 'src/app/shared/services/owner.service';
import { Location } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { ActionButton, ActionMenuComponent } from 'src/app/components/controls/action-menu/action-menu.component';
import { ColumnDefs } from 'src/app/components/controls/data-table/classes/Columns';
import { ExpansionSettings } from 'src/app/components/controls/data-table/classes/Expansion';
import { GeneralSettings } from 'src/app/components/controls/data-table/classes/General';
import { PageSettings } from 'src/app/components/controls/data-table/classes/Paging';
import { PropertiesService } from 'src/app/shared/services/properties.service';
import { FormBuilder, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-view-owner-detail',
  templateUrl: './view-owner-detail.component.html',
  styleUrls: ['./view-owner-detail.component.css']
})
export class ViewOwnerDetailComponent implements OnInit {

  data = new BehaviorSubject<Array<any>>([]);
  colDefinitions: Array<ColumnDefs>;
  pageSettings: PageSettings;
  generalSettings = new GeneralSettings();
  expansionSettings: ExpansionSettings;
  searchFormGroup: FormGroup;
  type: any;
  ownerId: string;
  propertyType: string;

  constructor(private route: ActivatedRoute, private location: Location,
              private ownerService: OwnerService, private propertiesService: PropertiesService,
              private formBuilder: FormBuilder, public CFR: ComponentFactoryResolver,
              private router: Router, private propertyService: PropertiesService) {
   
    this.route.params.pipe(take(1)).subscribe(data => {
      this.ownerId = data._id;
    });
    this.setUpColumnDefintion();
    this.setUppageSettings();
  }

  ngOnInit(): void {
    this.searchFormGroup = this.formBuilder.group({
      _id: [this.ownerId],
      searchType: ['Sale'],
      city: [''],
      propertyType: ['']
    });
    this.onPageChange();
  }
  setUpColumnDefintion() {
    this.colDefinitions = [
      {
        key: 'property.city',
        className: 'data_grid_center_align',
        header: 'city'
      },
      {
        key: 'property.addressLine1',
        className: 'data_grid_center_align',
        header: 'Address',
        formatter: (data,type, row) => {
          return data + ', ' + (row.property.addressLine2 || '')
        },
      },
      {
        key: 'property.propertyType',
        className: 'data_grid_center_align',
        header: 'Type'
      },
      {
        key: 'property.area',
        className: 'data_grid_center_align',
        header: 'Area'
      },
      {
        cellElement: (cellData, rowData, row) => {
          return this.generateActionMenuForRfr(cellData, rowData, row);
        }, className: 'data_grid_center_align', responsivePriority: true
      }
    ];
  }

  setUppageSettings() {
    this.pageSettings = new PageSettings(() => {
      this.onPageChange();
    });
  }

  onPageChange(value?) {
    (value) ? this.pageSettings.currentPage = 1 : this.pageSettings.currentPage;

    const pg = this.pageSettings.currentPage - 1;
    const pgS = this.pageSettings.pageSize;
    this.type = this.searchFormGroup.get('searchType').value;
    this.propertyService.searchOwnerProperty(pg, pgS, this.searchFormGroup.value).subscribe(
      (data: any) => {
        console.log(data);
        this.pageSettings.setTotalRecords(data.total);
        this.data.next(data.data);
      },
      err => { console.log(err); }
    );
  }

  generateActionMenuForRfr(cellData, rowData, row) {
    const menu = new ActionMenuComponent();
    const deleteButton = new ActionButton();
    deleteButton.label = 'delete';
    deleteButton.data = rowData;
    deleteButton.action = (data => {
      // this.deleteUserInfo(data._id);
    });
    const editButton = new ActionButton();
    deleteButton.label = 'edit';
    deleteButton.data = rowData;
    deleteButton.action = (data => {
      let params = data;
      const property = JSON.stringify(data.property);
      const type = this.type;
      params = {...params, property, type};
      this.router.navigate([`admin/editProperty`, params]);
    });
    menu.buttons.push(deleteButton, editButton);
    return menu;
  }

  backButton() {
    this.location.back();
  }

}
