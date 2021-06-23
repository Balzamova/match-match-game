import BaseComponent from '../base-component';

export default class AboutBlock extends BaseComponent {
  private item: string;

  constructor(n: string, info: string, type: string) {
    super('li', ['about-page__item']);

    this.item = `
          <div class="about-page__item-first">
            <div class="about-page__item-number"> ${n} </div>
            <div class="about-page__item-info"> ${info} </div>
          </div>
            <div class="about-page__item-second ${type}">
              <img src="./${type}-image.png" alt="${type}" class="about-page__item-img ${type}">
            </div>
    `;

    this.element.insertAdjacentHTML('beforeend', this.item);
  }
}
