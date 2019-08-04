import {width, height, css} from 'uikit-util';
import mixin from '../mixin/index';

export default {

    mixins: [mixin.class],
    
    args: 'ratio',

    props: {
        ratio: String,
        minHeight: Boolean,
        maxHeight: Boolean,
    },

    data: {
        ratio: '1/1',
        minHeight: false,
        maxHeight: false
    },

    update: [{

        read() {
            if (this.ratio === 'auto' || !this.ratio.indexOf('/')) {
                return {height: false};
            }

            let [w, h] = this.ratio.split('/').map(Number);

            h = h * width(this.$el) / w;

            if (this.minHeight) {
                h = Math.max(this.minHeight, h);
            }

            if (this.maxHeight) {
                h = Math.min(this.maxHeight, h);
            }

            return {height:h};
        },

        write({height: hgt}) {
            if (hgt === false) {
                css(this.$el, 'height', '100%');
            } else {
                height(this.$el, Math.floor(hgt));
            }
        },

        events: ['load', 'resize']

    }]

};
