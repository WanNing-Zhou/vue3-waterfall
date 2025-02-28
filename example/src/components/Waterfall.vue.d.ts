import {
  DefineComponent,
  ComputedRef,
  Ref,
  ComponentOptionsMixin,
  PublicProps,
  ComponentProvideOptions,
  VNodeProps, ComponentCustomProps, AllowedComponentProps,
} from 'vue';

export interface Image {
  src: string;
}

export interface ImagesItem {
  data: Image;
  url: string;
  position: {
    width: number;
    height: number;
    top: number;
    left: number;
  };
  index: number;
  loaded: boolean;
}

export interface Props {
  images?: Image[];
  columnCount?: number;
  columnGap?: number;
  rowGap?: number;
  width?: string | number;
  maxParallelTasks?: number;
  transitionClass?: string;
  observerDelay?: number;
  loadNum?: number;
  showErrorImage?: boolean;
  errorImage?: string;
  loadOverCallback?: () => void;
}

declare function updateImagesPosition(): void;

declare function updateWaterfall(): void;

declare const Waterfall: DefineComponent<Props, {
  updateWaterfall: typeof updateWaterfall;
  updateImagesPosition: typeof updateImagesPosition;
  height: ComputedRef<number>;
  loadedImages: Ref<{
    data: {
      src: string;
    };
    url: string;
    position: {
      width: number;
      height: number;
      top: number;
      left: number;
    };
    index: number;
    loaded: boolean;
  }[], ImagesItem[] | {
    data: {
      src: string;
    };
    url: string;
    position: {
      width: number;
      height: number;
      top: number;
      left: number;
    };
    index: number;
    loaded: boolean;
  }[]>;
  loadedIndex: number;
}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<Props> & Readonly<{}>, {
  images: Image[];
  columnCount: number;
  columnGap: number;
  rowGap: number;
  width: string | number;
  maxParallelTasks: number;
  transitionClass: string;
  observerDelay: number;
  loadNum: number;
  showErrorImage: boolean;
  errorImage: string;
  loadOverCallback: () => void;
}, {}, {}, {}, string, ComponentProvideOptions, false, {
  waterfallRef: HTMLDivElement;
  imgRef: HTMLDivElement[];
}, HTMLDivElement> & {
  new(): {
    $slots: S;
    $props: AllowedComponentProps & ComponentCustomProps & VNodeProps & Props
    exposed: {
      updateWaterfall: () => void
      updateImagesPosition: () => void
      height: ComputedRef<number>
      loadedImages: Ref<ImagesItem[]>
      loadedIndex: number
    },
    $refs: {
      waterfallRef: HTMLDivElement;
      imgRef: HTMLDivElement[];
    };
  };
};

export default Waterfall;


//# sourceMappingURL=Waterfall.vue.d.ts.map