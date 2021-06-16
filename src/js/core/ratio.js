import {css, height, width} from 'uikit-util';
import mixin from '../mixin/index';
import Media from '../mixin/media';

export default {

    mixins: [Media, mixin.class],

    args: 'ratio',

    props: {
        ratio: String,
        adjust: Number,
        minHeight: Boolean,
        maxHeight: Boolean
    },

    data: {
        ratio: '1:1',
        adjust: 0,
        media: 640,
        minHeight: false,
        maxHeight: false
    },

    update: [{

        read() {
            if (this.ratio === 'auto' ||
                !(this.ratio.indexOf(':') > 0 || this.ratio.indexOf('/') > 0)) {
                return {height: false};
            }

            let [w, h] = this.ratio.split(/[/:]/).map(Number);

            if (typeof w !== 'number' || typeof h !== 'number') {
                return {height: false};
            }

            const _width = width(this.$el) + this.adjust;

            h = h * _width / w;

            if (this.minHeight === 'screen') {
                if (this.media > 0 && !this.matchMedia) {
                    return {height: '100vh'};
                }
            } else if (typeof this.minHeight === 'number') {
                h = Math.max(this.minHeight, h);
            }

            if (typeof this.maxHeight === 'number') {
                h = Math.min(this.maxHeight, h);
            }

            return {height: h};
        },

        write({height: hgt}) {
            if (typeof hgt === 'string') {
                css(this.$el, 'height', hgt);
            } else if (hgt === false) {
                css(this.$el, 'height', '100%');
            } else {
                height(this.$el, Math.floor(hgt));
            }
        },

        events: ['load', 'resize']

    }]

};
