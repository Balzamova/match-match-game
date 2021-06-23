import './css/cards-field.css';
import BaseComponent from '../base-component';
import Card from './card';

export const SHOW_TIME = 30;

export class CardsField extends BaseComponent {
  private cards: Card[] = [];

  constructor() {
    super('div', ['game__block']);
  }

  clear(): void {
    this.cards = [];
    this.element.innerHTML = '';
  }

  setCardsWidth(cards: Card[], level: number): void {
    const blockWidth = this.element?.offsetWidth;
    const gap = 10;

    const sqrt = Math.sqrt(level * 2);
    const num: number = Math.floor((blockWidth - (sqrt - 1) * gap) / sqrt);

    cards.forEach((el: Card) => {
      el.element.style.width = `${num}px`;
      el.element.style.height = `${num}px`;
    });

    this.addCards(cards);
  }

  addCards(cards: Card[]): void {
    this.cards = cards;
    this.cards.forEach((card) => this.element.appendChild(card.element));
    setTimeout(() => {
      this.cards.forEach((card) => card.flipToBack());
    }, SHOW_TIME * 1000);
  }
}
