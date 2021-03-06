import '@polymer/polymer/polymer-element.js';
/**
 * 🚨 Deprecated, please use MatryoshkaLoaderMixin 🚨
 *
 * `MatryoshkaLoaderBehavior` defines a loading flag for elements that automatically take into account the loading
 * state of the child elements.
 *
 * For a visual explanation, take a look at the demo section, that might explain something more.
 *
 * @deprecated use MatryoshkaLoaderMixin
 * @polymerBehavior MatryoshkaLoaderBehavior
 * @demo demo/matryoshka-loader-behavior.html Behavior demo
 **/
MatryoshkaLoaderBehavior = {
  properties: {
    /**
     * List of all child elements that have propagated their events to this element.
     * @private
     */
    _relatedElements: {
      type: Array,
      value: []
    },

    /**
     * True if the element or one of it's children are still loading.
     */
    loading: {
      type: Boolean,
      readOnly: true,
      reflectToAttribute: true, //@todo remove this
      computed: '_isLoading(_relatedElements, hostLoading)'
    },

    /**
     * True if the element its self and all children are loaded
     */
    loaded: {
      type: Boolean,
      readOnly: true,
      reflectToAttribute: true, //@todo remove this
      computed: '_isLoaded(_relatedElements, hostLoading)'
    },

    /**
     * Flag to set if the element its self is loading
     */
    hostLoading: {
      type: Boolean,
      value: false,
      observer: '_onHostLoading'
    },

    /**
     * Flag to prevent bubbling of loading state to parent, it doesn't fire anything, but it can still receive events
     * from child elements.
     */
    defer: {
      type: Boolean,
      value: false,
    },
  },

  listeners: {
    'matryoshka-loading': '_onMatryoshkaLoading',
    'matryoshka-loaded': '_onMatryoshkaLoaded',
  },

  /**
   * When the hostLoading property of the element changes, we need to fire of some events.
   * If defer is set, we prevent the firing of events.
   *
   * @private
   */
  _onHostLoading: function (newHostLoading) {
    this.async(function() {
      if (this.defer) {
        return;
      }

      newHostLoading ? this.fire('matryoshka-loading', {srcElement: this})
                     : this.fire('matryoshka-loaded', {srcElement: this});
    });
  },

  /**
   * Calculate the loaded state of the element
   * @private
   */
  _isLoaded: function (relatedElements, hostLoading) {
    return !this._isLoading(relatedElements, hostLoading);
  },

  /**
   * Calculate the loading state of the element
   * @private
   */
  _isLoading: function (relatedElements, hostLoading) {
    return hostLoading || this._areRelatedElementsLoading(relatedElements);
  },

  /**
   * When an event has fired that a child has started loading it get's added to the _relatedElements list..
   * @private
   */
  _onMatryoshkaLoading: function(event) {
    if (event && this === event.detail.srcElement) {
      return true;
    }

    if (this.defer) {
      event.stopPropagation();
    }

    this.addRelatedElement(event.detail.srcElement);
    return true;
  },

  /**
   * When an event has fired that a child element is loaded we recheck everything
   * @private
   */
  _onMatryoshkaLoaded: function(event) {
    this.checkLoaded();
  },

  /**
   * Force a recheck of the elements loading state, normally called automatically.
   */
  checkLoaded: function() {
    this._relatedElements = this._relatedElements.slice(0);
  },

  ready: function() {
    this._checkLoaded = this.checkLoaded.bind(this)
  },

  /**
   * Ability to manually add a related elements that it needs to check for their loaded state.
   * The element passed must implement MatryoshkaLoaderBehavior as well.
   * @param {HTMLElement} elem Optional parameter with the event that triggers.
   */
  addRelatedElement: function (elem) {
    if (typeof elem.loaded != "boolean") {
      console.warn(
        "Element requesting to be watched for loading state should implement MatryoshkaLoaderBehavior",
        elem
      );
    }

    elem.addEventListener('matryoshka-loaded', this._checkLoaded);

    var elems = this._relatedElements ? this._relatedElements.slice(0) : [];
    elems.push(elem);
    this._relatedElements = elems;
    this.checkLoaded();
  },

  /**
   * Remove an element from being watch for it's loading state.
   * @param elem
   */
  removeRelatedElement: function (elem) {
    elem.removeEventListener('matryoshka-loaded', this._checkLoaded)

    var elements = this._relatedElements ? this._relatedElements.slice(0) : [];
    this._relatedElements = elements.filter(function(relatedElem) {
      return relatedElem !== elem;
    })

    this.checkLoaded()
  },

  /**
   * Gives back a boolean of certain elements are still loading
   * @param relatedElements
   * @returns {boolean}
   * @private
   */
  _areRelatedElementsLoading: function(relatedElements) {
    var loadingElems = relatedElements.filter(function (elem) {
      return elem.loading;
    });

    return loadingElems.length > 0
  }
}
