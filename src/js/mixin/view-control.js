function plugin(UIkit) {

    if (plugin.installed) {
        return;
    }

    const {$, assign, clamp, fastdom, getIndex, remove, addClass, removeClass, hasClass, isNumber, isRtl, Promise, toNodes, trigger} = UIkit.util;

    UIkit.mixin.viewControl = {

        attrs: true,

        props: {
            clsActivated: Boolean,
            queue: Boolean,
            easing: String,
            velocity: Number,
            direction: Number,
            duration: Number
        },

        defaults: {
            easing: 'ease',
            velocity: 1,
            direction: 1,
            stack: [],
            queue: false,
            promises: [],
            percent: 0,
            clsActive: 'uk-active',
            clsActivated: false,
            Transitioner: false,
            transitionOptions: {}
        },

        computed: {

            duration({velocity,duration}, $el) {
                if (isNumber(duration)) {
                    return duration;
                } else if (this.animation && isNumber(this.animation.duration)) {
                    return this.animation.duration;
                }
                return speedUp($el.offsetWidth / velocity);
            },
            
            promise() {
                return Promise.all(this.promises);
            },
            
            isTransitioning() {
                return this.promises.length > 1;
            },
            
            isStacking() {
                return this.stack.length > 1;
            },
            
            isEmpty() {
                return this.views.length === 0;
            },
            
            views() {
                return toNodes(this.$el.children);
            }

        },
        
        connected: function() {
            if (this.views[0]) this.show(this.views[0], this.direction);
        },

        methods: {

            show(elem, direction = this.direction, force = false) {
                
                elem = !elem ? $('<div></div>') : $(elem);
                
                if (!elem) return Promise.reject();
                
                const {stack} = this;
                const queueIndex = force ? 0 : stack.length;
                const reset = () => {
                    stack.splice(queueIndex, 1);
                    if (stack.length) {
                        this.show(stack.shift(), direction, true);
                    }
                    return Promise.reject();
                };

                if (this.queue) stack[force ? 'unshift' : 'push'](elem);
                
                if (!force && stack.length > 1) {
                    if (stack.length === 2) {
                        this.promises.push(this._transitioner.forward(Math.min(this.duration, 200)));
                    }
                    return Promise.all(this.promises);
                }
                
                const prev = this.current;
                const next = elem;
                let last = null;
                
                if (prev === next) return reset();
                
                this.prev = prev;
                this.current = next;
                
                this.$el.appendChild(next);

                var preventHide = prev ? !trigger(prev, 'beforeitemhide', [this]) : false;
                if (preventHide || !trigger(next, 'beforeitemshow', [this, prev])) {
                    this.current = this.prev;
                    if (!this.isRetained(next)) remove(next);
                    return reset();
                }
                
                trigger(this.$el, 'transition', [this, next, prev]);
                
                var promise = this._show(prev, next, direction, force).then(() => {

                    prev && trigger(prev, 'itemhidden', [this]);
                    trigger(next, 'itemshown', [this]);

                    return new Promise(resolve => {
                        fastdom.write(() => {
                            last = stack.shift();
                            if (stack.length) {
                                this.show(stack.shift(), direction, true);
                            } else {
                                this._transitioner = null;
                            }
                            resolve();
                        });
                    });

                }).finally(() => {
                    var index = this.promises.indexOf(promise);
                    if (index > -1) this.promises.splice(index, 1);
                    
                    trigger(this.$el, 'transitioned', [this, next, prev]);
                });
                
                this.promises.push(promise);

                prev && trigger(prev, 'itemhide', [this]);
                trigger(next, 'itemshow', [this]);
                
                return Promise.all(this.promises).then(function() {
                    return last || next;
                });

            },
            
            _show(prev, next, direction, force) {

                this._transitioner = new this.Transitioner(
                    prev,
                    next,
                    direction,
                    assign({
                        easing: force
                            ? next.offsetWidth < 600
                                ? 'cubic-bezier(0.25, 0.46, 0.45, 0.94)' /* easeOutQuad */
                                : 'cubic-bezier(0.165, 0.84, 0.44, 1)' /* easeOutQuart */
                            : this.easing
                    }, this.transitionOptions)
                );

                if (!force && !prev) {
                    this._transitioner.translate(1);
                    return Promise.resolve();
                }
                
                return this._transitioner.show(this.duration, this.percent);

            }

        }

    };

}

export default plugin;

export function speedUp(x) {
    return .5 * x + 300; // parabola through (400,500; 600,600; 1800,1200)
}
