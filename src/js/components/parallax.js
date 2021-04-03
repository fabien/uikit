import Parallax from '../mixin/parallax';
import {clamp, css, parent, query, scrolledOver, addClass, removeClass} from 'uikit-util';

export default {

    mixins: [Parallax],

    props: {
        target: String,
        viewport: Number,
        easing: Number,
        clsActivated: String
    },

    data: {
        target: false,
        viewport: 1,
        easing: 1,
        clsActivated: 'uk-parallax-complete'
    },

    computed: {

        target({target}, $el) {
            return getOffsetElement(target && query(target, $el) || $el);
        }

    },

    update: {

        read({percent}, types) {

            if (!types.has('scroll')) {
                percent = false;
            }

            if (!this.matchMedia) {
                return;
            }

            const prev = percent;
            percent = ease(scrolledOver(this.target) / (this.viewport || 1), this.easing);
            
            return {
                percent,
                style: prev !== percent ? this.getCss(percent) : false
            };
        },

        write({style, active, percent}) {

            if (!this.matchMedia) {
                this.reset();
                return;
            }

            if (percent === 1) {
                addClass(this.$el, this.clsActivated);
            } else {
                removeClass(this.$el, this.clsActivated);
            }

            style && css(this.$el, style);

        },

        events: ['scroll', 'resize']
    }

};

function ease(percent, easing) {
    return clamp(percent * (1 - (easing - easing * percent)));
}

// SVG elements do not inherit from HTMLElement
function getOffsetElement(el) {
    return el
        ? 'offsetTop' in el
            ? el
            : getOffsetElement(parent(el))
        : document.body;
}
