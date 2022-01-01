import { Injectable, Injector } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { defer, from, iif } from 'rxjs';
import { concatMap, mergeMap, take } from 'rxjs/operators';
import { Observable } from 'rxjs/internal/Observable';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService {

  afAuth: AngularFireAuth

  constructor(private inj: Injector) {   
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.afAuth = this.inj.get(AngularFireAuth) // inject the authservice manually (see https://github.com/angular/angular/issues/18224)
    return this.afAuth.authState
    .pipe(
      take(1),
      mergeMap(auth => iif(() => !!auth,
        defer(() => from(auth.getIdToken()))
          .pipe(concatMap(token => next.handle(request.clone({
            setHeaders: {
              Authorization: `Bearer ${token}`
            }
          })))),
        defer(() => next.handle(request)),
      ))
    );     
  }
}