import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import * as firebase from 'firebase';
import { auth } from 'firebase/app';
import { Observable, of } from 'rxjs';
import { filter, switchMap, map } from 'rxjs/operators';
import { MessageStatus, MessageType } from 'src/app/components/controls/message/messageStatus';
import { AppState } from 'src/app/state/models/app-state-models';
import { SelectCurrentUserInfo } from 'src/app/state/user-actions';
import { Address } from '../models/address';
import { User } from '../models/user';
import { MessageService } from './message.service';
import { AddressMdbService } from './Mongodb/address-mdb.service';
import { MarriageBanditsUserService } from './Mongodb/marriage-bandits-user.service';
import { UserMdbService } from './Mongodb/user-mdb.service';
import { AddressService } from './address.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user$: Observable<firebase.User>;
  signedUpUser = {} as User;
  signedUpAddress: Address = new Address();
  private JWT_TOKEN = 'JWT_TOKEN';

  constructor(private store: Store<AppState>, private ngZone: NgZone, private statusMessageService: MessageService,
              private route: ActivatedRoute, private afAuth: AngularFireAuth, private router: Router,
              private MGBUser: MarriageBanditsUserService, private addressServices: AddressMdbService) {
    this.user$ = afAuth.authState;
  }

  async signup(value) {
    this.afAuth.auth.createUserWithEmailAndPassword(value.email, value.password)
      .then((result: any) => {
        result.user.updateProfile({
          displayName: value.name
        });
        this.SendVerificationMail();
        localStorage.setItem(this.JWT_TOKEN, result.user._lat);
        this.signedUpUser = value; this.signedUpUser._id = this.signedUpAddress._id = result.user.uid;
        if (this.signedUpUser._id) {
          this.MGBUser.createUser(this.signedUpUser).subscribe((data: any) => {
            localStorage.setItem(this.JWT_TOKEN, data.data.token);
            // this.store.dispatch(new SelectCurrentUserInfo(data.data.user));
            // this.ngZone.run(() => this.router.navigate(['userDetails']))
            this.addressServices.saveAddress(this.signedUpAddress).subscribe(data => data);
            this.statusMessageService.ClearMessage();
          });
        }
        { return auth; }
      })
      .catch(err => {
        let authError = err;
        let errorMessage: string = authError.message;
        this.statusMessageService.SetMessage(new MessageStatus(MessageType.Error, "", errorMessage))
        console.log(err);
      });
  }

  SendVerificationMail() {
    return this.afAuth.auth.currentUser.sendEmailVerification()
      .then(() => {
        this.router.navigate(['email-verification']);
      })
  }

  emailLogin(email: string, password: string) {
    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/';
    localStorage.setItem('returnUrl', returnUrl);

    this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then((value: any) => {
        this.signedUpAddress._id = value.user.uid;
        if (value.user.emailVerified !== true) {
          this.SendVerificationMail();
          window.alert('Please validate your email address. Kindly check your inbox.');
        } else {
          localStorage.setItem(this.JWT_TOKEN, value.user._lat);
          this.MGBUser.getLoggedUser(value.user.uid)
            .subscribe((data: any) => {
              if (!!(data.data.user)) {
                this.store.dispatch(new SelectCurrentUserInfo(data.data.user));
                localStorage.setItem(this.JWT_TOKEN, data.data.token);
                this.statusMessageService.ClearMessage();
                this.router.navigate(['']);
              }
              else {
                this.MGBUser.createUser(value.user).subscribe((data: any) => {
                  this.addressServices.saveAddress(this.signedUpAddress).subscribe(data => data);
                  localStorage.setItem(this.JWT_TOKEN, data.data.token);
                  this.store.dispatch(new SelectCurrentUserInfo(data.data.user));
                  this.ngZone.run(() => this.router.navigate(['userDetails']));
                });
              }
            });
        }
      })
      .catch(err => {
        let authError = err;
        let errorMessage: string = authError.message;
        this.statusMessageService.SetMessage(new MessageStatus(MessageType.Error, "", errorMessage));
      });
  }

  facebookLogin() {
    this.AuthLogin(new auth.FacebookAuthProvider());
  }

  googlelogin() {
    this.AuthLogin(new auth.GoogleAuthProvider());
  }

  async AuthLogin(provider) {
    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/';
    localStorage.setItem('returnUrl', returnUrl);

    this.afAuth.auth.signInWithPopup(provider).then((result: any) => {
      localStorage.setItem(this.JWT_TOKEN, result.user._lat);
      if (result.additionalUserInfo.isNewUser) {
        this.signedUpAddress._id = result.user.uid;
        this.MGBUser.createUser(result.user).pipe(filter((data: any) => data.success === true)).subscribe((data: any) => {
          localStorage.setItem(this.JWT_TOKEN, data.data.token);
          this.store.dispatch(new SelectCurrentUserInfo(data.data.user));
          this.ngZone.run(() => this.router.navigate(['userDetails']));
        });
        this.addressServices.saveAddress(this.signedUpAddress).subscribe(data => console.log(data));
      }
      else {
        this.MGBUser.getLoggedUser(result.user.uid).subscribe((data: any) => {
          this.store.dispatch(new SelectCurrentUserInfo(data.data.user));
        })
        this.ngZone.run(() => this.router.navigate(['']));
      }
    }).catch(error => {
      console.log(error);
      alert(error.message);
    })
  }


  logout() {
    this.afAuth.auth.signOut();
    this.router.navigate(['']);
    localStorage.removeItem(this.JWT_TOKEN);
    this.store.dispatch(new SelectCurrentUserInfo(null));
  }


  forgetPassword(email) {
    this.afAuth.auth.sendPasswordResetEmail(email).then(
      (success) => {
        console.log(success);
      },
      err => {
        console.log(err);
      }
    );
  }

  get appUser$(): Observable<User> {
    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/';
    localStorage.setItem('returnUrl', returnUrl);

    return this.user$
      .pipe(switchMap((user: any) => {
        if (user && user.emailVerified) {
          localStorage.setItem(this.JWT_TOKEN, user._lat);
          return this.MGBUser.getLoggedUser(user.uid);
        }
        return of(null);
      }));
  }

  deleteCurrentUser() {
    this.afAuth.auth.currentUser.delete();
  }

  getJwtToken() {
    return localStorage.getItem(this.JWT_TOKEN);
  }
}
