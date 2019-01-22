import '@polymer/polymer/polymer-legacy.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
Polymer({
  _template: html`
    <style>
      :host {
        display: block;
        padding: 20px;
        background-color: grey;
      }
    </style>

    <span>
      non-loader element
    </span>
    <slot></slot>
`,

  is: 'non-loader-element'
});
