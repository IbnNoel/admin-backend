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
import * as moment from 'moment-mini';

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
      name: [''],
      date: [new Date('1/1/2019')]
    });
    this.onPageChange();
  }

  setUpColumnDefintion() {
    this.colDefinitions = [
      {
        key: "firstName",
        className: 'data_grid_left_align',
        header: 'Name',
        formatter: (data, type, row) => {
          return data + " " + (row.lastName || "")
        },
        responsivePriority: true
      },
      {
        key: 'email',
        className: 'data_grid_center_align',
        header: 'Email'
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
        key: 'address',
        className: 'data_grid_center_align',
        header: 'Address',
        formatter: (data, type, row) => {
          return data?.addressLine1 +", "+ data?.addressLine2
        }
      },
      {
        key: 'address.addressLine3',
        className: 'data_grid_center_align',
        header: 'Address'
      },
      {
        key: 'phoneNumber',
        className: 'data_grid_center_align',
        header: 'Phone Number'
      },
      {
        key: 'userType',
        className: 'data_grid_center_align',
        header: 'UserType'
      },
      {
        key: 'statistics.avgPostScore',
        className: 'data_grid_center_align',
        header: 'Kunooz Score',
        formatter: (data, type, row) => {
          return Math.round(data);
        }
      },
      {
        key: 'statistics.forSaleCount',
        className: 'data_grid_center_align',
        header: 'Drafted Properties',
        formatter: (data, type, row) => {
          const forSaleDrafted = row.statistics.forSaleCount - row.statistics.forSalePublishedCount
          const forRentDrafted = row.statistics.forRentCount - row.statistics.forRentPublishedCount
          return forSaleDrafted+forRentDrafted
        },
      },
      {
        key: 'statistics.forRentPublishedCount',
        className: 'data_grid_center_align',
        header: 'To Rent Properties'
      },
      {
        key: 'statistics.forSalePublishedCount',
        className: 'data_grid_center_align',
        header: 'for Sale Properties'
      },
      {
        key: 'statistics.totalCalls',
        className: 'data_grid_center_align',
        header: 'Total calls'
      },
      {
        key: 'statistics.totalEmails',
        className: 'data_grid_center_align',
        header: 'Total Emails'
      },
      {
        key: 'statistics.totalViews',
        className: 'data_grid_center_align',
        header: 'Total Views'
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
