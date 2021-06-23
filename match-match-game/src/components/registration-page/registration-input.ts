import BaseComponent from '../base-component';
import './css/registration-input.css';

export default class Input extends BaseComponent {
  constructor(id: string, input: string, type: string, inner: string) {
    super('fieldset', ['form__block']);

    this.element.innerHTML = `
      <label class='form__label' for='${id}'>${inner}</label>
        <input class='form__${input}' id='${id}' type='${type}' required maxlength='30'>
    `;
  }
}
