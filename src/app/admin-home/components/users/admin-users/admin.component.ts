import { Component, ComponentFactoryResolver } from '@angular/core';
import { Store } from '@ngrx/store';
import { BehaviorSubject } from 'rxjs';
import { concatMap, filter, map, mergeMap, tap, switchMap } from 'rxjs/operators';
import { ActionButton, ActionMenuComponent } from 'src/app/components/controls/action-menu/action-menu.component';
import { ColumnDefs } from 'src/app/components/controls/data-table/classes/Columns';
import { ExpansionSettings } from 'src/app/components/controls/data-table/classes/Expansion';
import { GeneralSettings } from 'src/app/components/controls/data-table/classes/General';
import { PageSettings } from 'src/app/components/controls/data-table/classes/Paging';
import { User } from 'src/app/shared/models/user';
import { AddressMdbService } from 'src/app/shared/services/Mongodb/address-mdb.service';
import { UserMdbService } from 'src/app/shared/services/Mongodb/user-mdb.service';
import { AppState } from 'src/app/state/models/app-state-models';
import { SelectCurrentUserInfo } from 'src/app/state/user-actions';
import { AdminFirebasaeService } from '../../../services/admin-firebasae.service';
import { PrivilegeComponent } from '../privilege/privilege.component';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Address } from 'src/app/shared/models/address';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {

  data = new BehaviorSubject<Array<any>>([]);
  colDefinitions: Array<ColumnDefs>;
  pageSettings: PageSettings;
  generalSettings = new GeneralSettings();
  expansionSettings: ExpansionSettings;
  Roles: any;
  currentUser: User;
  searchFormGroup: FormGroup;

  constructor(private _formBuilder: FormBuilder, public CFR: ComponentFactoryResolver, private userMdbService: UserMdbService, private firebaseUser: AdminFirebasaeService,
    private store: Store<AppState>, private router: Router, private adminFireBService: AdminFirebasaeService, private addressService: AddressMdbService) {
    this.setUpColumnDefintion();
    this.expansionSettings = this.setupExpansionSettings();
    this.setUppageSettings();
    this.getUserRoles();
  }

  ngOnInit() {
    this.searchFormGroup = this._formBuilder.group({
      _id: [''],
      name: ['']
    });
    this.store.select(store => store.User.user).subscribe(user => {
      this.currentUser = user
    });
    this.onPageChange();
  }

  setUpColumnDefintion() {
    this.colDefinitions = [
      {
        key: 'email',
        className: 'data_grid_left_align',
        header: 'Email',
        responsivePriority: true
      },
      {
        key: 'name',
        className: 'data_grid_left_align',
        header: 'Name',
        responsivePriority: true
      },
      {
        key: 'roles',
        className: 'data_grid_left_align',
        header: 'Roles',
        responsivePriority: true
      },
      {
        key: 'phone',
        className: 'data_grid_center_align',
        header: 'Phone Number',
        responsivePriority: true
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
  getUserRoles() {
    this.userMdbService.getUserRoles().subscribe((data: any) => { this.Roles = data.roles });
  }

  onPageChange(value?) {
    (value) ? this.pageSettings.currentPage = 1 : this.pageSettings.currentPage;

    let pg = this.pageSettings.currentPage - 1;
    let pgS = this.pageSettings.pageSize;
    this.userMdbService.searchUser(pg, pgS, this.searchFormGroup.value).subscribe(
      (data: any) => {
        console.log(data);
        this.pageSettings.setTotalRecords(data.total);
        this.data.next(data.data);
      },
      err => { console.log(err); }
    );
  }

  generateActionMenuForRfr(cellData, rowData, row) {
    let menu = new ActionMenuComponent();
    let assignPrivileges = new ActionButton();
    assignPrivileges.label = "Assign privileges";
    assignPrivileges.data = rowData;
    assignPrivileges.action = (data) => {
      this.expansionSettings.ExpandGrid({ id: data._id, propertyName: "_id" });
    };
    let deleteButton = new ActionButton();
    deleteButton.label = "delete";
    deleteButton.data = rowData;
    deleteButton.action = (data => {
      this.deleteUserInfo(rowData);
    });
    let editUserInfo = new ActionButton();
    editUserInfo.label = "Edit User Info";
    editUserInfo.data = rowData;
    editUserInfo.action = (data => {
      this.router.navigate([`admin/admin-user/${data._id}`])
    });
    menu.buttons.push(assignPrivileges, deleteButton, editUserInfo);
    return menu;
  }

  setupExpansionSettings() {
    return new ExpansionSettings(false, (viewContainerRef, rowData, row) => {
      return new Promise<any>((resolve) => {
        const componentResolve =
          this.CFR.resolveComponentFactory(PrivilegeComponent);
        let component = viewContainerRef.createComponent(componentResolve);
        component.instance.roles = this.Roles;
        console.log(this.Roles);

        component.instance.userlRoles = rowData.roles;
        component.instance.assign.subscribe(event => {
          this.userMdbService.assignPrivileges(component.instance.userlRoles, rowData._id)
            .pipe(filter((data: any) => data.success === true))
            .subscribe((data) => {
              this.store.dispatch(new SelectCurrentUserInfo(rowData))
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

  deleteUserInfo(data) {
    console.log(data);
    if (this.currentUser._id == data._id) {
      alert('You are not Allowed to delete YourSelf, Please go to Unregisteration page to do that')
    }
    else {
      if (confirm('Are you sure want to delte this user?')) {
        this.adminFireBService.deleteFBUser(data).subscribe(res => {
          this.generalSettings.DeleteRow({id: data._id, propertyName: "_id" });
          });
      }
    }
  }

  makeAdmin(data) {
    this.userMdbService.setAdmin(data)
      .pipe(filter((data: any) => data.success === true))
      .subscribe();
  }

}