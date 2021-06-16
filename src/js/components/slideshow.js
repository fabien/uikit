import Class from '../mixin/class';
import Slideshow from '../mixin/slideshow';
import Media from '../mixin/media';
import Animations from './internal/slideshow-animations';
import SliderReactive from '../mixin/slider-reactive';
import {boxModelAdjust, css} from 'uikit-util';

export default {

    mixins: [Class, Slideshow, SliderReactive, Media],

    props: {
        ratio: String,
        minHeight: Boolean,
        maxHeight: Boolean
    },

    data: {
        ratio: '16:9',
        media: 640,
        minHeight: false,
        maxHeight: false,
        selList: '.uk-slideshow-items',
        attrItem: 'uk-slideshow-item',
        selNav: '.uk-slideshow-nav',
        Animations
    },

    update: {

        read() {
            if (this.ratio === 'auto' ||
                !(this.ratio.indexOf(':') > 0 || this.ratio.indexOf('/') > 0)) {
                return {height: false};
            }

            let [width, height] = this.ratio.split(':').map(Number);

            height = height * this.list.offsetWidth / width || 0;

            if (this.minHeight === 'screen') {
                if (this.media > 0 && !this.matchMedia) {
                    return {height: '100vh'};
                }
            } else if (typeof this.minHeight === 'number') {
                height = Math.max(this.minHeight, height);
            }

            if (typeof this.maxHeight === 'number') {
                height = Math.min(this.maxHeight, height);
            }

            return {height: height - boxModelAdjust(this.list, 'height', 'content-box')};
        },

        write({height}) {
            if (typeof height === 'string') {
                css(this.list, 'height', height);
            } else if (height === false) {
                css(this.list, 'minHeight', '100%');
            } else if (height > 0) {
                css(this.list, 'minHeight', height);
            }
        },

        events: ['resize']

    }

};
