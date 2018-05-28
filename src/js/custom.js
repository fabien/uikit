import Animations from './components/internal/slideshow-animations';
import Transitioner from './mixin/internal/slideshow-transitioner';

export default function (UIkit) {
    UIkit.plugins = UIkit.plugins || {};
    UIkit.plugins.Animations = Animations;
    UIkit.plugins.Transitioner = Transitioner;
}
