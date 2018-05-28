import Animations from './internal/slideshow-animations';
import Transitioner from './internal/slideshow-transitioner';
import {addClass, assign, fastdom, attr, isNumber, remove, removeClass, trigger} from 'uikit-util';
import ViewControl from '../mixin/view-control';

export default {
    
    mixins: [ViewControl],

    props: {
        animation: String
    },

    data: {
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
            this.$update(target);
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

}
