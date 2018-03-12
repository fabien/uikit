import Slideshow from '../mixin/slideshow';
import AnimationsPlugin from './internal/slideshow-animations';
import ParallaxPlugin from './internal/slider-parallax';
import SliderReactive from '../mixin/internal/slider-reactive';

function plugin(UIkit) {

    if (plugin.installed) {
        return;
    }

    UIkit.use(Slideshow);

    const {mixin, util: {height, css}} = UIkit;
    
    const Animations = AnimationsPlugin(UIkit);

    UIkit.component('slideshow-parallax', ParallaxPlugin(UIkit, 'slideshow'));

    UIkit.component('slideshow', {

        mixins: [mixin.class, mixin.slideshow, SliderReactive(UIkit)],

        props: {
            ratio: String,
            minHeight: Boolean,
            maxHeight: Boolean
        },

        defaults: {
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

    });

}

if (!BUNDLED && typeof window !== 'undefined' && window.UIkit) {
    window.UIkit.use(plugin);
}

export default plugin;
