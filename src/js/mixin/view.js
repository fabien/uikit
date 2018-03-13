import AnimationsPlugin from './internal/slideshow-animations';
import TransitionerPlugin from './internal/slideshow-transitioner';
import ViewControlPlugin from './view-control.js';

function plugin(UIkit) {

    if (plugin.installed) {
        return;
    }

    UIkit.use(ViewControlPlugin);

    const {mixin, util: {addClass, assign, fastdom, attr, isNumber, remove, removeClass, trigger}} = UIkit;

    const Animations = AnimationsPlugin(UIkit);
    const Transitioner = TransitionerPlugin(UIkit);

    UIkit.mixin.view = {

        mixins: [mixin.viewControl],

        props: {
            animation: String
        },

        defaults: {
            animation: 'fade',
            clsActivated: 'uk-transition-active',
            Animations,
            Transitioner
        },

        computed: {

            animation({animation, Animations}) {
                return assign(animation in Animations ? Animations[animation] : Animations.fade, {name: animation});
            },

            transitionOptions() {
                return {animation: this.animation};
            }

        },
        
        events: {

            'itemshow itemhide itemshown itemhidden'({target}) {
                if (this.views.indexOf(target) === -1) return;
                UIkit.update(null, target);
            },
            
            beforeitemshow({target}) {
                addClass(target, this.clsActive);
            },

            itemshown({target}) {
                if (this.views.indexOf(target) === -1) return;
                addClass(target, this.clsActivated);
            },

            itemhidden({target}) {
                this.removeItem(target);
            }

        }

    };

}

export default plugin;
