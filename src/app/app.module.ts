import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import {MatRadioModule} from '@angular/material/radio';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EffectsModule } from '@ngrx/effects';
import { routerReducer, StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { LanguageEffects } from 'src/app/state/language.effects';
import { environment } from 'src/environments/environment.prod';
import { TranslateHttpLoader } from 'src/lib/http-loader';
import { AdminHomeModule } from './admin-home/admin-home.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ActionMenuComponent } from './components/controls/action-menu/action-menu.component';
import { ConfirmationBoxComponent } from './components/controls/confirmation-box/confirmation-box.component';
import { GpfiModalComponent } from './components/controls/gpfi-modal/gpfi-modal.component';
import { MessageComponent } from './components/controls/message/message.component';
import { OperationButtonsComponent } from './components/controls/operation-buttons/operation-buttons.component';
import { OverlayComponent } from './components/controls/overlay/overlay.component';
import { LoaderComponent } from './components/helpers/loader/loader.component';
import { LanguageReducer, SelelectLanguageReducer, UserReducer, SelelectPageLanguageReducer } from './reducers/language.reducers';
import { ErrorIntercept } from './shared/services/error.interceptor';
import { LoaderInterceptor, LoaderService } from './shared/services/loader.service';
import { MessageService } from './shared/services/message.service';
import { SharedModule } from './shared/shared.module';
import { AppHttpInterceptor } from './shared/services/auth-guard.service';
import { testPrivilegeModule } from './test-privilege/test.module';
import { MooplaModule } from './moopla/moopla.module';
import { AppDropdownComponent } from './components/controls/dropdown/app.dropdown.component';
import { ViewEditRefDataComponent } from './admin-home/components/refdata/view-edit-ref-data/view-edit-ref-data.component';
import { ChipsComponent } from './components/controls/chips/chips.component';
import { PriceListReducer } from './reducers/price-list-form.reducers';
import { MatFormFieldModule } from '@angular/material/form-field'; 


// import { MatOptionModule } from '@angular/material/core/option';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent,
    LoaderComponent,
    MessageComponent,
    GpfiModalComponent,
    ActionMenuComponent,
    AppDropdownComponent,
    OverlayComponent,
    ConfirmationBoxComponent,
    OperationButtonsComponent,
    ViewEditRefDataComponent,
    ChipsComponent,
  ],
  imports: [
    SharedModule,
    MooplaModule,
    AdminHomeModule,
    MooplaModule,
    testPrivilegeModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AngularFirestoreModule,
    BrowserAnimationsModule,
    MatMenuModule,
    MatIconModule,
    MatRadioModule,
    MatFormFieldModule,
    // MatOptionModule,
    ReactiveFormsModule,
    StoreModule.forRoot({
      selectLang: SelelectLanguageReducer,
      pageLanguage: SelelectPageLanguageReducer,
      language: LanguageReducer,
      routerReducer,
      User: UserReducer,
      priceList: PriceListReducer
    }),
    StoreRouterConnectingModule.forRoot(),
    EffectsModule.forRoot([LanguageEffects]),
    StoreRouterConnectingModule,

    HttpClientModule,
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: environment.production
    }),
    MatProgressSpinnerModule,
    MatDialogModule
  ],
  providers:
    [
      MessageService, ErrorIntercept,
      {
        provide: HTTP_INTERCEPTORS,
        useClass: ErrorIntercept,
        multi: true
      },
      LoaderService, LoaderInterceptor,
      {
        provide: HTTP_INTERCEPTORS,
        useClass: LoaderInterceptor,
        multi: true
      },
      {
        provide: HTTP_INTERCEPTORS,
        useClass: AppHttpInterceptor,
        multi: true
      }
    ],
  bootstrap: [AppComponent],
  entryComponents: [ActionMenuComponent]
})

export class AppModule { }
