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
import { AdminPropertiesComponent } from './components/properties/admin-properties/admin-properties.component';
import { EditRefDataComponent } from './components/properties/edit-ref-data/edit-ref-data.component';
import { AddCountryComponent } from './components/properties/add-country/add-country.component';
import { ViewEditRefDataComponent } from './components/properties/view-edit-ref-data/view-edit-ref-data.component';
import { NewsComponent } from './components/news/news.component';
import { EditArticleComponent } from './components/news/edit-article/edit-article.component';
import { SeePostInfoComponent } from './components/news/see-post-info/see-post-info.component';
import { CreatePostComponent } from './news/create-post/create-post.component';

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
    CreatePostComponent
  ],
  imports: [
    SharedModule,
    CommonModule,
    MatSlideToggleModule,
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
          { path: 'properties', component: AdminPropertiesComponent},
          { path: 'creatCountry', component: AddCountryComponent},
          { path: 'editRefData', component: ViewEditRefDataComponent},
          { path: 'propertyNews', component: NewsComponent},
          { path: 'seePostInfo', component: SeePostInfoComponent },
          { path: 'createPost', component: CreatePostComponent },
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
