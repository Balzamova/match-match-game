import BaseComponent from '../base-component';
import './css/card.css';
import imageCasing from '../../assets/casing.png';

const FLIP_CLASS = 'flipped';

export default class Card extends BaseComponent {
  cardState = new BaseComponent('div', ['game__card-state']);

  isFlipped = false;

  constructor(readonly image: string) {
    super('div', ['game__card-container']);

    this.element.innerHTML = `
      <div class='game__card'>
        <img class='game__card_img back' src='${imageCasing}'/>
        <img class='game__card_img front' src='${image}'/>
      </div>
    `;

    this.element.appendChild(this.cardState.element);
  }

  flipToBack(): Promise<void> {
    this.isFlipped = true;
    return this.flip(true);
  }

  flipToFront(): Promise<void> {
    this.isFlipped = false;
    return this.flip();
  }

  private flip(isFront = false): Promise<void> {
    return new Promise((resolve) => {
      this.element.classList.toggle(FLIP_CLASS, isFront);
      this.element.addEventListener('transitionend', () => resolve(), {
        once: true,
      });
    });
  }

  showErrorState(): void {
    this.cardState.element.classList.toggle('error');
  }

  showCompleteState(): void {
    this.cardState.element.classList.add('complete');
  }
}
