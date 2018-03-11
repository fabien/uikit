import View from '../mixin/view';
import AnimationsPlugin from './internal/slideshow-animations';

function plugin(UIkit) {

    if (plugin.installed) {
        return;
    }

    UIkit.use(View);

    const {mixin, util: {trigger}} = UIkit;

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

if (!BUNDLED && typeof window !== 'undefined' && window.UIkit) {
    window.UIkit.use(plugin);
}

export default plugin;
