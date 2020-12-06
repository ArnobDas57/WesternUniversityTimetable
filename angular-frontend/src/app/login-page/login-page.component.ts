import { Component, HostBinding} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { Location } from '@angular/common';
import firebase from 'firebase/app';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent {

  constructor(public auth: AngularFireAuth, private location: Location, private route: ActivatedRoute) { }

  private searchTerms = new Subject<string>();

  // Push a search term into the observable stream.
  search(term: string): void {
    this.searchTerms.next(term);
  }

  public indicater = false;
  public indicater2 = false;
  public emptyEmail = false;
  public emptyPassword = false;
  public invalidEmail = false;
  public correctLogin = false;
  public incorrectLogin = false;
  public correctCreation = false;

  emailSignIn(email: any, password: any)
  {
    if(email == null)
    {
      this.emptyEmail = true;
    }

    else if (password == null)
    {
      this.emptyPassword = true;
    }

    else if (!(email.includes('@') && email.includes('.')))
    {
      this.invalidEmail = true;
    }

    else if (email == null && password == null)
    {
      this.emptyEmail = true;
      this.emptyPassword = true;
    }

    else 
    {
      this.emptyEmail = false;
      this.emptyPassword = false;

      this.auth.signInWithEmailAndPassword(email, password)
      .then((user) => {
        console.log(user);
        this.correctLogin = true;
      }).catch((error) => {
        console.log(error)
        this.incorrectLogin = true;
      });
    }
  }
  
  emailSignUp() 
  {


  }

  UpdatePassword()
  {

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

  activateNewPassword() {
    this.indicater2 = true;
  }

}
