import { Component, OnInit, ComponentFactoryResolver } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ColumnDefs } from 'src/app/components/controls/data-table/classes/Columns';
import { PageSettings } from 'src/app/components/controls/data-table/classes/Paging';
import { GeneralSettings } from 'src/app/components/controls/data-table/classes/General';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { PropertyNewsService } from 'src/app/shared/services/property-news.service';
import { ActionMenuComponent, ActionButton } from 'src/app/components/controls/action-menu/action-menu.component';
import * as moment from 'moment-mini';
import { ExpansionSettings } from 'src/app/components/controls/data-table/classes/Expansion';
import { EditArticleComponent } from './edit-article/edit-article.component';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {

  data = new BehaviorSubject<Array<any>>([]);
  colDefinitions: Array<ColumnDefs>;
  pageSettings: PageSettings;
  generalSettings = new GeneralSettings();
  expansionSettings: ExpansionSettings;
  searchFormGroup: FormGroup;

  constructor(private formBuilder: FormBuilder, private router: Router,
              private newsService: PropertyNewsService, public CFR: ComponentFactoryResolver) {
                this.setUpColumnDefintion();
                this.expansionSettings = this.setupExpansionSettings();
                this.setUppageSettings();
  }

  ngOnInit(): void {
    this.searchFormGroup = this.formBuilder.group({
      userId: [''],
      articleHeadline: [''],
    });
    this.onPageChange();
  }

  setUpColumnDefintion() {
    this.colDefinitions = [
      {
        header: 'id',
        key: '_id',
        className: 'data_grid_left_align',
      },
      {
        header: 'Author ID',
        key: 'userId',
        className: 'data_grid_left_align',
      },
      {
        key: 'articleHeadline',
        className: 'data_grid_left_align',
        header: 'Article Head Line',
        responsivePriority: true
      },
      { 
        header: 'Added',
        key: 'added',
        formatter: (data, type, row) => {
          return moment(data).format('DD/MM/YYYY');
        },
      },
      {
        cellElement: (cellData, rowData, row) => {
          return this.generateActionMenuForRfr(cellData, rowData, row);
        }, className: 'data_grid_center_align', responsivePriority: true
      }
    ];
  }

  generateActionMenuForRfr(cellData, rowData, row) {
    const menu = new ActionMenuComponent();
    const deleteButton = new ActionButton();
    deleteButton.label = 'delete';
    deleteButton.data = rowData;
    // deleteButton.action = (data => {
    //   this.deleteUserInfo(data._id);
    // });
    const seePostInfo = new ActionButton();
    seePostInfo.label = 'See More Info';
    seePostInfo.data = rowData;
    seePostInfo.action = (data) => {
    this.router.navigate([`admin/seePostInfo`, data]);
    };
    const editInfo = new ActionButton();
    editInfo.label = 'Edit HeadLine';
    editInfo.data = rowData;
    editInfo.action = (data) => {
      this.expansionSettings.ExpandGrid({id: data._id, propertyName: '_id'});
    };
    menu.buttons.push(editInfo, seePostInfo, deleteButton);
    return menu;
  }

  setUppageSettings() {
    this.pageSettings = new PageSettings(() => {
      this.onPageChange();
    });
  }

  onPageChange(value?) {
    this.pageSettings.currentPage = (value) ? 1 : this.pageSettings.currentPage;
    let pg = this.pageSettings.currentPage - 1;
    let pgS = this.pageSettings.pageSize;
    this.newsService.getDataTable(pg, pgS, this.searchFormGroup.getRawValue()).subscribe(data => {
      this.pageSettings.setTotalRecords(data.total);
      this.data.next(data.data);
    });
  }

  setupExpansionSettings() {
    return new ExpansionSettings(false, (viewContainerRef, rowData, row) => {
      return new Promise<any>((resolve) => {
        const componentResolve =
          this.CFR.resolveComponentFactory(EditArticleComponent);
        const component = viewContainerRef.createComponent(componentResolve);
        component.instance.editFormGroup.patchValue({
          _id: rowData._id,
          userId: rowData.userId,
          articleHeadline: rowData.articleHeadline
        });
        component.instance.update.subscribe(event => {
          this.newsService.editArticle(component.instance.editFormGroup.value)
            .pipe(filter((data: any) => data.success === true))
            .subscribe((data) => {
              rowData.articleHeadline = component.instance.editFormGroup.value.articleHeadline;
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
}
