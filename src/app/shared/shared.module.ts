import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from 'src/lib/http-loader';
import { DataTableModule } from '../modules/dataTables.module';
import { BsNavbarComponent } from './components/bs-navbar/bs-navbar.component';
import { ForgetPasswordComponent } from './components/forget-password/forget-password.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { NoAccessComponent } from './components/no-access/no-access.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { UserDetailsComponent } from './components/user-details/user-details.component';
import { UserSettingsComponent } from './components/user-settings/user-settings.component';
import { AuthGuardService } from './services/auth-guard.service';
import { AuthService } from './services/auth.service';
import { UserMdbService } from './services/Mongodb/user-mdb.service';
import { UserService } from './services/user.service';
import { UnregisterationComponent } from './components/unregisteration/unregisteration.component';
import {MatButtonModule} from '@angular/material/button';
import { ApixuService } from './components/services/apixu.service';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { ActionMenuComponent } from '../components/controls/action-menu/action-menu.component';
import {MatSelectModule} from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule} from '@angular/material/input';
import { MatStepperModule } from '@angular/material/stepper';
import { MatChipsModule } from '@angular/material/chips';
import {MatAutocompleteModule} from '@angular/material/autocomplete';

import { EmailVerificationComponent } from './components/email-verification/email-verification.component';
import { ShortNumberPipe } from './pipes/short-number.pipe';
import { SearchPropertiesForSaleComponent } from '../moopla/components/search-properties-for-sale/search-properties-for-sale.component';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    HomeComponent,
    LoginComponent,
    BsNavbarComponent,    
    RegistrationComponent,
    NoAccessComponent,
    NotFoundComponent,
    UserSettingsComponent,
    ForgetPasswordComponent,
    UnregisterationComponent,
    EmailVerificationComponent,
    ShortNumberPipe
],
  imports: [
    MatButtonModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatMenuModule,
    MatIconModule,
    MatMenuModule,
    MatChipsModule,
    MatAutocompleteModule,
    CommonModule,
    BrowserModule,
    FormsModule,
    DataTableModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatStepperModule,
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
      }
    }),
    RouterModule.forChild([
      { path: 'login', component: LoginComponent},
      { path: 'signup', component: RegistrationComponent},
      { path: 'email-verification', component: EmailVerificationComponent},
      { path : 'forgetPassword', component: ForgetPasswordComponent },
      { path: 'no-access', component: NoAccessComponent},
      { path : 'userDetails', component: UserDetailsComponent, canActivate: [AuthGuardService] },
      { path : 'userSetting', component: UserSettingsComponent, canActivate: [AuthGuardService] },
      { path : 'unRegister', component: UnregisterationComponent, canActivate: [AuthGuardService] },
      { path : 'searchForSale', component: SearchPropertiesForSaleComponent},
 
    ]),
  ],
  exports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HomeComponent,
    MatFormFieldModule,
    MatInputModule,
    MatMenuModule,
    MatChipsModule,
    MatAutocompleteModule,
    DataTableModule,
    LoginComponent,
    BsNavbarComponent,    
    RegistrationComponent,
    NoAccessComponent,
    NotFoundComponent,
    TranslateModule,
    RouterModule,
    ShortNumberPipe,
    MatStepperModule
  ],
  providers: [
    AuthService,
    UserService,
    AuthGuardService,
    UserMdbService,
    ApixuService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  entryComponents: [ ActionMenuComponent]
})
export class SharedModule { }

