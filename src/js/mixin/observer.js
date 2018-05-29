import {attr, isUndefined, on} from '../util/index';

export default {

    props: {
        observeAttributes: Boolean
    },

    data: {
        observeAttributes: false
    },

    init() {
        if (!this.$props.observeAttributes) return;
        const observedAttrs = [].concat(this.$options.observedAttrs || []);
        on(this.$el, 'attributechanged', (event, attributeName) => {
            if (event.target === this.$el &&
                (observedAttrs.length === 0 || observedAttrs.indexOf(attributeName) > -1)) {
                const handlers = [].concat(this.$options.attributeChanged || []);
                var $props = this.parseProps() || {};
                handlers.forEach((handler) => {
                    let value = $props[attributeName];
                    value = isUndefined(value) ? attr(event.target, attributeName) : value;
                    return handler.call(this, attributeName, value);
                });
            }
        });
    }

};
