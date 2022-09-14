import {LitElement, html, css} from 'lit';
import createSelectionStrategy from './selection-strategy';

export class ToggleGroup extends LitElement {
  static get styles() {
    return css`
      div {
        display: flex;
        flex-direction: row;
        gap: 8px;
      }
    `;
  }

  defaultSlot;
  selectStrategy;
  selection;

  static get properties() {
    return {
      /**
       * @type {single|multiple}
       */
      type: {type: String},
    };
  }

  constructor() {
    super();

    this.defaultSlot = null;
    this.selection = new Set();
  }

  connectedCallback() {
    super.connectedCallback();

    this.selectStrategy = createSelectionStrategy({type: this.type});

    this.addEventListener('m-toggle', this._handleToggle);
  }

  firstUpdated() {
    this.defaultSlot = this.renderRoot?.querySelector('slot');
  }

  updated() {
    const toggles = [
      ...this.defaultSlot.assignedElements({flatten: true}),
    ].filter((item) => item.tagName.toLowerCase() === 'm-toggle');

    toggles.forEach((toggle) => {
      toggle.checked = this.selection.has(toggle.value);
    });
  }

  render() {
    return html`
      <div>
        <slot></slot>
      </div>
    `;
  }

  _handleToggle(e) {
    this.selection = this.selectStrategy.toggle(e.detail.value, this.selection);

    this.dispatchEvent(
      new CustomEvent('m-change', {
        bubbles: true,
        composed: true,
        detail: {
          selection: this.selection,
        },
      })
    );

    this.requestUpdate();

    console.log(this.selection);
  }
}

window.customElements.define('m-toggle-group', ToggleGroup);
