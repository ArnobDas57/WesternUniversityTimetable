import { Component} from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent {

  constructor(public auth: AngularFireAuth) { }

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
  

}
