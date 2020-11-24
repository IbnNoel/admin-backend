import { Component, ComponentFactoryResolver, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { ActionButton, ActionMenuComponent } from 'src/app/components/controls/action-menu/action-menu.component';
import { ColumnDefs } from 'src/app/components/controls/data-table/classes/Columns';
import { ExpansionSettings } from 'src/app/components/controls/data-table/classes/Expansion';
import { GeneralSettings } from 'src/app/components/controls/data-table/classes/General';
import { PageSettings } from 'src/app/components/controls/data-table/classes/Paging';
import { OwnerService } from 'src/app/shared/services/owner.service';

@Component({
  selector: 'app-owner',
  templateUrl: './owner.component.html',
  styleUrls: ['./owner.component.css']
})
export class OwnerComponent implements OnInit {

  data = new BehaviorSubject<Array<any>>([]);
  colDefinitions: Array<ColumnDefs>;
  pageSettings: PageSettings;
  generalSettings = new GeneralSettings();
  expansionSettings: ExpansionSettings;
  searchFormGroup: FormGroup;

  constructor(private formBuilder: FormBuilder, public CFR: ComponentFactoryResolver,
              private router: Router,  private ownerService: OwnerService) {
                this.setUpColumnDefintion();
                this.setUppageSettings();
              }

  ngOnInit(): void {
    this.searchFormGroup = this.formBuilder.group({
      _id: ['']
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
        key: 'forRent.length',
        className: 'data_grid_center_align',
        header: 'To Rent Properties'
      },
      {
        key: 'forSale.length',
        className: 'data_grid_center_align',
        header: 'for Sale Properties'
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
    this.ownerService.searchOwner(pg, pgS, this.searchFormGroup.value).subscribe(
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
    const viewDetailsButton = new ActionButton();
    viewDetailsButton.label = 'viewDetails';
    viewDetailsButton.data = rowData;
    viewDetailsButton.action = (data => {
      const forSale = JSON.stringify(data.forSale);
      const forRent = JSON.stringify(data.forRent);
      const params = {...data, forSale, forRent};
      this.router.navigate([`admin/viewDetails-owner/`, params._id]);
    });
    menu.buttons.push(deleteButton, viewDetailsButton);
    return menu;
  }

}
