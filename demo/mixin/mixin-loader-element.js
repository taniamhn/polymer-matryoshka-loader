import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import '@polymer/polymer/lib/elements/dom-if.js';
import { MatryoshkaLoaderMixin } from '../../matryoshka-loader-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { timeOut } from '@polymer/polymer/lib/utils/async.js';
class MixinLoaderElement extends MatryoshkaLoaderMixin(PolymerElement) {
  static get template() {
    return html`
    <style>
      :host {
        display: block;
        padding: 10px;
        background-color: #F7F7F7;
        border: 1px solid #fff;
      }
      :host([host-loading]) {
        background-color: #fffe00;
      }
      :host([loaded]) {
        background-color: #13e4ad;
      }
      span {
        display: block;
        margin-bottom: 10px;
      }
    </style>

    <span>
      <template is="dom-if" if="[[hostLoading]]">
        hostLoading: [[countdown]]
      </template>
      <template is="dom-if" if="[[relatedLoading]]">
        relatedLoading
      </template>
      <template is="dom-if" if="[[loading]]">
        loading
      </template>
      <template is="dom-if" if="[[loaded]]">
        loaded
      </template>
      <template is="dom-if" if="[[defer]]">
        defer
      </template>
    </span>
    <slot></slot>
`;
  }

  static get is() { return 'mixin-loader-element' }
  static get properties() {
    return {
      countdown: Number,
      hostLoading: {
        reflectToAttribute: true
      },
      relatedLoading: {
        type: Number,
        reflectToAttribute: true,
        computed: '_calculateRelatedLoading(_relatedElements)'
      }
    }
  }

  _calculateRelatedLoading(relatedElements) {
    return this._areRelatedElementsLoading(relatedElements);
  }

  connectedCallback() {
    super.connectedCallback();
    if (this.countdown) {
      this.hostLoading = true;

      timeOut.run(_ => {
        this.hostLoading = false;
      }, this.countdown)
    }
  }
}
customElements.define(MixinLoaderElement.is, MixinLoaderElement);
