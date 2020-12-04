import { Component, HostBinding} from '@angular/core';
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

  public indicater = false;
  public emptyEmail = false;
  public emptyPassword = false;

  emailSignIn(email, password):void 
  {
    if(email == null || !(email.includes('@') && email.includes('.')) || password == null)
    {
      this.emptyEmail = true;
      this.emptyPassword = true;
    }

    else 
    {
      this.auth.signInWithEmailAndPassword(email, password)
      .then((user) => {
        console.log(user);
      }).catch((error) => {
        console.log(error)
      });
    }
  }
  
  loginGoogle() 
  {
     this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
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

  activateNAC() {
    this.indicater = true;
  }

}
