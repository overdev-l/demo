import * as fabric from 'fabric';
import './base/ownDefaults';
import { getContainer } from './utils/dom';
import { Wheel } from './base/wheel';
import { MouseStyle } from './base/mouseStyle';
import { Event } from './base/event';
import { centerSelectedObject } from './utils/canvas';
import { Plugin } from './base/types';
import { FabricObject, Group } from 'fabric';
import { Animate, createLoading } from './utils';
type CoreOptions = {
    container: string;
};

export class Render extends Event {
    private _canvas!: HTMLCanvasElement;
    private _container!: {
        element: HTMLElement;
        width: number;
        height: number;
    };
    private _plugins: Map<string, Plugin> = new Map();
    public _FC!: fabric.Canvas;
    private _ResizeObserver!: ResizeObserver;
    private _Wheel!: Wheel;
    private _MouseStyle!: MouseStyle;
    private _loadingEls: Map<string, Animate> = new Map();
    constructor(private options: CoreOptions) {
        super();
        this.init();
    }
    private init = () => {
        this._canvas = document.createElement('canvas');
        this._canvas.style.position = 'absolute';
        this._canvas.style.top = '0';
        this._canvas.style.left = '0';
        this._container = getContainer(this.options.container);
        this._container.element.style.position = 'relative';
        this._container.element.appendChild(this._canvas);
        this._FC = new fabric.Canvas(this._canvas, {
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
            interactive: true,
            isDrawingMode: false,
            preserveObjectStacking: true,
            enableRetinaScaling: true,
            renderOnAddRemove: true,
        });
        this.setCanvasSize();
        this.initResizeObserver();
        this._Wheel = new Wheel(this._FC);
        this._MouseStyle = new MouseStyle(this._FC);
    };

    private setCanvasSize = () => {
        this._container = getContainer(this.options.container);
        this._FC.setDimensions({
            width: this._container.width,
            height: this._container.height,
        });
    };

    private initResizeObserver = () => {
        this._ResizeObserver = new ResizeObserver(() => {
            this.setCanvasSize();
        });
        this._ResizeObserver.observe(this._container.element);
    };

    public unmount = () => {
        this._plugins.forEach((plugin) => {
            plugin.__destroy__();
        });
        this._plugins.clear();
        this._ResizeObserver.disconnect();
        this._FC.dispose();
    };

    public add = (...elements: FabricObject[]) => {
        this._FC.add(...elements);
        this._FC.requestRenderAll();
    };

    /**
     * 使用插件
     * @param plugin 插件
     */
    public use = (plugin: Plugin) => {
        const name = plugin.__name__;
        if (this._plugins.has(name)) {
            this._plugins.get(name)?.__destroy__();
        }
        this._plugins.set(name, plugin);
        return this;
    };
    /**
     * 卸载插件
     * @param name 插件名称
     */
    public unuse = (name: string) => {
        this._plugins.get(name)?.__destroy__();
        this._plugins.delete(name);
    };
    /**
     *  定位元素至画布中心
     * @param duration 动画持续时间(ms)
     */
    public backToOriginPosition = (duration?: number) => {
        const activeObject = this._FC.getActiveObject();
        if (activeObject) {
            centerSelectedObject(this._FC, activeObject, duration);
        } else {
            // TODO: 最后一次生成的元素
        }
    };

    /**
     * 设置元素为加载中
     * @param els 元素
     */
    public setLoading = (...els: string[]) => {
        const elements = els.map((el) => this._FC.getObjects().find((obj) => obj._id_ === el)) as Group[];
        elements.forEach((el) => {
            if (el) {
                el.set('_loading_', true);
                const loading = createLoading(this._FC, el);
                if (loading) {
                    const animate = new Animate(this._FC, el);
                    animate.run();
                    this._loadingEls.set(el._id_, animate);
                    this._FC.requestRenderAll();
                }
            }
        });
    };
    /**
     * 设置元素为加载完成
     * @param els 元素
     */
    public setLoaded = (...els: string[]) => {
        const elements = els.map((el) => this._FC.getObjects().find((obj) => obj._id_ === el));
        elements.forEach((el) => {
            if (el) {
                el.set('_loading_', false);
                const id = el._id_;
                if (this._loadingEls.has(id)) {
                    this._loadingEls.get(id)?.run();
                    this._loadingEls.delete(id);
                }
            }
        });
    };
    /**
     * 获取加载中的元素
     * @returns 加载中的元素
     */
    public getLoadingElsByIds = () => {
        return Array.from(this._loadingEls.keys());
    };
}
