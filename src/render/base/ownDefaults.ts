import { InteractiveFabricObject, FabricObject, LayoutManager, FixedLayout } from 'fabric';
import { ElementName } from '../utils';

const TopRightAndButtonLeftCursor = `url('/src/assets/right-left.svg') 8 8, auto`;
const TopLeftAndButtonRightCursor = `url('/src/assets/left-right.svg') 8 8, auto`;
const visibleControls = {
  mtr: false,
  ml: false,
  mr: false,
  mt: false,
  mb: false,
};
const setBaseControlsCursor = () => {
  const controls = FabricObject.createControls().controls;
  controls.bl.cursorStyleHandler = (_eventData, _control, _fabricObject) => {
    return TopRightAndButtonLeftCursor;
  };
  controls.tr.cursorStyleHandler = (_eventData, _control, _fabricObject) => {
    return TopRightAndButtonLeftCursor;
  };
  controls.tl.cursorStyleHandler = (_eventData, _control, _fabricObject) => {
    return TopLeftAndButtonRightCursor;
  };
  controls.br.cursorStyleHandler = (_eventData, _control, _fabricObject) => {
    return TopLeftAndButtonRightCursor;
  };
  Object.keys(visibleControls).forEach((key) => {
    controls[key].visible =
      visibleControls[key as keyof typeof visibleControls];
  });
  return controls;
};

InteractiveFabricObject.ownDefaults = {
  ...InteractiveFabricObject.ownDefaults,
  cornerStyle: 'rect',
  cornerSize: 6,
  cornerStrokeColor: '#5C8FFF',
  cornerColor: 'rgb(229, 229, 229)',
  lockRotation: true,
  padding: 0,
  transparentCorners: false,
  borderColor: '#5C8FFF',
  borderScaleFactor: 1,
  borderOpacityWhenMoving: 1,
  controls: setBaseControlsCursor(),
};

export const propertiesToInclude = [
  '_name_',
  '_id_',
  '_old_prompt_',
  '_new_prompt_',
  '_message_id_',
  '_loading_',
  '_parent_',
  'type',
];


export const baseProperties = {
    _id_: '',
    _parent_: null,
    _name_: '',
    _loading_element_: false,
    _loading_: false,
    _message_id_: '',
    _old_prompt_: '',
    _new_prompt_: '',
}

export const ImageProperties = {
    ...baseProperties,
    subTargetCheck: false,
    _name_: ElementName.IMAGE,
}

export const LoadingGroupProperties = {
    ...baseProperties,
    _name_: ElementName.LOADING_GROUP,
    _loading_element_: true,
}

export const LoadingRectProperties = {
    ...baseProperties,
    _name_: ElementName.LOADING_RECT,
    _loading_element_: true,
}

export const LoadingTextProperties = {
    ...baseProperties,
    _name_: ElementName.LOADING_TEXT,
    _loading_element_: true,
}

// 新元素的偏移量
export const newElementOffset = 10;