import Animations from './internal/slideshow-animations';
import Transitioner from './internal/slideshow-transitioner';
import {addClass, assign, isNumber, fastdom} from 'uikit-util';
import ViewControl from '../mixin/view-control';

export default {

    mixins: [ViewControl],

    props: {
        animation: String
    },

    data: {
        animation: 'fade',
        clsActivated: 'uk-view-active',
        Animations,
        Transitioner
    },

    computed: {

        animation({animation, Animations}) {
            animation = this.__force ? 'none' : animation;
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
            fastdom.flush();
        },
        
        itemshown({target}) {
            if (this.views.indexOf(target) === -1) return;
            addClass(target, this.clsActivated);
            delete this.__force;
        },

        itemhidden({target}) {
            this.removeItem(target);
        }

    }

};
