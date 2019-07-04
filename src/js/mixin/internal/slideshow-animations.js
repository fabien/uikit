import {css, isIE} from 'uikit-util';

export default {

    none: {

        duration: 0,

        show() {
            return [{}, {}];
        },

        percent(current) {
            return 1;
        },

        translate(percent) {
            return [{}, {}];
        }

    },

    slide: {

        show(dir) {
            return [
                {transform: translate(dir * -100)},
                {transform: translate()}
            ];
        },

        percent(current) {
            return translated(current);
        },

        translate(percent, dir) {
            return [
                {transform: translate(dir * -100 * percent)},
                {transform: translate(dir * 100 * (1 - percent))}
            ];
        }

    },
    
    vertical: {
        
        show(dir) {
            return [
                {transform: translateY(dir * -100)},
                {transform: translateY()}
            ];
        },

        percent(current) {
            return translatedY(current);
        },

        translate(percent, dir) {
            return [
                {transform: translateY(dir * -100 * percent)},
                {transform: translateY(dir * 100 * (1 - percent))}
            ];
        }
        
    }

};

export function translated(el) {
    return Math.abs(css(el, 'transform').split(',')[4] / el.offsetWidth) || 0;
}

export function translate(value = 0, unit = '%') {
    value += value ? unit : '';
    return isIE ? `translateX(${value})` : `translate3d(${value}, 0, 0)`; // currently not translate3d in IE, translate3d within translate3d does not work while transitioning
}

export function scale3d(value) {
    return `scale3d(${value}, ${value}, 1)`;
}

export function translatedY(el) {
    return Math.abs(css(el, 'transform').split(',')[5] / el.offsetHeight) || 0;
}

export function translateY(value = 0, unit = '%') {
    value += value ? unit : '';
    return isIE ? `translateY(${value})` : `translate3d(0, ${value}, 0)`; // currently not translate3d in IE, translate3d within translate3d does not work while transitioning
}
