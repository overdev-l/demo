import { Canvas, Group, Rect, util } from "fabric";

export class Animate {
    private _maxOpacity: number = 0.8;
    private _minOpacity: number = 0.2;
    private _opacity: number = 0.2;
    private _animateId: number | null = null;
    private _loading_element: Rect | null = null;
    private _speed: number = 0.03;
    private _top: boolean = true;
    
    constructor(private FC: Canvas, private _element: Group) {
        this._loading_element = this._element.getObjects()
                                .find((obj) => obj._loading_element_) as Rect | null;
    }

    public run = () => {
        const isLoading = this._element.get('_loading_');
        if (!isLoading) {
            this._cancelAnimate();
            return;
        }
        
        if (!this._animateId) {
            this._startAnimate();
            // util.animate({
            //     startValue: 0,
            //     endValue: 1,
            //     onChange: (value) => {
            //         console.log(value);
            //         this._element.set('opacity', value);
            //         this.FC.renderAll();
            //     },
            //     onComplete: () => {
            //         console.log('complete');
            //     }
            // })
        }
    }

    private _startAnimate = () => {
        this._animateId = util.requestAnimFrame(() => {
            this._animate();
            this._startAnimate();
        });
    }

    private _animate = () => {
        if (this._top) {
            this._opacity += this._speed;
        } else {
            this._opacity -= this._speed;
        }
        if (this._opacity >= this._maxOpacity) {
            this._top = false;
        } else if (this._opacity <= this._minOpacity) {
            this._top = true;
        }
        this._loading_element?.set('opacity', this._opacity);
        this.FC.requestRenderAll();
    }

    private _cancelAnimate = () => {
        if (this._animateId) {
            util.cancelAnimFrame(this._animateId);
            this._animateId = null;
        }
        if (this._loading_element) {
            this._element.remove(this._loading_element);
        }
        this._element.set('_loading_', false);
    }
}