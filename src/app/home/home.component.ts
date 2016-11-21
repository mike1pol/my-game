import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from 'angular-2-local-storage';

import { AppState } from '../app.service';

@Component({
  selector: 'home',
  styleUrls: ['./home.component.css'],
  templateUrl: './home.component.html'
})
export class HomeComponent {
  users: string[] = [];
  newUser: string = '';

  constructor(
    public appState: AppState,
    public storage: LocalStorageService,
    public router: Router
  ) {
    const users: any = this.storage.get('users');
    this.users = (users && users.users) ? users.users : [];
  }

  startGame() {
    this.router.navigate(['game']);
  }

  remove(event: any, index: number) {
    event.preventDefault();
    this.users.splice(index, 1);
    this.storage.set('users', { users: this.users });
  }

  submitState(value: string) {
    if (this.users.indexOf(value) == -1) {
      this.users.push(value);
    }
    this.storage.set('users', { users: this.users });
    this.newUser = '';
  }
}
