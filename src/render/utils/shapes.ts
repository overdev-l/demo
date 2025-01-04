import { nanoid } from 'nanoid';
import { ElementName } from './enum';
import { ImageProperties, LoadingRectProperties, newElementOffset } from '../base/ownDefaults';
import {
  Group,
  LayoutManager,
  GroupProps,
  FabricImage,
  FixedLayout,
  FabricObject,
  Canvas,
  ImageProps,
  TextProps,
  IText,
  Rect,
} from 'fabric';

/**
 * 创建Frame元素
 * @param parent 父级元素
 * @param params 画布参数
 * @returns Frame元素
 */
export const createFrame = (
  parent: FabricObject | Canvas,
  params: Partial<GroupProps> & Record<string, any>
) => {
  const frame = new Group([]);
  frame.set({
    ...params,
    layoutManager: new LayoutManager(new FixedLayout()),
    _name_: ElementName.FRAME,
    _id_: nanoid(),
    _parent_: parent,
    _loading_: false,
    _old_prompt_: '',
    _new_prompt_: '',
    _message_id_: '',
  });
  return frame;
};
/**
 * 创建图片元素
 * @param parent 父级元素
 * @param params 图片参数
 * @returns 图片元素
 */
export const createImage = (
  parent: FabricObject | Canvas,
  params: Partial<ImageProps> & Record<string, any>
): Promise<Group> =>
  new Promise((resolve, reject) => {
    const image = new Image(params.src);
    image.onload = () => {
      const img = new FabricImage(image, {
        width: params.width || image.width,
        height: params.height || image.height,
      });
      const options = Object.assign(ImageProperties, params);
      const group = new Group([img], {
        ...options,
        _id_: nanoid(),
        _parent_: parent,
        width: params.width || image.width,
        height: params.height || image.height,
        layoutManager: new LayoutManager(new FixedLayout()),
      });
      resolve(group);
    };
    image.onerror = (e) => reject(e);
    image.src = params.src;
  });
/**
 * 创建文本元素
 * @param parent 父级元素
 * @param params 文本参数
 * @returns 文本元素
 */
export const createText = (
  parent: FabricObject | Canvas,
  params: Partial<TextProps> & Record<string, any>
) => {
  const text = new IText(params.text);
  text.set({
    ...params,
    _parent_: parent,
    _id_: nanoid(),
    _loading_: false,
    editable: true,
    _name_: ElementName.TEXT,
    _old_prompt_: '',
    _new_prompt_: '',
    _message_id_: '',
  });
  return text;
};

/**
 * 创建加载元素
 * @param parent 父级元素
 * @returns 加载元素
 */
export const createLoading = (canvas: Canvas, parent: Group) => {
    const parentWidth = parent.width ?? parent.getBoundingRect().width;
  const parentHeight = parent.height ?? parent.getBoundingRect().height;

  if (!parentWidth || !parentHeight) {
    console.error("Parent group width or height is not set.");
    return null;
  }
  const rect = new Rect({
    ...LoadingRectProperties,
    _id_: nanoid(),
    _parent_: parent,
    width: parentWidth,
    height: parentHeight,
    fill: "rgb(0, 0, 0)",
    left: parent.getX(),
    top: parent.getY(),
  });
  rect.set({
    _parent_: parent,
  });
  parent.add(rect);
  canvas.renderAll()
  return rect;
}



/**
 * 获取元素的属性
 * @param {FabricObject} element 
 */
export const getElementOptions = (element: Group) => {
    switch (element._name_) {
        case ElementName.TEXT:
            return element.toObject();
        case ElementName.IMAGE:
            return {
                ...getImageOptions(element.getObjects().find((obj) => obj.type === 'image') as FabricImage),
                ...getImageCustomOptions(element),
            };
        case ElementName.GROUP:
            return element.toObject();
    }
}

/**
 * 获取图片的属性
 * @param {FabricImage} element 
 */
export const getImageOptions = (element: FabricImage) => {
    const boundingRect = element.getBoundingRect();
    const sourceObject = element.toObject();
    return {
        ...boundingRect,
        src: sourceObject.src,
        left: boundingRect.left + newElementOffset,
        top: boundingRect.top + newElementOffset,
    }
}
/**
 * 获取图片的自定义属性, 基于外层的Group进行获取
 * @param {Group} element 
 */
export const getImageCustomOptions = (element: Group) => {
    const boundingRect = element.getBoundingRect(); 
    return {
        left: boundingRect.left + newElementOffset,
        top: boundingRect.top + newElementOffset,
        width: boundingRect.width,
        height: boundingRect.height,
        angle: element.angle,
        _parent_: element._parent_,
        _name_: element._name_,
        _loading_element_: element._loading_element_,
        _loading_: element._loading_,
        // TODO: 复制元素是否要复制任务？
        _message_id_: '',
        _old_prompt_: '',
        _new_prompt_: '',
    }
}


export const createElement = async (options: any) => {
    if (options._name_ === ElementName.IMAGE) return await createImage(options._parent_, options);
    if (options._name_ === ElementName.TEXT) return await createText(options._parent_, options);
    if (options._name_ === ElementName.FRAME) return await createFrame(options._parent_, options);
    // if (options._name_ === ElementName.GROUP) return await createGroup(options._parent_, options);
}