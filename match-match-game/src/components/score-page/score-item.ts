import BaseComponent from '../base-component';
import userIcon from '../../assets/icons/avatar-user.svg';

export default class ScoreItem extends BaseComponent {
  constructor(name: string, surname: string, email: string, src: string, score: string) {
    super('li', ['score__item']);

    this.addElement(name, surname, email, src, score);
  }

  addElement(name: string, surname: string, email: string, src: string, score: string): void {
    if (!src) {
      src = userIcon;
    }

    const item = `
      <div class='score__item-first'>
        <img class='score__item-img' src='${src}' alt='photo'>
        <div class='score__item-info'>
          <div class='score__item-name'> ${name} ${surname} </div>
          <div class='score__item-email'> ${email} </div>
        </div>
      </div>
      <div class='score__item-second'>
        <div class='score__item-title'> Score: </div>
        <div class='score__item-score'> ${score} </div>
      </div>
    `;

    this.element.insertAdjacentHTML('beforeend', item);
  }
}
