import {attr, isUndefined, on} from '../util/index';

export default {
    
    props: {
        observeAttributes: Boolean
    },

    defaults: {
        observeAttributes: false
    },

    init: function() {
        if (!this.$props.observeAttributes) return;
        var observedAttrs = [].concat(this.$options.observedAttrs || []);
        on(this.$el, 'attributechanged', (event, attributeName) => {
            if (event.target === this.$el &&
                (observedAttrs.length === 0 || observedAttrs.indexOf(attributeName) > -1)) {
                var handlers = [].concat(this.$options.attributeChanged || []);
                handlers.forEach((handler) => {
                    var value = this.$props[attributeName];
                    value = isUndefined(value) ? attr(event.target, attributeName) : value;
                    return handler.call(this, attributeName, value);
                });
            }
        });
    }
    
};
