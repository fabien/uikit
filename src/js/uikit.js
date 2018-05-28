import boot from './api/boot';
import custom from './custom';
import UIkit from './uikit-core';
import Countdown from './components/countdown';
import Filter from './components/filter';
import Lightbox from './components/lightbox';
import lightboxPanel from './components/lightbox-panel';
import Notification from './components/notification';
import Parallax from './components/parallax';
import Slider from './components/slider';
import SliderParallax from './components/slider-parallax';
import Slideshow from './components/slideshow';
import Sortable from './components/sortable';
import Tooltip from './components/tooltip';
import Upload from './components/upload';
import View from './components/view';
import Ratio from './core/ratio';

UIkit.component('countdown', Countdown);
UIkit.component('filter', Filter);
UIkit.component('lightbox', Lightbox);
UIkit.component('lightboxPanel', lightboxPanel);
UIkit.component('notification', Notification);
UIkit.component('parallax', Parallax);
UIkit.component('slider', Slider);
UIkit.component('sliderParallax', SliderParallax);
UIkit.component('slideshow', Slideshow);
UIkit.component('slideshowParallax', SliderParallax);
UIkit.component('sortable', Sortable);
UIkit.component('tooltip', Tooltip);
UIkit.component('upload', Upload);
UIkit.component('ratio', Ratio);
UIkit.component('view', View);

if (BUNDLED) {
    custom(UIkit);
    boot(UIkit);
}

export default UIkit;
