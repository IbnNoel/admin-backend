import { Component, Inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AppState } from './state/models/app-state-models';
import { Store } from '@ngrx/store';
import { AuthService } from './shared/services/auth.service';
import { filter, map } from 'rxjs/operators';
import { SelectCurrentUserInfo } from './state/user-actions';
import { DOCUMENT } from '@angular/common';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  evironmentName = `${environment.evironmentName}`;
  file = 'ar';
  isRightToLeft$ = new Observable<boolean>();
  constructor(private store: Store<AppState>, public auth: AuthService, router: Router) {
    this.auth.appUser$.pipe(filter(data => !!data))
    .subscribe((data: any) => {
          this.store.dispatch(new SelectCurrentUserInfo(data.data.user));
          const returnUrl = localStorage.getItem('returnUrl');
          if (returnUrl) {
          localStorage.removeItem('returnUrl');
          router.navigateByUrl(returnUrl);
        }
    });

    this.isRightToLeft$ = this.store.select(store => store.pageLanguage.selectedLang).pipe(map(data => data == 'ar'))
  }
}
