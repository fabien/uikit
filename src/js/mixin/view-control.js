function plugin(UIkit) {

    if (plugin.installed) {
        return;
    }

    const {$, $$, assign, clamp, fastdom, getIndex, remove, addClass, removeClass, hasClass, toggleClass, attr, hasAttr, isNumber, isRtl, Promise, toNodes, trigger, getImage} = UIkit.util;

    UIkit.mixin.viewControl = {

        attrs: true,

        props: {
            retain: Boolean,
            clsActivated: Boolean,
            clsEmpty: String,
            queue: Boolean,
            easing: String,
            velocity: Number,
            direction: Number,
            duration: Number
        },

        defaults: {
            retain: false,
            easing: 'ease',
            velocity: 1,
            direction: 1,
            stack: [],
            queue: false,
            promises: [],
            percent: 0,
            clsActive: 'uk-active',
            clsEmpty: 'uk-empty',
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
                return this.views.length === 0 ||
                    (this.views.length === 1 && hasClass(this.views[0], 'uk-empty-placeholder'));
            },
            
            views() {
                return toNodes(this.$el.children);
            }

        },
        
        ready: function() {
            if (this._pending) {
                this._pending();
            } else if (this.views[0]) {
                this.show(this.views[0], this.direction);
            }
        },
        
        update: {

            write() {
                if (this.clsEmpty) toggleClass(this.$el, this.clsEmpty, this.isEmpty);
            }

        },

        methods: {

            show(elem, direction = this.direction, force = false, defer = false) {
                elem = !elem ? $('<div class="uk-empty-placeholder"></div>') : $(elem);
                
                if (!elem) return Promise.reject();
                
                if (!this._isReady) {
                    return new Promise((resolve, reject) => {
                        this._pending = function() {
                            delete this._pending;
                            return this.show(elem, direction, force, defer).then(resolve, reject);
                        };
                    });
                }

                const {stack} = this;
                const queueIndex = force ? 0 : stack.length;
                const reset = (resolve) => {
                    stack.splice(queueIndex, 1);
                    if (stack.length) {
                        this.show(stack.shift(), direction, true);
                    }
                    return resolve ? Promise.resolve() : Promise.reject();
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
                
                if (prev === next) return reset(true);
                
                return this._preload(next).then(() => {
                
                    this.prev = prev;
                    this.current = next;
                    
                    this.$el.appendChild(next);
                    
                    var transitionOptions = assign({}, this.transitionOptions);
                    
                    function _show(done) {
                        const preventHide = prev ? !trigger(prev, 'beforeitemhide', [this]) : false;
                        if (preventHide || !trigger(next, 'beforeitemshow', [this])) {
                            this.current = this.prev;
                            this.removeItem(next, true);
                            return defer ? reset : reset();
                        }
                        
                        trigger(this.$el, 'transition', [this, next, prev]);
                        
                        const promise = this._show(prev, next, direction, force, transitionOptions).then(() => {

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
                            const index = this.promises.indexOf(promise);
                            if (index > -1) this.promises.splice(index, 1);
                            
                            trigger(this.$el, 'transitioned', [this, next, prev]);
                        });
                        
                        this.promises.push(promise);

                        prev && trigger(prev, 'itemhide', [this]);
                        trigger(next, 'itemshow', [this]);
                        
                        return Promise.all(this.promises).then(function() {
                            if (typeof done === 'function') {
                                return done(last || next);
                            }
                            return last || next;
                        });
                    }
                    
                    return defer ? _show.bind(this) : _show.call(this);
                });
            },
            
            isRetained(target) {
                return this.retain || hasAttr(target, 'data-retain');
            },
            
            removeItem(target, force) {
                if (this.views.indexOf(target) === -1 && !force) return;
                if (this.isRetained(target)) {
                    removeClass(target, this.clsActive, this.clsActivated);
                    trigger(target, 'retain', [this, attr(target, 'data-retain')]);
                } else {
                    remove(target);
                }
            },
            
            _show(prev, next, direction, force, transitionOptions) {
                const options = {
                    direction: direction,
                    duration: this.duration,
                    percent: this.percent,
                    easing: this.easing
                };
                
                trigger(this.$el, 'createtransition', [this, next, prev, options]);
                
                this._transitioner = new this.Transitioner(
                    prev,
                    next,
                    options.direction,
                    assign({
                        easing: force
                            ? next.offsetWidth < 600
                                ? 'cubic-bezier(0.25, 0.46, 0.45, 0.94)' /* easeOutQuad */
                                : 'cubic-bezier(0.165, 0.84, 0.44, 1)' /* easeOutQuart */
                            : options.easing
                    }, transitionOptions || this.transitionOptions)
                );

                if (!force && !prev) {
                    this._transitioner.translate(1);
                    return Promise.resolve();
                }
                
                return this._transitioner.show(options.duration, options.percent);
            },
            
            _preload: function(elem) {
                var promises = $$('img', elem).map(function(img) {
                    return getImage(img.src);
                });
                return Promise.all(promises);
            }

        }

    };

}

export default plugin;

export function speedUp(x) {
    return .5 * x + 300; // parabola through (400,500; 600,600; 1800,1200)
}
