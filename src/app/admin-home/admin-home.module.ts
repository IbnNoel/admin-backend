import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { AdminComponent } from './components/users/admin-users/admin.component';
import { AdminAddLanguageComponent } from './components/languages/admin-languages/admin-add-language.component';
import { AdminUsersComponent } from './components/users/edit-user/admin-users.component';
import { EditWordComponent } from './components/languages/edit-word/edit-word.component';
import { NavpillComponent } from './components/navpill/navpill.component';
import { UserDetailsComponent } from '../shared/components/user-details/user-details.component';
import { AdminHomeComponent } from './admin-home.component';
import { RouterModule } from '@angular/router';
import { AuthGuardService, RoleGaurdService } from '../shared/services/auth-guard.service';
import { AdminAddNewLanguageComponent } from './components/languages/add-language/admin-add-new-language.component';
import { AddWordComponent } from './components/languages/add-word/add-word.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { PrivilegeComponent } from './components/users/privilege/privilege.component';
import { AdminPropertiesComponent } from './components/refdata/admin-properties/admin-properties.component';
import { EditRefDataComponent } from './components/refdata/edit-ref-data/edit-ref-data.component';
import { AddCountryComponent } from './components/refdata/add-country/add-country.component';
import { ViewEditRefDataComponent } from './components/refdata/view-edit-ref-data/view-edit-ref-data.component';
import { NewsComponent } from './components/news/news.component';
import { EditArticleComponent } from './components/news/edit-article/edit-article.component';
import { SeePostInfoComponent } from './components/news/see-post-info/see-post-info.component';
import { CreatePostComponent } from './components/news/create-post/create-post.component';
import { TownsComponent } from './components/towns/towns.component';
import { EditCountryComponent } from './components/towns/edit-country/edit-country.component';
import { AddCountryListComponent } from './components/towns/add-country-list/add-country-list.component';
import { OwnerComponent } from './components/owner/owner.component';
import { PropertiesComponent } from './components/properties/properties.component';
import { ViewPropertyComponent } from './components/properties/view-property/view-property.component';
import {MatRadioModule} from '@angular/material/radio';
import {MatSelectModule} from '@angular/material/select'; 
import { ViewOwnerDetailComponent } from './components/owner/view-owner-detail/view-owner-detail.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { OwnerPropertyComponent } from './components/owner/owener-property/owner-property.component';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';

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
    AddWordComponent,
    PrivilegeComponent,
    AdminPropertiesComponent,
    EditRefDataComponent,
    AddCountryComponent,
    NewsComponent,
    EditArticleComponent,
    SeePostInfoComponent,
    CreatePostComponent,
    TownsComponent,
    EditCountryComponent,
    AddCountryListComponent,
    OwnerComponent,
    PropertiesComponent,
    ViewPropertyComponent,
    OwnerPropertyComponent,
  ],
  imports: [
    SharedModule,
    CommonModule,
    MatSlideToggleModule,
    MatRadioModule,
    MatSelectModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatInputModule,
    MatDatepickerModule,
    RouterModule.forRoot([
      { 
        path: 'admin', 
        component: AdminHomeComponent,
        canActivate: [RoleGaurdService],
        data: {roles: ['Admin']},
        children: [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: 'users'
          },
          { path: 'users', component: AdminComponent},
          { path: 'adminAddnewLanguage', component: AdminAddNewLanguageComponent},
          { path: 'admin-user/:id', component: AdminUsersComponent},
          { path: 'edit-language', component: EditWordComponent},
          { path: 'add-lang', component: AdminAddLanguageComponent},
          { path: 'add-word/:lang', component: AddWordComponent},
          { path: 'refdata', component: AdminPropertiesComponent},
          { path: 'creatCountry', component: AddCountryComponent},
          { path: 'editRefData', component: ViewEditRefDataComponent},
          { path: 'propertyNews', component: NewsComponent},
          { path: 'seePostInfo', component: SeePostInfoComponent },
          { path: 'createPost', component: CreatePostComponent },
          { path: 'towns', component: TownsComponent },
          { path: 'edit-country', component: EditCountryComponent },
          { path: 'add-country-list', component: AddCountryListComponent},
          { path: 'owner', component: OwnerComponent},
          { path: 'properties', component: PropertiesComponent},
          { path: 'editProperty', component: ViewPropertyComponent},
          { path: 'viewDetails-owner/:_id', component: ViewOwnerDetailComponent},
          { path: 'owner-property', component: OwnerPropertyComponent},
        ]
    }
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
    AuthGuardService,
    RoleGaurdService
  ],
  entryComponents: [AdminUsersComponent, EditArticleComponent, AdminAddLanguageComponent]
})
export class AdminHomeModule { }
