import Player from './player';
import BaseComponent from '../base-component';
import ScoreContainer from './score-container';
import ScoreItem from './score-item';

export default class ScoreList extends BaseComponent {
  constructor() {
    super('ul', ['score__list']);
  }

  addWinner(array: Array<Player>): void {
    array.forEach((el: Player) => {
      const user: ScoreItem = new ScoreItem(el.name, el.surname, el.email, el.icon, el.score);

      this.element.appendChild(user.element);
    });

    new ScoreContainer().updateScorePage(this.element);
  }
}
