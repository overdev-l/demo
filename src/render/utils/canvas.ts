import { Canvas, Point, FabricObject, TPointerEvent } from "fabric";

/**
 * 将画布中当前选中的元素居中显示在屏幕中间
 * @param {Canvas} canvas -  画布实例
 * @param {FabricObject} activeObject - 当前选中的元素
 * @param {number} duration - 动画持续时间(ms)
 */
export function centerSelectedObject(canvas: Canvas, activeObject: FabricObject, duration = 500) {
    // 获取当前选中的对象
    const activeObjectCenter = activeObject.getCenterPoint();
    const canvasZoom = canvas.getZoom();
    const canvasWidth = canvas.getWidth();
    const canvasHeight = canvas.getHeight();
    const canvasCenter = new Point(canvasWidth / 2, canvasHeight / 2);
    const panX = (activeObjectCenter.x * canvasZoom - canvasCenter.x);
    const panY = (activeObjectCenter.y * canvasZoom - canvasCenter.y);
    
    // 使用动画移动到目标位置
    const currentPan = canvas.viewportTransform ? {
        x: canvas.viewportTransform[4],
        y: canvas.viewportTransform[5]
    } : { x: 0, y: 0 };

    const startTime = Date.now();

    const animate = () => {
        const now = Date.now();
        const progress = Math.min(1, (now - startTime) / duration);
        
        // 使用缓动函数使动画更平滑
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        
        const currentX = currentPan.x + (panX - currentPan.x) * easeProgress;
        const currentY = currentPan.y + (panY - currentPan.y) * easeProgress;
        
        canvas.absolutePan(new Point(currentX, currentY));
        canvas.requestRenderAll();

        if (progress < 1) {
            requestAnimationFrame(animate);
        }
    };
    animate();
  }

 /**
  * 获取视口内的所有元素
  * @param {Canvas} canvas - 画布实例
  * @returns {Array<FabricObject>} - 视口内的所有元素
  */
 export function getVisibleObjects(canvas: Canvas): Array<FabricObject> {
    const viewportTransform = canvas.viewportTransform || [1, 0, 0, 1, 0, 0];
    const zoom = canvas.getZoom();
    const visibleArea = {
      left: -viewportTransform[4] / zoom,
      top: -viewportTransform[5] / zoom,
      right: (-viewportTransform[4] + canvas.width) / zoom,
      bottom: (-viewportTransform[5] + canvas.height) / zoom,
    };

    return canvas.getObjects().filter((obj) => {
      if (!obj.visible) return false;
  
      const objBoundingBox = obj.getBoundingRect();
  
      return (
        objBoundingBox.left < visibleArea.right &&
        objBoundingBox.top < visibleArea.bottom &&
        objBoundingBox.left + objBoundingBox.width > visibleArea.left &&
        objBoundingBox.top + objBoundingBox.height > visibleArea.top
      );
    });
  }

  /**
   * 判断鼠标是否在对象上
   * @param {Canvas} canvas - 画布实例
   * @param {PointerEvent} event - 鼠标事件
   * @param {FabricObject} targetObject - 目标对象
   * @returns {boolean} - 是否在对象上
   */
  export function isMouseOverObject(canvas: Canvas, event: TPointerEvent, targetObject: FabricObject): boolean {
    const pointer = canvas.getScenePoint(event);
    const boundingBox = targetObject.getBoundingRect();
    return (
      pointer.x >= boundingBox.left &&
      pointer.x <= boundingBox.left + boundingBox.width &&
      pointer.y >= boundingBox.top &&
      pointer.y <= boundingBox.top + boundingBox.height
    );
  }
  
  /**
   * 元素Z轴排序
   * @param {FabricObject[]} elements - 元素数组
   */
  export function sortElementsByZIndex(elements: FabricObject[]): FabricObject[] {
    elements.sort((a, b) => {
      const aIndex = (a as any).zIndex || 0;
      const bIndex = (b as any).zIndex || 0;
      return bIndex - aIndex;
    });
    return elements;
  }