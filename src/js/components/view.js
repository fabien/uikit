import View from '../mixin/view';
import AnimationsPlugin from './internal/slideshow-animations';
import {mixin, util: {trigger}} from 'uikit-util';

export default {

    const Animations = AnimationsPlugin(UIkit);
    
    UIkit.component('view', {

        mixins: [mixin.class, mixin.view, mixin.attributesObserver],
        
        observedAttrs: 'view',
        
        defaults: {
            Animations
        },
        
        attributeChanged(attributeName, value) {
            if (attributeName === 'view') {
                trigger(this.$el, 'switchview', [this, value]);
            }
        }

    });

}
