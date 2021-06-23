import './css/about.css';
import BaseComponent from '../base-component';
import AboutBlock from './about-block';

export default class AboutContainer extends BaseComponent {
  private list = new BaseComponent('ul', ['about-page__list']);

  private registerTitle = 'Register new player in game';

  private settingsTitle = 'Configure your game settings';

  private gameTitle = 'Start you new game! Remember card positions and match it before times up.';

  private register = new AboutBlock('1', this.registerTitle, 'register');

  private settings = new AboutBlock('2', this.settingsTitle, 'settings');

  private game = new AboutBlock('3', this.gameTitle, 'view');

  constructor() {
    super('div', ['about-page__container', 'none']);

    this.element.appendChild(this.list.element);
    this.list.element.appendChild(this.register.element);
    this.list.element.appendChild(this.settings.element);
    this.list.element.appendChild(this.game.element);
  }
}
