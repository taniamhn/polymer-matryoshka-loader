import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
class MixinNonLoaderElement extends PolymerElement {
  static get template() {
    return html`
    <style>
      :host {
        display: block;
        padding: 10px;
        background-color: #fff;
        border: 1px solid #fff;
        margin-bottom: 10px;
      }
      span {
        display: block;
        margin-bottom: 10px;
      }
    </style>

    <span>
      non-loader element
    </span>
    <slot></slot>
`;
  }

  static get is() { return 'non-mixin-loader-element' }
}
customElements.define(MixinNonLoaderElement.is, MixinNonLoaderElement);
