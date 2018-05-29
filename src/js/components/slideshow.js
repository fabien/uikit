import Class from '../mixin/class';
import Slideshow from '../mixin/slideshow';
import Animations from './internal/slideshow-animations';
import SliderReactive from '../mixin/slider-reactive';
import {height, css} from 'uikit-util';

export default {

    mixins: [Class, Slideshow, SliderReactive],

    props: {
        ratio: String,
        minHeight: Boolean,
        maxHeight: Boolean,
    },

    data: {
        ratio: '16:9',
        minHeight: false,
        maxHeight: false,
        selList: '.uk-slideshow-items',
        attrItem: 'uk-slideshow-item',
        selNav: '.uk-slideshow-nav',
        Animations
    },

    update: {

        read() {
            if (this.ratio === 'auto' || !this.ratio.indexOf(':')) {
                return {height: false};
            }

            let [width, height] = this.ratio.split(':').map(Number);

            height = height * this.$el.offsetWidth / width;

            if (this.minHeight) {
                height = Math.max(this.minHeight, height);
            }

            if (this.maxHeight) {
                height = Math.min(this.maxHeight, height);
            }

            return {height};
        },

        write({height: hgt}) {
            if (hgt === false) {
                css(this.list, 'height', '100%');
            } else {
                height(this.list, Math.floor(hgt));
            }
        },

        events: ['load', 'resize']

    }

};
