import './css/settings.css';
import BaseComponent from '../base-component';
import { cardDifficult, cardType, types } from '../../models/settings-types';

export default class SettingsBlock extends BaseComponent {
  private title = new BaseComponent('div', ['settings-page__title']);

  private selector: BaseComponent;

  private label: BaseComponent;

  private list: BaseComponent;

  private name: BaseComponent;

  private arrow: BaseComponent;

  private animals = new BaseComponent('li', ['settings__item', 'type', 'checked']);

  private birds = new BaseComponent('li', ['settings__item', 'type']);

  private light = new BaseComponent('li', ['settings__item', 'level', 'checked']);

  private medium = new BaseComponent('li', ['settings__item', 'level']);

  private hight = new BaseComponent('li', ['settings__item', 'level']);

  constructor(type: string) {
    super('div', ['settings-block']);
    this.element.classList.add(type);

    this.selector = new BaseComponent('div', ['settings__selector', `${type}`]);
    this.label = new BaseComponent('div', ['settings__label', `${type}`]);
    this.list = new BaseComponent('ul', ['settings__list', 'none', `${type}`]);
    this.name = new BaseComponent('div', ['settings__name', `${type}`]);
    this.arrow = new BaseComponent('div', ['settings__arrow', `${type}`]);

    this.addComponents(type);
  }

  addComponents(type: string): void {
    this.element.prepend(this.title.element);
    this.element.appendChild(this.selector.element);

    this.selector.element.prepend(this.label.element);
    this.selector.element.appendChild(this.list.element);

    this.label.element.prepend(this.name.element);
    this.label.element.appendChild(this.arrow.element);

    this.animals.element.innerText = cardType.animals;
    this.birds.element.innerText = cardType.birds;

    this.light.element.innerText = cardDifficult.light;
    this.medium.element.innerText = cardDifficult.medium;
    this.hight.element.innerText = cardDifficult.hight;

    if (type === types[0].type) {
      this.title.element.innerText = types[0].title;
      this.name.element.innerText = types[0].inner;

      this.list.element.appendChild(this.animals.element);
      this.list.element.appendChild(this.birds.element);
    }

    if (type === types[1].level) {
      this.title.element.innerText = types[1].title;
      this.name.element.innerText = types[1].inner;

      this.list.element.appendChild(this.light.element);
      this.list.element.appendChild(this.medium.element);
      this.list.element.appendChild(this.hight.element);
    }

    this.label.element.addEventListener('click', () => {
      this.openList();
    });

    this.list.element.addEventListener('click', (e) => {
      this.checkItem(e);
    });
  }

  openList(): void {
    this.list.element.classList.toggle('none');
    this.arrow.element.classList.toggle('open');
  }

  checkItem(e: Event): void {
    const domEl = e.target as HTMLElement;
    const domClass: string = domEl.className;
    const str: string = domClass.split(' ').join('.');
    const items = document.querySelectorAll(`.${str}`);

    items.forEach((el) => {
      el.classList.remove('checked');
      domEl.classList.add('checked');
    });
  }

  checkType(): string {
    const array = document.querySelectorAll('.settings__item.type');
    let type = '';

    array.forEach((el) => {
      if (el.className.includes('checked')) {
        type = el.innerHTML.toLowerCase();
        return type;
      }
      return null;
    });
    return type;
  }

  checkLevel(): number {
    const array = document.querySelectorAll('.settings__item.level');
    let level: number;
    let checked = '';

    array.forEach((el) => {
      if (el.className.includes('checked')) {
        checked = el.innerHTML;
      }
    });

    if (checked === '4 * 4') {
      level = 8;
      return level;
    }
    if (checked === '6 * 6') {
      level = 18;
      return level;
    }

    level = 32;
    return level;
  }
}
