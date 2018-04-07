import {$$, attr, css, isUndefined, isVisible} from '../util/index';

export default function (UIkit) {

    UIkit.component('height-content', {

        args: 'target',

        props: {
            target: String,
            property: String,
            minHeight: Number,
            maxHeight: Number
        },

        defaults: {
            target: '> *',
            property: 'height',
            minHeight: 0,
            maxHeight: 0
        },

        computed: {

            elements({target}, $el) {
                return $$(target, $el);
            }

        },

        update: {

            read() {
                return this.match(this.elements);
            },

            write({height}) {
                css(this.$el, this.property, height);
            },

            events: ['load', 'resize']

        },

        methods: {

            match(elements) {
                if (elements.length === 0) {
                    return {};
                }
                
                const heights = [];
                const maxHeight = this.maxHeight;
                const minHeight = Math.min(this.minHeight, maxHeight || this.minHeight);
                
                elements
                    .forEach(el => {

                        let style, hidden;
                        
                        if (!isVisible(el)) {
                            style = attr(el, 'style');
                            hidden = attr(el, 'hidden');

                            attr(el, {
                                style: `${style || ''};display:block !important;`,
                                hidden: null
                            });
                        }
                        
                        let height = el.offsetHeight;
                        height = Math.max(minHeight, Math.min(height, maxHeight || height));
                        
                        heights.push(height);

                        if (!isUndefined(style)) {
                            attr(el, {style, hidden});
                        }

                    });

                let height = heights.reduce(function(memo, height) {
                    return memo + height;
                }, 0);

                return {height};
            }
        }

    });

}
