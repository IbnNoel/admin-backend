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

  constructor(public CFR: ComponentFactoryResolver, private _formBuilder: FormBuilder, private router: Router, private refDataService: RefDataService ) { 
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
        key: 'rentPriceList.minPrice',
        className: `data_grid_left_align`,
        header: 'Rent minPrice',
      },
      {
        key: 'rentPriceList.maxPrice',
        className: `data_grid_left_align`,
        header: 'Rent maxPrice',
      },
      {
        key: 'salePriceList.minPrice',
        className: `data_grid_left_align`,
        header: 'Sale minPrice',
      },
      {
        key: 'salePriceList.maxPrice',
        className: `data_grid_left_align`,
        header: 'Sale maxPrice',
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
  
  onPageChange() {
    let pgN = this.pageSettings.currentPage;
    let pgS = this.pageSettings.pageSize;
    this.refDataService.searchRefData(this.searchFormGroup,pgS, pgN).subscribe(
      (data: any) => {
        this.data.next(data.data);
        this.pageSettings.setTotalRecords(data.count);
      },
      err => {
        console.log(err)
      }
    );
  }

  generateActionMenuForRfr(cellData, rowData, row) {
    let menu = new ActionMenuComponent();
    let editRefData = new ActionButton();
    editRefData.label = "EDIT_REFDATA";
    editRefData.data = rowData;
    editRefData.action = (data) => {
      this.expansionSettings.ExpandGrid({ id: data._id, propertyName: "_id" });
    };
    let deleteButton = new ActionButton();
    deleteButton.label = "delete";
    deleteButton.data = rowData;
    deleteButton.action = (data => {
      this.deleteRefData(data._id);
    });
    let viewButton = new ActionButton();
    viewButton.label = "VIEW-REFDATA";
    viewButton.data = rowData;
    viewButton.action = (data => {
      this.router.navigate([`admin/editRefData/${data._id}`])
    });
    menu.buttons.push(editRefData, deleteButton, viewButton);
    return menu;
  };
  
  setupExpansionSettings() {
    return new ExpansionSettings(false, (viewContainerRef, rowData, row) => {
      return new Promise<any>((resolve) => {
        const componentResolve =
          this.CFR.resolveComponentFactory(EditRefDataComponent);
        let component = viewContainerRef.createComponent(componentResolve);
        component.instance.editFormGroup.patchValue({
          country: rowData.country,
          currencyCode: rowData.currencyCode,
          rentPeriod: rowData.rentPeriod
        });
        component.instance.update.subscribe(event => {
          this.refDataService.updateRefData(rowData._id, component.instance.editFormGroup.value)
            .pipe(filter((data: any) => data.success === true))
            .subscribe((data) => {
              this.generalSettings.UpddateRow({ id: rowData._id, propertyName: "_id" }, rowData);
            });
          this.expansionSettings.CollapseGrid({ id: rowData._id, propertyName: "_id" });
        });
        component.instance.cancel.subscribe(event => {
          this.expansionSettings.CollapseGrid({ id: rowData._id, propertyName: "_id" });
        });
        resolve(component);
      });
    });
  }

  addCountry() {
    this.router.navigate(['admin/creatCountry']);
  }

  deleteRefData(data) {
    console.log(data);
  }
  
  onCountryChange(value) {
    console.log(value);
  }

}
