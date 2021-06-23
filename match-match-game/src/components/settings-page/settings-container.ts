import './css/settings.css';
import BaseComponent from '../base-component';
import SettingsBlock from './settings-block';

export default class SettingsContainer extends BaseComponent {
  blockType = new SettingsBlock('type');

  blockDiff = new SettingsBlock('level');

  constructor() {
    super('div', ['settings-page__container', 'none']);

    this.element.appendChild(this.blockType.element);
    this.element.appendChild(this.blockDiff.element);
  }
}
