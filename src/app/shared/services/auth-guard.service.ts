import { Injectable } from '@angular/core';
import { CanActivate, Router, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import { map, share, filter } from 'rxjs/operators';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import * as _ from 'lodash';
import { MessageStatus, MessageType } from 'src/app/components/controls/message/messageStatus';
import { MessageService } from './message.service';
import { AppState } from 'src/app/state/models/app-state-models';
import { Store } from '@ngrx/store';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate{
   user = null;

  constructor(private store: Store<AppState>, private auth : AuthService, private router: Router) {
    this.store.select(store => store.User.user).pipe(filter((data) => !!data))
      .subscribe((user: any) => this.user = user);
  }

  canActivate(route, state: RouterStateSnapshot) {
    return this.store.select(store => store.User.user).pipe(map(user => {
      if (user) { return true; }
      this.router.navigate(['/login'], {queryParams: { returnUrl: state.url }});

      return false;
    }));
  }
}
@Injectable()
export class RoleGaurdService {
  userRoles = [];
  constructor(private store: Store<AppState>){
    this.store.select(store => store.User.user).pipe(filter((data) => !!data))
      .subscribe((user: any)=> this.userRoles = user.roles);
  }

  canActivate(route: ActivatedRouteSnapshot) {
    let roles = route.data.roles as Array<string>;
    return roles.some(roles => this.userRoles.includes(roles));
  }
}
@Injectable()
export class AppHttpInterceptor implements HttpInterceptor {

  constructor(private auth: AuthService, private statusMessageService: MessageService,private  translate: TranslateService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (!!this.auth.getJwtToken()) {
      req = req.clone({
        setHeaders: {
          Authorization: 'Bearer ' + this.auth.getJwtToken()
        }
      });
    }
    let subscription = next.handle(req).pipe(share());
    subscription.subscribe(null, (resp) =>{
      if (resp instanceof HttpErrorResponse){
        if(_.has([500,404,0],resp.status)){
          const transSub = this.translate.get(["unexpectedServerError","errorReferenceCodeExplanation"]).subscribe((trans) => {
            this.statusMessageService.SetMessage(new MessageStatus(MessageType.Error, "", [trans.unexpectedServerError + ":" + resp.status,
             trans.errorReferenceCodeExplanation]));
          });
          transSub.unsubscribe();
        }else{
          this.statusMessageService.ClearMessage();
        }
      }
    });
    return subscription;
  }

}