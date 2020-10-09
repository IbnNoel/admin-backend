import { Component, ComponentFactoryResolver, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { ActionButton, ActionMenuComponent } from 'src/app/components/controls/action-menu/action-menu.component';
import { ColumnDefs } from 'src/app/components/controls/data-table/classes/Columns';
import { ExpansionSettings } from 'src/app/components/controls/data-table/classes/Expansion';
import { GeneralSettings } from 'src/app/components/controls/data-table/classes/General';
import { PageSettings } from 'src/app/components/controls/data-table/classes/Paging';
import { TownsService } from 'src/app/shared/services/towns.service';

@Component({
  selector: 'app-towns',
  templateUrl: './towns.component.html',
  styleUrls: ['./towns.component.css']
})
export class TownsComponent implements OnInit {

  data = new BehaviorSubject<Array<any>>([]);
  colDefinitions: Array<ColumnDefs>;
  pageSettings: PageSettings;
  generalSettings = new GeneralSettings();
  expansionSettings: ExpansionSettings;
  searchFormGroup: FormGroup;

  constructor(private formBuilder: FormBuilder, public CFR: ComponentFactoryResolver,
              private router: Router, private townsService: TownsService) {
                this.setUpColumnDefintion();
                // this.expansionSettings = this.setupExpansionSettings();
                this.setUppageSettings();
               }

  ngOnInit(): void {
    this.searchFormGroup = this.formBuilder.group({
      // _id: [''],
      country: ['']
    });
    this.onPageChange();
  }

  setUpColumnDefintion() {
    this.colDefinitions = [
      {
        key: '_id',
        className: 'data_grid_left_align',
        header: 'Id'
      },
      {
        key: 'country',
        className: 'data_grid_left_align',
        header: 'country',
        responsivePriority: true
      },
       {
        header: 'towns',
        cellElement: (cellData, rowData, row, col, td) => {
          const towns = rowData.list;
          const ref = $('<select>' + '</select>');
          const output = [];
          output.push('<option value="' + 0 + '">' + 'see Towns' + '</option>');
          $.each(towns, function (key: number, value) {
            output.push('<option value="' + key + '">' + value.name + '</option>');
          });
          $(ref).html(output.join(''));
          $(td).html(' ').append(ref);
        }, className: 'data_grid_center_align', responsivePriority: true
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
    (value) ? this.pageSettings.currentPage=1: this.pageSettings.currentPage; 

    const pg = this.pageSettings.currentPage - 1;
    const pgS = this.pageSettings.pageSize;
    this.townsService.getTowns(pg, pgS, this.searchFormGroup.value).subscribe(
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
   //   this.deleteCountryInfo(data._id);
    });
    const editTownsInfo = new ActionButton();
    editTownsInfo.label = 'Edit Info';
    editTownsInfo.data = rowData;
    editTownsInfo.action = (data => {
    const list = JSON.stringify(data.list);
    const params = {...data, list};
    this.router.navigate([`admin/edit-country`, params]);
    });
    menu.buttons.push(deleteButton, editTownsInfo);
    return menu;
  }

}
