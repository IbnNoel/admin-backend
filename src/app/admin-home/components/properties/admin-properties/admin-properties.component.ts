import { Component, OnInit, ComponentFactoryResolver } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { ColumnDefs } from 'src/app/components/controls/data-table/classes/Columns';
import { ExpansionSettings } from 'src/app/components/controls/data-table/classes/Expansion';
import { GeneralSettings } from 'src/app/components/controls/data-table/classes/General';
import { PageSettings } from 'src/app/components/controls/data-table/classes/Paging';
import { RefDataService } from 'src/app/moopla/services/ref-data.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActionMenuComponent, ActionButton } from 'src/app/components/controls/action-menu/action-menu.component';
import { EditRefDataComponent } from '../edit-ref-data/edit-ref-data.component';
import { filter } from 'rxjs/operators';
import { LocalService } from 'src/app/shared/services/local.service';
import { PriceListService } from 'src/app/moopla/services/price-list.service';
import { AppDropdownComponent } from 'src/app/components/controls/dropdown/app.dropdown.component';

@Component({
  selector: 'app-admin-properties',
  templateUrl: './admin-properties.component.html',
  styleUrls: ['./admin-properties.component.css']
})
export class AdminPropertiesComponent implements OnInit {

  data = new BehaviorSubject<Array<any>>([]);
  colDefinitions: Array<ColumnDefs>;
  pageSettings: PageSettings;
  generalSettings = new GeneralSettings();
  expansionSettings: ExpansionSettings;
  searchFormGroup: FormGroup;

  constructor(public CFR: ComponentFactoryResolver, private _formBuilder: FormBuilder, private router: Router,
    private refDataService: RefDataService, private localServie: LocalService, private priceListService: PriceListService) {
    this.setUpColumnDefintion();
    this.expansionSettings = this.setupExpansionSettings();
    this.setUppageSettings();
  }

  ngOnInit(): void {
    this.searchFormGroup = this._formBuilder.group({
      _id: [''],
      country: [''],
      selectedCountry: ['']
    });
    this.onPageChange();
  }

  setUpColumnDefintion() {
    this.colDefinitions = [
      {
        key: '_id',
        className: `data_grid_left_align`,
        header: 'Id'
      },
      {
        key: 'currencyCode',
        className: `data_grid_left_align`,
        header: 'Currency Code',
      },
      {
        key: 'rentPeriod',
        className: `data_grid_left_align`,
        header: 'Rent Period',
      },
      {
        key: 'local.description',
        className: 'data_grid_left_align',
        header: 'Description',
      },
      {
        key: 'local.shortDateFormat',
        className: 'data_grid_left_align',
        header: 'Short Date Format',
      },
      {
        key: 'local.longDateFormat',
        className: 'data_grid_left_align',
        header: 'Long Date Format',
      },
      {
        key: 'local.timeFormat',
        className: `data_grid_left_align`,
        header: 'Time Format'
      },
      {
        key: 'local.decimalFormat',
        className: `data_grid_left_align`,
        header: 'Decimal Format',
      },
      {
        header: 'Rent Range',
        cellElement: (cellData, rowData, row, col, td) => {
          const Range = rowData.priceList.rentRange;
          const ref = $('<select>' + '</select>')
          const output = [];
          output.push('<option value="' + 0 + '">' + 'see Range' + '</option>');
          $.each(Range, function (key: number, value) {
            output.push('<option value="' + key + '">' + value + '</option>');
          });
          $(ref).html(output.join(''));
          $(td).html(' ').append(ref);
        }, className: 'data_grid_center_align', responsivePriority: true
      },
      {
        header: 'Sale Range',
        cellElement: (cellData, rowData, row, col, td) => {
          const Range = rowData.priceList.saleRange;
          const ref = $('<select>' + '</select>')
          const output = [];
          output.push('<option value="' + 0 + '">' + 'see Range' + '</option>');
          $.each(Range, function (key: number, value) {
            output.push('<option value="' + key + '">' + value + '</option>');
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
  // all old authentication and admin panel project" On branch authentication-privileges
  setUppageSettings() {
    this.pageSettings = new PageSettings(() => {
      this.onPageChange();
    });
  }

  onPageChange(value?) {
    (value) ? this.pageSettings.currentPage = 1 : this.pageSettings.currentPage;

    const pgN = this.pageSettings.currentPage;
    const pgS = this.pageSettings.pageSize;
    this.refDataService.searchRefData(this.searchFormGroup, pgS, pgN).subscribe(
      (data: any) => {
        console.log(data);
        this.pageSettings.setTotalRecords(data.total);
        this.data.next(data.data);
      },
      err => {
        console.log(err)
      }
    );
  }

  generateActionMenuForRfr(cellData, rowData, row) {
    const menu = new ActionMenuComponent();
    const editRefData = new ActionButton();
    editRefData.label = 'EDIT_REFDATA';
    editRefData.data = rowData;
    editRefData.action = (data) => {
      this.expansionSettings.ExpandGrid({ id: data._id, propertyName: '_id' });
    };
    const deleteButton = new ActionButton();
    deleteButton.label = 'delete';
    deleteButton.data = rowData;
    deleteButton.action = (data => {
      this.deleteRefData(data);
    });
    const viewButton = new ActionButton();
    viewButton.label = 'VIEW_REFDATA_INFO';
    viewButton.data = rowData;
    viewButton.action = (data => {
      let params = data;
      const rentPeriod = JSON.stringify(data.rentPeriod);
      const local = JSON.stringify(data.local);
      const priceList = JSON.stringify(data.priceList);
      params = {...params, local, priceList, rentPeriod};
      this.router.navigate([`admin/editRefData`, params]);
    });
    menu.buttons.push(deleteButton, viewButton);
    return menu;
  };


  setupExpansionSettings() {
    return new ExpansionSettings(false, (viewContainerRef, rowData, row) => {
      return new Promise<any>((resolve) => {
        const componentResolve =
          this.CFR.resolveComponentFactory(EditRefDataComponent);
        const component = viewContainerRef.createComponent(componentResolve);
        component.instance.editFormGroup.patchValue({
          country: rowData.country,
          currencyCode: rowData.currencyCode,
          rentPeriod: rowData.rentPeriod
        });

        component.instance.update.subscribe(event => {
          this.refDataService.updateRefData(rowData._id, component.instance.editFormGroup.value)
            .pipe(filter((data: any) => data.success === true))
            .subscribe((data) => {
              rowData.country = component.instance.editFormGroup.value.country;
              rowData.currencyCode = component.instance.editFormGroup.value.currencyCode;
              rowData.rentPeriod = component.instance.editFormGroup.value.rentPeriod;
              this.generalSettings.UpddateRow({ id: rowData._id, propertyName: '_id' }, rowData);
            });
          this.expansionSettings.CollapseGrid({ id: rowData._id, propertyName: '_id' });
        });
        component.instance.cancel.subscribe(event => {
          this.expansionSettings.CollapseGrid({ id: rowData._id, propertyName: '_id' });
        });
        resolve(component);
      });
    });
  }

  addCountry() {
    this.router.navigate(['admin/creatCountry']);
  }

  deleteRefData(data) {
    this.refDataService.deleteRefDate(data._id).subscribe(data => data);
    this.localServie.deleteLocal(data.local_id).subscribe(data => data);
    this.priceListService.deletePriceList(data.priceList_id).subscribe(data => data);
    this.generalSettings.DeleteRow({ id: data._id, propertyName: '_id' });
  }

  onCountryChange(value) {
    console.log(value);
  }

}
