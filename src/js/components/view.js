import Animations from './internal/slideshow-animations';
import {trigger} from 'uikit-util';
import mixin from '../mixin/index';

export default {

    mixins: [mixin.class, mixin.view, mixin.attributesObserver],

    observedAttrs: 'view',

    data: {
        Animations
    },

    attributeChanged(attributeName, value) {
        if (attributeName === 'view') {
            trigger(this.$el, 'switchview', [this, value]);
        }
    }

};
