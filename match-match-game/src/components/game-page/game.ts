import './css/game.css';
import delay from '../../shared/delay';
import BaseComponent from '../base-component';
import Card from './card';
import { CardsField, SHOW_TIME } from './cards-field';

const FLIP_DELAY = 2000;

export default class Game extends BaseComponent {
  private readonly cardsField = new CardsField();

  private clock = new BaseComponent('div', ['game-page__clock']);

  private activeCard?: Card;

  private isAnimation = false;

  private countOfFlipping = 0;

  private coupleCompleted = 0;

  private timer: NodeJS.Timeout | undefined;

  private watch: NodeJS.Timeout | undefined;

  private timeout: NodeJS.Timeout | undefined;

  score = '';

  constructor() {
    super('div', ['game-page__container', 'none']);

    this.element.appendChild(this.cardsField.element);
    this.element.prepend(this.clock.element);
  }

  newGame(images: string[], level: number): void {
    this.cardsField.clear();
    this.startTimer();
    this.startwatch();
    this.coupleCompleted = 0;
    this.countOfFlipping = 0;

    const cards = images
      .concat(images)
      .map((url) => new Card(url))
      .sort(() => Math.random() - 0.5);

    cards.forEach((card) => {
      card.element.addEventListener('click', () => this.cardHandler(card));
    });

    this.cardsField.setCardsWidth(cards, level);
  }

  private async cardHandler(card: Card) {
    if (this.isAnimation) { return; }
    if (!card.isFlipped) { return; }

    this.isAnimation = true;
    this.countOfFlipping++;

    await card.flipToFront();

    if (!this.activeCard) {
      this.activeCard = card;
      this.isAnimation = false;
      return;
    }

    if (this.activeCard.image !== card.image) {
      this.activeCard.showErrorState();
      card.showErrorState();
      await delay(FLIP_DELAY);
      this.activeCard.showErrorState();
      card.showErrorState();
      await Promise.all([this.activeCard.flipToBack(), card.flipToBack()]);
    } else {
      this.coupleCompleted++;
      this.activeCard.showCompleteState();
      card.showCompleteState();
      this.isGameFinished();
    }

    this.activeCard = undefined;
    this.isAnimation = false;
  }

  private startTimer(): void {
    let secStart: number = SHOW_TIME;

    if (this.timer) { clearInterval(this.timer); }

    this.timer = setInterval(() => {
      let sec: string = (secStart--).toString();
      if (secStart < 10) {
        sec = `0${secStart}`;
      }

      if (secStart === 0) {
        if (this.timer) { clearInterval(this.timer); }
        secStart = 30;
        this.startwatch();
      }

      this.clock.element.innerHTML = `00:${sec}`;
    }, 1000);
  }

  private startwatch(): void {
    const fieldLength = this.cardsField.element.children.length;
    let secStart = 0;

    if (this.timeout) { clearTimeout(this.timeout); }
    if (this.watch) { clearInterval(this.watch); }

    this.timeout = setTimeout(() => {
      this.watch = setInterval(() => {
        const secCurrent = ++secStart;
        let min = 0;
        let sec = 0;
        let seconds: string;
        let minutes: string;

        if (secStart < 60) {
          sec = secCurrent;
        } else {
          min++;
          sec = secCurrent % 60;
        }

        if (sec < 10) {
          seconds = `0${sec}`;
        } else {
          seconds = sec.toString();
        }

        if (min < 10) {
          minutes = `0${min}`;
        } else {
          minutes = min.toString();
        }

        this.clock.element.innerHTML = `${minutes}:${seconds}`;

        if (fieldLength / 2 === this.coupleCompleted) {
          if (this.watch) { clearInterval(this.watch); }
        }
      }, 1000);
    }, SHOW_TIME);
  }

  isGameFinished(): void {
    const fieldLength = this.cardsField.element.children.length;

    if (fieldLength / 2 === this.coupleCompleted) {
      this.checkResultScore();
    }
  }

  checkResultScore(): void {
    const resultTime: string = this.clock.element.innerText;
    const fieldLength = this.cardsField.element.children.length;
    const currentScore = (fieldLength - this.countOfFlipping / 2) * 100;
    const timeArray = resultTime.split(':');
    const sec = +timeArray[0] * 60 + +timeArray[1];
    const scoreNum = currentScore - sec * 10;

    if (scoreNum > 0) {
      this.score += scoreNum;
    }

    this.openFinishModal(resultTime);
  }

  openFinishModal(time: string): void {
    const wrapper = new BaseComponent('div', ['wrapper__modal']);
    const modal = new BaseComponent('div', ['modal__finish']);
    const info = new BaseComponent('div', ['modal__finish_info']);
    const btn = new BaseComponent('button', ['modal__finish_btn', 'finish']);

    btn.element.innerText = 'ok';
    info.element.innerText = `Congratulations! You successfully found all matches on ${time} minutes.`;

    document.body.classList.add('lock');
    document.body.appendChild(modal.element);
    document.body.appendChild(wrapper.element);
    modal.element.appendChild(info.element);
    modal.element.appendChild(btn.element);

    const event = new Event('my-event', { bubbles: true });

    btn.element.addEventListener('click', () => {
      btn.element.dispatchEvent(event);
    });
  }

  stopGame(): void {
    this.cardsField.clear();
    if (this.timer) { clearInterval(this.timer); }
    if (this.timeout) { clearTimeout(this.timeout); }
    if (this.watch) { clearInterval(this.watch); }

    this.clock.element.innerHTML = '';
  }
}
