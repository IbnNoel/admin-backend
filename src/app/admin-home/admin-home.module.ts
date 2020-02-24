import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { AdminComponent } from './components/admin/admin.component';
import { AdminAddLanguageComponent } from './components/admin-add-language/admin-add-language.component';
import { AdminUsersComponent } from './components/admin-users/admin-users.component';
import { EditWordComponent } from './components/edit-word/edit-word.component';
import { NavpillComponent } from './components/navpill/navpill.component';
import { UserDetailsComponent } from './components/user-details/user-details.component';
import { AdminAuthGuardService } from './services/admin-auth-guard.service';
import { AdminDataService } from './services/admin-data.service';
import { AdminHomeComponent } from './admin-home.component';
import { RouterModule } from '@angular/router';
import { AuthGuardService } from '../shared/services/auth-guard.service';
import { AdminAddNewLanguageComponent } from './components/admin-add-new-language/admin-add-new-language.component';
import { AddWordComponent } from './components/add-word/add-word.component';

@NgModule({
  declarations: [
    AdminComponent,
    AdminAddLanguageComponent,
    AdminUsersComponent,
    EditWordComponent,
    NavpillComponent,
    UserDetailsComponent,
    AdminHomeComponent,
    AdminAddNewLanguageComponent,
    AddWordComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forRoot([
      { 
        path: 'admin', 
        component:AdminHomeComponent,
        children: [
        { path: 'admin', component: AdminComponent}, // only admins can access
        { path: 'admin-user', component: AdminUsersComponent}, // only admins can access
        { path: 'adminAddnewLanguage', component: AdminAddNewLanguageComponent}, // only admins can access
        // { path: 'admin-user/:id', component: AdminUsersComponent}, // only admins can access
        { path:'edit-language', component: EditWordComponent},
        { path:'add-lang', component: AdminAddLanguageComponent},
        { path:'add-word', component: AddWordComponent},
        ]
    }
        // { path: 'admin', component: AdminComponent}, // only admins can access
        // { path: 'admin-user', component: AdminUsersComponent}, // only admins can access
        // { path:'edit-language', component: EditWordComponent},
        // { path:'add-lang', component: AdminAddLanguageComponent},
        // { path : 'userDetails', component: UserDetailsComponent, canActivate: [AuthGuardService] }, // should be loged in
    ])
  ],
  exports: [
    AdminComponent,
    AdminAddLanguageComponent,
    AdminUsersComponent,
    EditWordComponent,
    NavpillComponent,
    UserDetailsComponent
  ],
  providers: [
    AdminAuthGuardService,
    AdminDataService,
    AuthGuardService
  ],
  entryComponents: [AdminUsersComponent, AdminAddLanguageComponent]
})
export class AdminHomeModule { }
