import BaseComponent from '../base-component';
import Input from './registration-input';
import './css/registration-field.css';
import avatar from '../../assets/icons/avatar add.svg';

export default class RegistrationField extends BaseComponent {
  private readonly form = new BaseComponent('form', ['modal__register_form']);

  private readonly user = new BaseComponent('div', ['form__user']);

  private readonly info = new BaseComponent('div', ['form__info']);

  private readonly submit = new BaseComponent('button', ['modal__register_btn', 'submit']);

  private readonly cancel = new BaseComponent('button', ['modal__register_btn', 'cancel']);

  private readonly name = new Input('name', 'input', 'text', 'First Name');

  private readonly surname = new Input('surname', 'input', 'text', 'Last Name');

  private readonly email = new Input('email', 'input', 'email', 'E-mail');

  private readonly download = new Input('download', 'download', 'file', '');

  constructor() {
    super('div', ['modal__register']);

    this.addComponentsToForm();
    this.listen();
    this.cancelWindow();
    this.preventDefaultForm();
  }

  addComponentsToForm(): void {
    this.element.insertAdjacentHTML('afterbegin', `
      <div class='main-page__title'> Register new Player </div>
    `);

    this.submit.element.innerText = 'add';
    this.cancel.element.innerText = 'cancel';
    this.download.element.classList.add('download');
    this.download.element.children[0].classList.add('download');

    this.element.appendChild(this.form.element);
    this.element.appendChild(this.cancel.element);
    this.form.element.appendChild(this.user.element);
    this.form.element.appendChild(this.submit.element);
    this.user.element.appendChild(this.info.element);
    this.user.element.appendChild(this.download.element);
    this.info.element.appendChild(this.name.element);
    this.info.element.appendChild(this.surname.element);
    this.info.element.appendChild(this.email.element);
  }

  listen(): void {
    this.name.element.addEventListener('input', (e) => {
      this.validateInputs(e);
    });

    this.surname.element.addEventListener('input', (e) => {
      this.validateInputs(e);
    });

    this.email.element.addEventListener('input', (e) => {
      this.validateInputs(e);
    });

    this.download.element.addEventListener('change', (e) => {
      this.loadImage(e);
    });
  }

  preventDefaultForm(): void {
    this.form.element.addEventListener('submit', (event) => {
      event.preventDefault();
    });
  }

  loadImage(e: Event): void {
    const preview = document.querySelector('.form__label.download') as HTMLInputElement;
    const reader = new FileReader();
    const file = e.target as HTMLInputElement;

    reader.onloadend = function () {
      const resultString = reader.result as string;
      preview.src = resultString;

      const img = new Image();
      img.src = resultString;
      img.id = 'loaded__img';

      preview.innerHTML = '';
      preview.append(img);
    };

    if (file?.files && file.files[0]) {
      reader.readAsDataURL(file.files[0]);
      preview.style.backgroundImage = 'none';
    } else {
      preview.src = '';
    }
  }

  checkSubmitValidState(): void {
    const name = document.querySelector('#name') as HTMLInputElement;
    const surname = document.querySelector('#surname') as HTMLInputElement;
    const email = document.querySelector('#email') as HTMLDivElement;

    const nameParent = name.parentElement;
    const surnameParent = surname.parentElement;
    const emailParent = email.parentElement;

    if (
      nameParent?.classList.contains('completed')
      && surnameParent?.classList.contains('completed')
      && emailParent?.classList.contains('completed')
    ) {
      this.submit.element.classList.add('active');
    } else {
      this.submit.element.classList.remove('active');
    }
  }

  validateInputs(e: Event): void {
    const email = document.querySelector('#email') as HTMLInputElement;
    const regExp = /^(\p{L})+([(\p{L})[\d])*$/ui;

    const target = e.target as HTMLInputElement;

    if (target.id === 'name' || target.id === 'surname') {
      if (target.value?.match(regExp)) {
        target.parentElement?.classList.add('completed');
        return;
      }

      target.parentElement?.classList.remove('completed');
      return;
    }

    if (email.validity.valid) {
      target.parentElement?.classList.add('completed');
    } else {
      target.parentElement?.classList.remove('completed');
    }

    this.checkSubmitValidState();
  }

  clearInputs(): void {
    const nameField = document.querySelector('#name') as HTMLInputElement;
    const surnameField = document.querySelector('#surname') as HTMLInputElement;
    const emailField = document.querySelector('#email') as HTMLInputElement;
    const avatarField = document.querySelector('.form__label.download') as HTMLElement;
    const preview = document.querySelector('#loaded__img') as HTMLElement;

    const nameParent = nameField.parentElement;
    const surnameParent = surnameField.parentElement;
    const emailParent = emailField.parentElement;

    nameParent?.classList.remove('completed');
    surnameParent?.classList.remove('completed');
    emailParent?.classList.remove('completed');

    nameField.value = '';
    surnameField.value = '';
    emailField.value = '';

    if (preview) {
      avatarField.style.backgroundImage = `url(${avatar})`;
      avatarField.removeChild(preview);
    }

    this.submit.element.classList.remove('active');
  }

  cancelWindow(): void {
    this.cancel.element.addEventListener('click', () => {
      this.clearInputs();
    });
  }
}
