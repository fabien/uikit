import Modal from '../mixin/modal';
import {$, addClass, append, css, endsWith, hasClass, width, height, isVisible, parent, removeClass, unwrap, wrapAll, trigger} from 'uikit-util';

export default {

    mixins: [Modal],

    args: 'mode',

    props: {
        mode: String,
        sidebar: Boolean,
        flip: Boolean,
        overlay: Boolean,
        responsive: Boolean,
        swipeClose: Boolean
    },

    data: {
        mode: 'slide',
        flip: false,
        overlay: false,
        swipeClose: true,
        responsive: false,
        clsPage: 'uk-offcanvas-page',
        clsContainer: 'uk-offcanvas-container',
        selPanel: '.uk-offcanvas-bar',
        clsFlip: 'uk-offcanvas-flip',
        clsContainerAnimation: 'uk-offcanvas-container-animation',
        clsSidebarAnimation: 'uk-offcanvas-bar-animation',
        clsSidebar: 'uk-sidebar',
        clsSidebarContainer: 'uk-sidebar-container',
        clsMode: 'uk-offcanvas',
        clsOverlay: 'uk-offcanvas-overlay',
        clsResponsive: 'uk-offcanvas-responsive',
        selClose: '.uk-offcanvas-close'
    },

    computed: {
        
        overlay({overlay, mode}) {
            return overlay && mode !== 'sidebar';
        },
        
        bgClose({bgClose, mode}) {
            return bgClose && this.panel && mode !== 'sidebar';
        },
        
        clsFlip({flip, clsFlip}) {
            return flip ? clsFlip : '';
        },

        clsOverlay({overlay, mode, clsOverlay}) {
            return overlay && mode !== 'sidebar' ? clsOverlay : '';
        },
        
        clsResponsive({responsive, mode, clsResponsive}) {
            return responsive && mode !== 'reveal' ? clsResponsive : '';
        },
        
        clsMode({mode, clsMode}) {
            return `${clsMode}-${mode}`;
        },

        clsSidebarAnimation({mode, clsSidebarAnimation}) {
            return mode === 'none' || mode === 'reveal' ? '' : clsSidebarAnimation;
        },

        clsContainerAnimation({mode, clsContainerAnimation, sidebar}) {
            return mode !== 'push' && mode !== 'reveal' ? '' : clsContainerAnimation;
        },

        transitionElement({mode}) {
            return mode === 'reveal' ? parent(this.panel) : this.panel;
        }

    },
    
    beforeDisconnect() {
        if (this.isToggled()) {
            this.toggleNow(this.$el, false);
        }
    },

    update: {

        read() {
            if (this.mode !== 'sidebar') {
                if (this.isToggled() && !isVisible(this.$el)) {
                    this.hide();
                }
            } else {
                return {
                    panel: this.panel.offsetWidth,
                    container: width(window),
                    toggled: this.isToggled()
                };
            }
        },

        write({panel, container, toggled}) {
            if (this.mode !== 'sidebar') return;
            if (toggled) {
                width(document.body, panel < container ? container - panel : '');
            } else if (this._hiding) {
                width(document.body, '');
                delete this._hiding;
            }
        },
        
        events: ['show', 'hide', 'resize']

    },

    events: [

        {

            name: 'click',

            delegate() {
                return 'a[href^="#"]';
            },

            handler({current: {hash}, defaultPrevented}) {
                if (!defaultPrevented && hash && $(hash, document.body)) {
                    this.hide();
                }
            }

        },

        {
            name: 'touchstart',

            passive: true,

            el() {
                return this.panel;
            },

            handler({targetTouches}) {

                if (targetTouches.length === 1) {
                    this.clientY = targetTouches[0].clientY;
                }

            }

        },

        {
            name: 'touchmove',

            self: true,
            passive: false,

            filter() {
                return this.overlay;
            },

            handler(e) {
                e.cancelable && e.preventDefault();
            }

        },

        {
            name: 'touchmove',

            passive: false,

            el() {
                return this.panel;
            },

            handler(e) {

                if (e.targetTouches.length !== 1) {
                    return;
                }

                const clientY = e.targetTouches[0].clientY - this.clientY;
                const {scrollTop, scrollHeight, clientHeight} = this.panel;

                if (clientHeight >= scrollHeight
                    || scrollTop === 0 && clientY > 0
                    || scrollHeight - scrollTop <= clientHeight && clientY < 0
                ) {
                    e.cancelable && e.preventDefault();
                }

            }

        },

        {
            name: 'show',

            self: true,

            handler() {

                if (this.mode === 'reveal' && !hasClass(parent(this.panel), this.clsMode)) {
                    wrapAll(this.panel, '<div>');
                    addClass(parent(this.panel), this.clsMode);
                }
                
                css(document.documentElement, 'overflowY', this.overlay ? 'hidden' : '');
                addClass(document.body, this.clsContainer, this.clsFlip);
                css(document.body, 'touch-action', 'pan-y pinch-zoom');
                css(this.$el, 'display', 'block');
                addClass(this.$el, this.clsOverlay, this.clsResponsive);
                addClass(this.panel, this.clsSidebarAnimation, this.mode !== 'reveal' ? this.clsMode : '');
                
                height(document.body); // force reflow
                addClass(document.body, this.clsContainerAnimation);

                if (this.mode === 'sidebar') {
                    addClass(this.$el, this.clsSidebar);
                    addClass(document.body, this.clsSidebarContainer);
                }

                this.clsContainerAnimation && suppressUserScale();
                
                trigger(this.$el, 'relayout');
            }
        },
        
        {
            name: 'beforehide',

            self: true,

            handler() {
                this._hiding = true;
            }
        },

        {
            name: 'hide',

            self: true,

            handler() {
                removeClass(document.body, this.clsContainerAnimation);
                css(document.body, 'touch-action', '');
                
                trigger(this.$el, 'relayout');
            }
        },

        {
            name: 'hidden',

            self: true,

            handler() {
                this.clsContainerAnimation && resumeUserScale();

                if (this.mode === 'reveal') {
                    unwrap(this.panel);
                }
                
                if (this.mode === 'sidebar') {
                    removeClass(this.$el, this.clsSidebar);
                    removeClass(document.body, this.clsSidebarContainer);
                }

                removeClass(this.panel, this.clsSidebarAnimation, this.clsMode);
                removeClass(this.$el, this.clsOverlay, this.clsResponsive);
                css(this.$el, 'display', '');
                removeClass(document.body, this.clsContainer, this.clsFlip);

                css(document.documentElement, 'overflowY', '');
                
                trigger(this.$el, 'relayout');
            }
        },

        {
            name: 'swipeLeft swipeRight',

            handler(e) {
                if (!this.swipeClose || this.mode === 'sidebar') return;
                if (this.isToggled() && endsWith(e.type, 'Left') ^ this.flip) {
                    this.hide();
                }
            }
        }

    ]

};

// Chrome in responsive mode zooms page upon opening offcanvas
function suppressUserScale() {
    getViewport().content += ',user-scalable=0';
}

function resumeUserScale() {
    const viewport = getViewport();
    viewport.content = viewport.content.replace(/,user-scalable=0$/, '');
}

function getViewport() {
    return $('meta[name="viewport"]', document.head) || append(document.head, '<meta name="viewport">');
}
