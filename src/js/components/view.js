import View from '../mixin/view';
import AnimationsPlugin from './internal/slideshow-animations';

function plugin(UIkit) {

    if (plugin.installed) {
        return;
    }

    UIkit.use(View);

    const {mixin} = UIkit;

    const Animations = AnimationsPlugin(UIkit);

    UIkit.component('view', {

        mixins: [mixin.class, mixin.view],
        
        defaults: {
            Animations
        }

    });

}

if (!BUNDLED && typeof window !== 'undefined' && window.UIkit) {
    window.UIkit.use(plugin);
}

export default plugin;
