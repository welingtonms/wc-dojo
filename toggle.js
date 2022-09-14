import {LitElement, html, css} from 'lit';
import {classMap} from 'lit/directives/class-map.js';

export class Toggle extends LitElement {
  static get styles() {
    return css`
      .checked {
        background-color: red;
      }
    `;
  }

  static get properties() {
    return {
      checked: {type: Boolean, reflect: true},
      value: {type: String},
    };
  }

  constructor() {
    super();
    this.checked = false;
    this.value = '';
  }

  render() {
    return html`
      <button
        type="button"
        class="${classMap({checked: this.checked})}"
        @click=${this._handleToggle}
      >
        <slot></slot>
      </button>
    `;
  }

  _handleToggle() {
    this.checked = !this.checked;

    this.dispatchEvent(
      new CustomEvent('m-toggle', {
        bubbles: true,
        composed: true,
        detail: {
          value: this.value,
          checked: this.checked,
        },
      })
    );
  }
}

//  <m-toggle>Accept</m-toggle>
//  <m-toggle>Change</m-toggle>
//  <m-toggle>Leave</m-toggle>

window.customElements.define('m-toggle', Toggle);
