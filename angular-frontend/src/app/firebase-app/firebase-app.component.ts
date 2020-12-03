import { Component} from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';

@Component({
  selector: 'app-firebase-app',
  templateUrl: './firebase-app.component.html',
  styleUrls: ['./firebase-app.component.css']
}) 
export class FirebaseAppComponent {

  constructor(public auth: AngularFireAuth) { }

  login() {
    this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }
  logout() {
    this.auth.signOut();
  }

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
