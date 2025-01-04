import type { FabricObjectProps as FabricObjectPropsOrigin } from 'fabric/src/shapes/Object/types/FabricObjectProps';

type ReplenishmentFabricObject = {
  _id_: string;
  _name_: string;
  _loading_: boolean;
  _parent_: Canvas | Group;
  _old_prompt_: string;
  _new_prompt_: string;
  _message_id_: string;
  _loading_element_: boolean,
};
export declare module 'fabric' {
  export declare interface FabricObject
    extends ReplenishmentFabricObject,
      FabricObjectPropsOrigin {}
  export declare interface FabricObjectProps
    extends ReplenishmentFabricObject,
      FabricObjectPropsOrigin {}
  export declare interface SerializedObjectProps
    extends ReplenishmentFabricObject,
      SerializedObjectPropsOrigin {
    type: string;
  }
}

export declare namespace fabric {
  export * from 'fabric';
}
