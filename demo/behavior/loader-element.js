import '@polymer/polymer/polymer-legacy.js';
import '../../matryoshka-loader-behavior.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
Polymer({
  _template: html`
    <style>
      :host {
        display: block;
        padding: 20px;
      }
      :host([loading]) {
        background-color: darkorange;
      }
      :host([loaded]) {
        background-color: lawngreen;
      }
    </style>

    <span>
      <template is="dom-if" if="[[hostLoading]]">
        hostLoading
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
`,

  is: 'loader-element',

  properties: {
    countdown: Number,
    relatedLoading: {
      type: Number,
      computed: '_calculateRelatedLoading(_relatedElements)'
    }
  },

  behaviors: [
    MatryoshkaLoaderBehavior
  ],

  _calculateRelatedLoading(relatedElements) {
    return this._areRelatedElementsLoading(relatedElements);
  },

  attached() {
    if (this.countdown) {
      this.hostLoading = true;

      this.async(function () {
        this.hostLoading = false;
      }, this.countdown)
    }
  }
});
