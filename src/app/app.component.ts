import { Component } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';
import { AppState } from './state/models/app-state-models';
import { Store } from '@ngrx/store';
import { AuthService } from './shared/services/auth.service';
import { filter } from 'rxjs/operators';
import { SelectCurrentUser } from './state/user-actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private store: Store<AppState>, public auth: AuthService) {

    this.auth.appUser$.pipe(filter((data) => !!data))
    .subscribe((user) =>{
          console.log(user);
          this.store.dispatch(new SelectCurrentUser(user))
    });
  }

}
