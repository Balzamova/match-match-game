export default class Player {
  name: string;

  surname: string;

  email: string;

  icon: string;

  score: string;

  constructor(name: string, surname: string, email: string, icon: string, score: string) {
    this.name = name;
    this.surname = surname;
    this.email = email;
    this.icon = icon;
    this.score = score;
  }
}
