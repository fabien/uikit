import {$$, attr, css, isUndefined, isVisible} from '../util/index';

export default {

    args: 'target',

    props: {
        target: String,
        offsetTarget: String,
        property: String,
        minHeight: Number,
        maxHeight: Number,
        extraHeight: Number
    },

    data: {
        target: '> *',
        property: 'height',
        minHeight: 0,
        maxHeight: 0,
        extraHeight: 0
    },

    computed: {

        elements({target}, $el) {
            return $$(target, $el);
        },
        
        offsetElements({offsetTarget}, $el) {
            if (!offsetTarget) return [];
            return $$(offsetTarget);
        }

    },

    update: {

        read() {
            return this.match(this.elements, this.offsetElements);
        },

        write({height}) {
            css(this.$el, this.property, height);
        },

        events: ['load', 'resize']

    },

    methods: {

        match(elements, offsetElements) {
            if (elements.length === 0) {
                return {};
            }

            const heights = [this.extraHeight || 0];
            const maxHeight = this.maxHeight;
            const minHeight = Math.min(this.minHeight, maxHeight || this.minHeight);
            
            if (offsetElements.length > 0) {
                elements = offsetElements.concat(elements);
            }

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

            const height = heights.reduce(function(memo, height) {
                return memo + height;
            }, 0);

            return {height};
        }
    }

};
