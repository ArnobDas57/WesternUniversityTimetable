import { Component} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { Location } from '@angular/common';
import firebase from 'firebase/app';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent {

  constructor(public auth: AngularFireAuth, private location: Location, private route: ActivatedRoute) { }

  emailSignIn(email, password):void 
  {
    this.auth.signInWithEmailAndPassword(email, password)
    .then((user) => {
      console.log(user);
    }).catch((error) => {
      console.log(error)
    });
  }

  getCurrentUserToken(): void {
    this.auth.currentUser.then((user) => {
      if (user) {
        user.getIdToken(true).then(token => {
          console.log(token);
        });
      }
    });
  }

  goBack(): void {
    this.location.back();
  }
  

}
