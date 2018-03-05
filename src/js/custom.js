import AnimationsPlugin from './components/internal/slideshow-animations';
import TransitionerPlugin from './mixin/internal/slideshow-transitioner';

export default function (UIkit) {
    
    UIkit.plugins = UIkit.plugins || {};
    UIkit.plugins.Animations = AnimationsPlugin(UIkit);
    UIkit.plugins.Transitioner = TransitionerPlugin(UIkit);

}
