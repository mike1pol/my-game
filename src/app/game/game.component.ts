import { Component } from '@angular/core';
import { LocalStorageService } from 'angular-2-local-storage';
import { AppState } from '../app.service';

interface user {
  name: string;
  money: number;
}

enum themeQuestionsState {
  ready,
  show,
  answer,
  close
}

interface themeQuestions {
  price: number;
  question: string;
  answer: string;
  state: themeQuestionsState
}

interface theme {
  name: string;
  questions: themeQuestions[];
};

@Component({
  selector: 'game',
  styleUrls: ['./game.component.css'],
  templateUrl: './game.component.html'
})

export class GameComponent {
  public users: user[] = [];
  public prices: number[] = [
    100,
    200,
    300,
    400,
    500,
    600,
    700,
    800,
    900,
    1000,
    1000000
  ];

  public currentQuestion: themeQuestions = null;
  public currentUser: user = null;

  public themes: theme[] = [];

  constructor(
    public appState: AppState,
    public storage: LocalStorageService
  ) {
    for (let i = 0; i < 5; i++) {
      const theme: theme = {
        name: `Test ${i}`,
        questions: []
      }
      for (let q = 0; q < 12; q++) {
        let price = 100 * q;
        if (q == 11) {
          price = 1000000;
        }
        theme.questions.push({
          price,
          question: `Question ${q}`,
          answer: `Answer ${q}`,
          state: themeQuestionsState.ready
        })
      }
      this.themes.push(theme);
    }
    let users: any = this.storage.get('users');
    if (users && users.users) {
      users.users.forEach(v => {
        this.users.push({
          name: v,
          money: 0
        });
      });
    }
    this.currentUser = this.users[0];
  }

  closeQuestion(currentQuestion: themeQuestions, state: boolean) {
    currentQuestion.state = themeQuestionsState.close;
    if (state) {
      this.currentUser.money += currentQuestion.price;
    } else {
      let gi = 0;
      this.users.forEach((v, i) => {
        if (v.name == this.currentUser.name) {
          gi = i;
        }
      });
      if ((gi + 1) > this.users.length - 1) {
        this.currentUser = this.users[0];
      } else {
        this.currentUser = this.users[gi + 1];
      }
    }
    this.currentQuestion = null;
  }

  openQuestion(theme: theme, price: number) {
    if (!this.currentUser) {
      return;
    }
    let data = theme.questions.find(v => (v.price == price));
    if (data && data.state == themeQuestionsState.ready) {
      data.state = themeQuestionsState.show;
      this.currentQuestion = data;
    }
  }

  questionForPrice(theme: theme, price: number): string {
    let data = theme.questions.find(v => (v.price == price));
    if (data && data.state == themeQuestionsState.ready) {
      return data.price.toString();
    }
    return '';
  }
}
