import AnimationsPlugin from './internal/slideshow-animations';
import TransitionerPlugin from './internal/slideshow-transitioner';
import ViewControlPlugin from './view-control.js';

function plugin(UIkit) {

    if (plugin.installed) {
        return;
    }

    UIkit.use(ViewControlPlugin);

    const {mixin, util: {addClass, assign, fastdom, isNumber, remove, removeClass}} = UIkit;

    const Animations = AnimationsPlugin(UIkit);
    const Transitioner = TransitionerPlugin(UIkit);

    UIkit.mixin.view = {

        mixins: [mixin.viewControl],

        props: {
            animation: String,
            retain: Boolean
        },

        defaults: {
            animation: 'slide',
            retain: false,
            clsActivated: 'uk-transition-active',
            Animations,
            Transitioner
        },

        computed: {

            animation({animation, Animations}) {
                return assign(animation in Animations ? Animations[animation] : Animations.slide, {name: animation});
            },

            transitionOptions() {
                return {animation: this.animation};
            }

        },
        
        methods: {
            
            isRetained: function(target) {
                return this.retain;
            }
            
        },

        events: {

            'itemshow itemhide itemshown itemhidden'({target}) {
                UIkit.update(null, target);
            },
            
            beforeitemshow({target}) {
                addClass(target, this.clsActive);
            },

            itemshown({target}) {
                addClass(target, this.clsActivated);
            },

            itemhidden({target}) {
                if (this.isRetained(target)) {
                    removeClass(target, this.clsActive, this.clsActivated);
                } else {
                    remove(target);
                }
            }

        }

    };

}

export default plugin;
