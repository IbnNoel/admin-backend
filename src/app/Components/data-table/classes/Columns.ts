import {ActionButton, ActionMenuComponent} from "../../action-menu/action-menu.component";
import {ComponentFactoryResolver, ComponentRef, ViewContainerRef} from "@angular/core";
import { DataTableComponent } from '../data-table.component';
import { RenderedResponsiveCollapsedHelper } from './CollapsedResponsive';
import { DataTableService } from 'src/app/services/data-table.service';
import { map } from 'rxjs/operators';
import { AngularFireObject } from '@angular/fire/database';
import { Address } from 'src/app/models/address';
// import { TranslateService } from '@ngx-translate/core';
// import { CheckBoxHelper } from './CheckBox';
// import { settings } from 'cluster';

export class HandleColumnSettings {

  private colSettings: DataTables.ColumnSettings = {
    orderable: false
  };
  columnDefinition:ColumnDefs;
  isCollapsedOnRender: boolean;
  renderedResponseCollapsedHelper: RenderedResponsiveCollapsedHelper;
  componentFactory: ComponentFactoryResolver;
  viewContainerRef: ViewContainerRef;
  // translateService: TranslateService;
  dataTableComponent: DataTableComponent;

  constructor(setting: ColumnDefs, dtComponent: DataTableComponent) {
    this.colSettings.className = "key_" + setting.key;
    this.colSettings.title = setting.key;
    this.columnDefinition = setting;
    this.dataTableComponent = dtComponent
    //TODO:- REFACTOR!
    this.renderedResponseCollapsedHelper = dtComponent.renderedResponsiveCollapsedHelper;
    this.viewContainerRef = dtComponent.VCR;
    // this.translateService = dtComponent.translateService;
    
    Object.entries(setting).forEach(([key, value]) => {
      if (value && this[key + "_Func"])
        this[key + "_Func"](value)
    });

    this.isCollapsedOnRender = dtComponent.CollapseOnRender;
    this.setCollapseRenderSettings();
  }

  setCollapseRenderSettings(){
    if(this.isCollapsedOnRender){
      if(this.columnDefinition.breakpoint){
        this.colSettings.className += " " + this.columnDefinition.breakpoint;
      }else{
        this.colSettings.className += " min-narrowDesktop";
        if(this.columnDefinition.responsivePriority){
          this.renderedResponseCollapsedHelper.isResponsivePriortySet = true;
          this.colSettings.className += " max-desktop";
        }
      }
    }
  }

  getDataTablesColumns() {
    return this.colSettings;
  }

  header_Func(header: string) {
    this.colSettings.className += " head_" + header.replace(" ", "_");
    this.colSettings.className = this.colSettings.className.replace("/", "_");
    // this.translateService.get(header).subscribe((res: string) => {
    //   this.colSettings.title = res;
    // });
  }

  key_Func(key: string) {
    this.colSettings.name = key;
    this.colSettings.data = key;
  }

  className_Func(className: string) {
    this.colSettings.className += " " + className;
  }

  cellElement_Func(func: FunctionCellElement) {
    this.colSettings.defaultContent = "";
    this.colSettings.createdCell = (cell, cellData, rowData, row, col) => {

      var elementValue = func(cellData, rowData, row, col, cell);
      if (elementValue instanceof GPFIButton) {
        var button = elementValue as GPFIButton;
        button.Html.click(rowData, (e) => {
          button.OnClick(rowData, row);
        });
        $(cell).append(elementValue.Html);
      } else if (elementValue instanceof ActionMenuComponent) {
        let componentFactory = this.componentFactory.resolveComponentFactory(ActionMenuComponent);
        let componentRef: ComponentRef<ActionMenuComponent> = this.viewContainerRef.createComponent(componentFactory);
        componentRef.instance.buttons = elementValue.buttons;
        $(cell).append(componentRef.location.nativeElement);
      }
    };
    this.colSettings.className += " gpfi_tbl_customCell";
  }

  default_Func() {
  }

  translate_Func() {
    this.colSettings.defaultContent = "";
    // this.colSettings.createdCell = (cell, cellData) => {
    //   this.translateService.get(cellData).subscribe((res: string) => {
    //     $(cell).html(res);
    //   });
    // }
  }

  formatter_Func(func: (any) => string) {
    this.colSettings.render = func;
  }

  type_Func() {
  }

  sortable_Func() {
  }
  collapseGrid_Func() {
  }
  hideCollapsed_Func() {
  }
  detailColumn_Func() {
  }
  calculateTotal_Func() {
    // totalCalculateColumns[colElement.key] = "";
  }
  width_Func(width: string){
    this.colSettings.width = width;
    this.dataTableComponent.tableSettings.autoWidth = false;
  }
}


// TODO:- Add description to each property

export interface ColumnDefs {
  /**
   * Represents the Key property in the Data Object which this Column will be mapped to.
   */
  key?: string;
  /**
   * The Name of the Column Header, If not set then the Key Name will be used as the Column Header
   */
  header?: string;
  /**
   * The class name that will be attached to the cells that are part of the columns of the grid.
   */
  className?: string;
  calculateTotal?: boolean;
  /**
   * The Default text which will appear in the column cell
   */
  default?: string;
  /**
   * A callback used to create dynamic data for the cell. //TODO:- add more information and describe return function
   */
  cellElement?: FunctionCellElement | HTMLElement | GPFIButton | ActionMenuComponent;

  translate?: boolean;
  formatter?: DataTables.FunctionColumnRender;
  /** TODO:- Create an Enum for this type */
  type?: any;
  sortable?: string;
  collapseGrid?: string;
  width?: string;
  hideCollapsed?: boolean;
  detailColumn?: any;
  /* 
  * Used to determine which columns should remain on screen when grid collapses in responsive mode.
  */
  responsivePriority?:boolean;
  /*
  * TODO:- Set up enum of break points
  * Manully set the breakpoint at which the column should be view on screen !
  */
  breakpoint?: string;
}

type FunctionCellElement = (cellData?: any, rowData?: any, row?: number, col?: number, td?:any) => HTMLButtonElement | HTMLElement | GPFIButton | ActionMenuComponent | string | void;

export class GPFIButton {
  private html: JQuery<HTMLElement>;
  private onClick: any;

  constructor(name, onClick, cssClass?) {
    let classes = cssClass || "btn-default";
    this.html = $(`<button class="btn  ${classes}"> ${name} </button>`);
    this.onClick = onClick;
  }

  get Html() {
    return this.html;
  }

  OnClick(rowData,row) {
    return this.onClick(rowData, row);
  }
}

