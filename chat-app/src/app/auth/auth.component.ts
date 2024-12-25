import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html'
  
})
export class AuthComponent {
  authForm: FormGroup;

  constructor(private fb: FormBuilder, private afAuth: AngularFireAuth) {
    this.authForm = this.fb.group({
      email: [''],
      password: ['']
    });
  }

  async login() {
    const { email, password } = this.authForm.value;
    await this.afAuth.signInWithEmailAndPassword(email, password);
  }

  async register() {
    const { email, password } = this.authForm.value;
    await this.afAuth.createUserWithEmailAndPassword(email, password);
  }
}
