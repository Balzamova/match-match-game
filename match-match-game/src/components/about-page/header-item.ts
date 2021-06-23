import './css/header.css';
import BaseComponent from '../base-component';

export default class HeaderItem extends BaseComponent {
  private item: BaseComponent;

  constructor(styles: string[], inner: string, type: string) {
    super('ul', ['header__list']);

    this.item = new BaseComponent('li', [...styles]);

    this.item.element.insertAdjacentHTML('afterbegin', `
      <div class='header__link ${type}'>
				<img class='header__link_icon ${type}' />
				${inner}
			</div>
    `);

    this.element.appendChild(this.item.element);
  }
}
