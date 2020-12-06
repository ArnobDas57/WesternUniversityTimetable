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
  public emptyEmail2 = false;
  public emptyPassword = false;
  public emptyPassword2 = false;
  public invalidnewPassword = false;
  public passwordUpdated = false;
  public invalidEmail = false;
  public invalidEmail2 = false;
  public invalidUsername = false;
  public correctLogin = false;
  public incorrectLogin = false;
  public correctCreation = false;
  public incorrectCreation = false;

  public errormessage1: string;
  public errormessage2: string;

  emailSignIn(email: string, password: string)
  {
    if(email == null)
    {
      this.invalidEmail = false;
      this.emptyEmail = true;
      this.emptyPassword = false;
    }

    else if (email != null && password == null)
    {
      this.invalidEmail = false;
      this.emptyEmail = false;
      this.emptyPassword = true;
    }

    else if (!(email.includes('@') && email.includes('.')))
    {
      this.invalidEmail = true;
      this.emptyEmail = false;
      this.emptyPassword = false;
    }

    else if (email == null && password == null)
    {
      this.invalidEmail = false;
      this.emptyEmail = true;
      this.emptyPassword = true;
    }

    else 
    {
      this.invalidEmail = false;
      this.emptyEmail = false;
      this.emptyPassword = false;

      this.auth.signInWithEmailAndPassword(email, password)
      .then((user) => {
        console.log(user);
        this.incorrectLogin = false;
        this.correctLogin = true;
      }).catch((error) => {
        console.log(error);
        console.log(error.code);
        console.log(error.message);
        this.errormessage1 = error.message;
        this.incorrectLogin = true;
        this.correctLogin = false;
      });
    }
  }
  
  emailSignUp(username: string, email: string, password: string) 
  {
    if(username == null)
    {
      this.invalidUsername = true;
      this.invalidEmail2 = false;
      this.emptyEmail2 = false;
      this.emptyPassword2 = false;
    }

    if(username != null && email == null)
    {
      this.invalidUsername = false;
      this.invalidEmail2 = false;
      this.emptyEmail2 = true;
      this.emptyPassword2 = false;
    }

    else if (username != null && email != null && password == null)
    {
      this.invalidUsername = false;
      this.invalidEmail2 = false;
      this.emptyEmail2 = false;
      this.emptyPassword2 = true;
    }

    else if (!(email.includes('@') && email.includes('.')))
    {
      this.invalidUsername = false;
      this.invalidEmail2 = true;
      this.emptyEmail2 = false;
      this.emptyPassword2 = false;
    }

    else if (username == null && email == null && password == null)
    {
      this.invalidUsername = true;
      this.invalidEmail2 = false;
      this.emptyEmail2 = true;
      this.emptyPassword2 = true;
    }

    else 
    {
      this.invalidUsername = false;
      this.invalidEmail2 = false;
      this.emptyEmail2 = false;
      this.emptyPassword2 = false;

      this.auth.createUserWithEmailAndPassword(email, password)
      .then((user) => {
        console.log(user);
        this.correctCreation = true;
        this.incorrectCreation = false;
      }).catch((error) => {
        console.log(error);
        console.log(error.code);
        console.log(error.message);
        this.errormessage2 = error.message;
        this.incorrectCreation = true;
      });
    }
  }

  UpdatePassword(newpass: string)
  {
    if(newpass == null)
    {
      this.invalidnewPassword = true;
      this.passwordUpdated = false;
    }

    else 
    { 
      this.auth.currentUser.then((user) => {
        if(user){
          user.updatePassword(newpass);
        } 
      });
      this.invalidnewPassword = false;
      this.passwordUpdated = true;
    }
  }

  loginGoogle() 
  {
     this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
     .then(() => console.log('successful authentication'))
     .catch(error => console.log(error));
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
