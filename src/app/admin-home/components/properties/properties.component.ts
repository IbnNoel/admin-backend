import { Component, ComponentFactoryResolver, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { ActionButton, ActionMenuComponent } from 'src/app/components/controls/action-menu/action-menu.component';
import { ColumnDefs } from 'src/app/components/controls/data-table/classes/Columns';
import { ExpansionSettings } from 'src/app/components/controls/data-table/classes/Expansion';
import { GeneralSettings } from 'src/app/components/controls/data-table/classes/General';
import { PageSettings } from 'src/app/components/controls/data-table/classes/Paging';
import { PropertiesService } from 'src/app/shared/services/properties.service';
import * as moment from 'moment-mini';

@Component({
  selector: 'app-properties',
  templateUrl: './properties.component.html',
  styleUrls: ['./properties.component.css']
})
export class PropertiesComponent implements OnInit {

  data = new BehaviorSubject<Array<any>>([]);
  colDefinitions: Array<ColumnDefs>;
  pageSettings: PageSettings;
  generalSettings = new GeneralSettings();
  expansionSettings: ExpansionSettings;
  searchFormGroup: FormGroup;
  type: any;

  constructor(private formBuilder: FormBuilder, public CFR: ComponentFactoryResolver,
              private router: Router, private propertyService: PropertiesService) {
                this.setUpColumnDefintion();
                this.setUppageSettings();
               }

  ngOnInit(): void {
    this.searchFormGroup = this.formBuilder.group({
      _id: [''],
      searchType: ['Sale'],
      city: [''],
      propertyType: ['']
    });
    this.onPageChange();
  }

  setUpColumnDefintion() {
    this.colDefinitions = [
      {
        key: "owner",
        className: 'data_grid_left_align',
        header: 'Name',
        formatter: (data, type, row) => {
          return data.firstName + " " + (data.lastName || "")
        },
        responsivePriority: true
      },
      {
        key: 'owner',
        className: 'data_grid_center_align',
        header: 'email',
        formatter: (data, type, row) => {
          return data.email
        },
        responsivePriority: true
      },
      {
        key: '_id',
        className: 'data_grid_center_align',
        header: 'Date created',
        formatter: (data, type, row) => {
          const timestamp = row._id.toString().substring(0, 8);
          const date = new Date(parseInt(timestamp, 16) * 1000)
          return moment(date).format('DD/MM/YYYY');
        }
      },
      {
        key: 'property.published',
        className: 'data_grid_center_align',
        header: 'Published',
        cellElement: (cellData, rowData, row, col, td) => {
          if(cellData){
            $(td).html("<span style='font-size: 25px' class='glyphicon glyphicon-ok-circle'></span>");
          }else{
            $(td).html("<span style='font-size: 25px' class='glyphicon glyphicon-remove-circle'></span>");
          }
        }
      },
      {
        key: 'property.city',
        className: 'data_grid_center_align',
        header: 'city'
      },
      {
        key: 'property.propertyType',
        className: 'data_grid_center_align',
        header: 'Type'
      },
      {
        key: 'owner.phoneNumber',
        className: 'data_grid_center_align',
        header: 'Mobile'
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
    this.propertyService.searchProperty(pg, pgS, this.searchFormGroup.value).subscribe(
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
}
