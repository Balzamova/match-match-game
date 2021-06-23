import './css/score.css';
import BaseComponent from '../base-component';

export default class ScoreContainer extends BaseComponent {
  constructor() {
    super('div', ['score-page__container']);

    this.element.insertAdjacentHTML('afterbegin', `
      <div class='score-page__title'> Best players </div>
    `);
  }

  updateScorePage(list: Element): void {
    const page = document.querySelector('.score-page__container') as HTMLDivElement;
    const scoreList = document.querySelector('.score__list') as HTMLDivElement;

    if (!scoreList) {
      page.appendChild(list);
    } else {
      page.removeChild(scoreList);
      page.appendChild(list);
    }
  }
}
