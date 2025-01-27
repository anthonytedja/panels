export type UncompressMessage =
  | {
      action: "uncompress";
      url: string;
      index: number;
      width: number;
      height: number;
      total: number;
    }
  | {
      action: "error";
      error: string;
    }
  | {
      action: "ready";
    };

export type Store = {
  enableSlider: boolean;
};
