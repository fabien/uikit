function plugin(UIkit) {

    if (plugin.installed) {
        return;
    }

    const {mixin, util: {height, css}} = UIkit;

    UIkit.component('ratio', {

        mixins: [mixin.class],
        
        props: {
            ratio: String,
            minHeight: Boolean,
            maxHeight: Boolean,
        },

        defaults: {
            ratio: '1:1',
            minHeight: false,
            maxHeight: false
        },

        update: [{
            
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
                    css(this.$el, 'height', '100%');
                } else {
                    height(this.$el, Math.floor(hgt));
                }
            },

            events: ['load', 'resize']

        }]

    });

}

if (!BUNDLED && typeof window !== 'undefined' && window.UIkit) {
    window.UIkit.use(plugin);
}

export default plugin;
