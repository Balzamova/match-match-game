import './style.css';
import Game from './components/game-page/game';
import SettingsContainer from './components/settings-page/settings-container';
import SettingsBlock from './components/settings-page/settings-block';
import { ImageCategory } from './models/image-category';
import AboutContainer from './components/about-page/about-container';
import ScoreContainer from './components/score-page/score-container';
import BaseComponent from './components/base-component';
import HeaderItem from './components/about-page/header-item';
import RegistrationField from './components/registration-page/registration-field';
import DataBase from './database';
import icon from './assets/icons/avatar-user.svg';

export default class App {
  private readonly baseWrapper = new BaseComponent('div', ['wrapper']);

  private header = new BaseComponent('header', ['header']);

  private main = new BaseComponent('main', ['main']);

  private footer = new BaseComponent('footer', ['footer']);

  private readonly headerWrapper = new BaseComponent('div', ['header__wrapper']);

  private readonly headerHiding = new BaseComponent('h1', ['header__heading']);

  private readonly headerContent = new BaseComponent('div', ['header__content']);

  private readonly headerMenu = new BaseComponent('ul', ['header__list']);

  private readonly headerButtons = new BaseComponent('div', ['buttons__list']);

  private readonly headerItemAbout = new HeaderItem(['header__item', 'about', 'active'], 'About Game', 'about');

  private readonly headerItemScore = new HeaderItem(['header__item', 'score'], 'Best Score', 'score');

  private readonly headerItemSettings = new HeaderItem(['header__item', 'settings'], 'Game Settings', 'settings');

  private registryBtn = new BaseComponent('button', ['header__button', 'register']);

  private startBtn = new BaseComponent('button', ['header__button', 'start', 'none']);

  private stopBtn = new BaseComponent('button', ['header__button', 'stop', 'none']);

  private headerUserIcon = new BaseComponent('img', ['header__icon', 'none']);

  private readonly gamePage = new Game();

  private readonly aboutPage = new AboutContainer();

  private scorePage = new ScoreContainer();

  private readonly settingsPage = new SettingsContainer();

  private readonly settings = new SettingsBlock('type');

  private readonly registrationPage = new RegistrationField();

  private newUser: string[] = [];

  constructor(private readonly rootElement: Element) {
    this.rootElement.appendChild(this.baseWrapper.element);

    this.addHeaderBlock();
    this.addMainBlock();
    this.addFooterBlock();
    this.clickRegistryBtn();
    this.activateHeaderItem();
    this.listenFinish();
  }

  addHeaderBlock(): void {
    this.registryBtn.element.innerText = 'Register new player';
    this.startBtn.element.innerText = 'Start Game';
    this.stopBtn.element.innerText = 'Stop Game';
    this.headerHiding.element.innerText = 'Match-Match Game';
    this.headerContent.element.insertAdjacentHTML('afterbegin', `
      <div class='logo'>
        <div class='logo__item'>Match</div>
        <div class='logo__item logo-white'>Match</div>
      </div>
    `);

    this.baseWrapper.element.appendChild(this.header.element);
    this.header.element.appendChild(this.headerWrapper.element);
    this.headerWrapper.element.appendChild(this.headerHiding.element);
    this.headerWrapper.element.appendChild(this.headerContent.element);
    this.headerContent.element.appendChild(this.headerMenu.element);
    this.headerContent.element.appendChild(this.headerButtons.element);
    this.headerMenu.element.appendChild(this.headerItemAbout.element);
    this.headerMenu.element.appendChild(this.headerItemScore.element);
    this.headerMenu.element.appendChild(this.headerItemSettings.element);
    this.headerButtons.element.appendChild(this.registryBtn.element);
    this.headerButtons.element.appendChild(this.startBtn.element);
    this.headerButtons.element.appendChild(this.stopBtn.element);
    this.headerButtons.element.appendChild(this.headerUserIcon.element);
  }

  addMainBlock(): void {
    this.baseWrapper.element.appendChild(this.main.element);
    this.main.element.appendChild(this.gamePage.element);
    this.main.element.appendChild(this.aboutPage.element);
    this.main.element.appendChild(this.scorePage.element);
    this.main.element.appendChild(this.settingsPage.element);
    this.main.element.appendChild(this.registrationPage.element);
  }

  addFooterBlock(): void {
    const footer = `
      <div class='footer__wrapper'>
        <div class='footer__content'>
          <nav class='footer__nav'>
            <ul class='footer__list'>
              <li class='footer__item'>
                <a class='footer__link' href='https://docs.rs.school/' target='blank'>© Rolling Scopes School
                </a>
              </li>
              <li class='footer__item'>
                <a class='footer__link' href='https://github.com/Balzamova' target='blank'>
                  © Anastasiia Balzamova
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    `;

    this.footer.element.innerHTML = footer;
    this.baseWrapper.element.appendChild(this.footer.element);
  }

  openPageAbout(): void {
    this.closeAllPages();
    this.aboutPage.element.classList.remove('none');
  }

  openPageScore(): void {
    this.closeAllPages();
    this.scorePage.element.classList.remove('none');
  }

  openPageSettings(): void {
    this.closeAllPages();
    this.settingsPage.element.classList.remove('none');
  }

  closeAllPages(): void {
    this.gamePage.element.classList.add('none');
    this.aboutPage.element.classList.add('none');
    this.scorePage.element.classList.add('none');
    this.settingsPage.element.classList.add('none');
    this.registrationPage.element.classList.add('none');
    this.registrationPage.clearInputs();
  }

  removeActiveItemState(): void {
    const headerItems = document.querySelectorAll('.header__item');
    for (let i = 0; i < headerItems.length; i++) {
      headerItems?.forEach((item) => {
        item?.classList.remove('active');
      });
    }
  }

  activateHeaderItem(): void {
    const headerItems = document.querySelectorAll('.header__item');

    headerItems?.forEach((item) => {
      item?.addEventListener('click', (e) => {
        this.removeActiveItemState();
        this.closeAllPages();
        this.gamePage.stopGame();

        const target = e.target as HTMLElement;

        if (target.classList.contains('about')) {
          item.classList.add('active');
          this.openPageAbout();
        } else if (target.classList.contains('score')) {
          item.classList.add('active');
          this.openPageScore();
        } else if (target.classList.contains('settings')) {
          item.classList.add('active');
          this.openPageSettings();
        }
      });
    });
  }

  clickRegistryBtn(): void {
    this.registryBtn.element.addEventListener('click', () => {
      this.closeAllPages();
      this.removeActiveItemState();
      this.registrationPage.element.classList.remove('none');

      this.closeRegistryForm();
      this.submitRegistryForm();
    });
  }

  submitRegistryForm():void {
    const submit = document.querySelector('.modal__register_btn.submit');
    const headerItem = document.querySelector('.header__item.about');

    submit?.addEventListener('click', (event: Event) => {
      const nameField = document.querySelector('#name') as HTMLInputElement;
      const surnameField = document.querySelector('#surname') as HTMLInputElement;
      const emailField = document.querySelector('#email') as HTMLInputElement;
      const avatar = document.querySelector('#loaded__img') as HTMLImageElement;

      let url = '';

      if (avatar) {
        url = avatar.src;
      } else {
        url = icon;
      }

      event.preventDefault();

      if (submit?.classList.contains('active')) {
        this.newUser = [nameField.value, surnameField.value, emailField.value, url];

        this.removeActiveItemState();
        this.openPageAbout();
        this.headerUserIcon.element.style.backgroundImage = `url(${url})`;

        headerItem?.classList.add('active');
        this.registryBtn.element.classList.add('none');
        this.startBtn.element.classList.remove('none');
        this.headerUserIcon.element.classList.remove('none');
        this.registrationPage.clearInputs();
        this.clickStartGameBtn();
      }
    });
  }

  closeRegistryForm(): void {
    const cancel = document.querySelector('.modal__register_btn.cancel');
    const headerItem = document.querySelector('.header__item.about');

    cancel?.addEventListener('click', () => {
      this.removeActiveItemState();
      this.openPageAbout();
      headerItem?.classList.add('active');
    });
  }

  clickStartGameBtn(): void {
    this.startBtn.element.addEventListener('click', () => {
      this.closeAllPages();
      this.removeActiveItemState();
      this.gamePage.element.classList.remove('none');

      this.startBtn.element.classList.add('none');
      this.stopBtn.element.classList.remove('none');

      this.getTypeLevel();
    });
  }

  clickStopGameBtn(): void {
    this.stopBtn.element.addEventListener('click', () => {
      const headerItem = document.querySelector('.header__item.about');

      this.stopBtn.element.classList.add('none');
      this.headerUserIcon.element.classList.add('none');
      this.registryBtn.element.classList.remove('none');

      this.gamePage.stopGame();
      this.clickRegistryBtn();

      this.removeActiveItemState();
      this.openPageAbout();
      headerItem?.classList.add('active');
    });
  }

  listenFinish(): void {
    document.addEventListener('my-event', () => {
      this.closeFinishModal();
      this.removeActiveItemState();
      this.openPageScore();
      this.checkScoreResults();

      const headerItem = document.querySelector('.header__item.score') as HTMLElement;
      headerItem.classList.add('active');
    }, false);
  }

  closeFinishModal(): void {
    const modalWindow = document.querySelector('.modal__finish') as HTMLDivElement;
    const modalWrapper = document.querySelector('.wrapper__modal') as HTMLDivElement;
    const stopBtn = document.querySelector('.header__button.stop') as HTMLDivElement;
    const headerUserIcon = document.querySelector('.header__icon') as HTMLDivElement;
    const registryBtn = document.querySelector('.header__button.register') as HTMLDivElement;

    if (modalWindow && modalWrapper) {
      modalWindow.parentNode?.removeChild(modalWindow);
      modalWrapper.parentNode?.removeChild(modalWrapper);
      document.body.classList.remove('lock');
    }

    headerUserIcon.style.backgroundImage = `url(${icon})`;
    stopBtn.classList.add('none');
    headerUserIcon.classList.add('none');
    registryBtn.classList.remove('none');
  }

  checkScoreResults(): void {
    const gameResult: string[] = this.newUser.concat(this.gamePage.score);

    new DataBase().addUserToDataBase(gameResult);
  }

  getTypeLevel(): void {
    const type = this.settings.checkType();
    const level = this.settings.checkLevel();

    this.startGame(type, level);
  }

  async startGame(type: string, level: number): Promise<void> {
    const res = await fetch('../public/images.json');
    const categories: ImageCategory[] = await res.json();
    const cat = categories[0];

    const images = cat.images.map((name) => `images/${type}/${name}`);
    const gameImages: string[] = images.slice(0, level);

    this.gamePage.newGame(gameImages, level);

    this.clickStopGameBtn();
  }
}
