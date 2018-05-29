import Animations from './components/internal/slideshow-animations';
import Transitioner from './mixin/internal/slideshow-transitioner';
import mixins from './mixin/index';

export default function (UIkit) {
    UIkit.mixins = mixins;
    UIkit.plugins = UIkit.plugins || {};
    UIkit.plugins.Animations = Animations;
    UIkit.plugins.Transitioner = Transitioner;
}
