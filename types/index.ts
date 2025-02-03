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

// Default false when adding new properties
export type Store = {
  seenPWAPrompt?: boolean; // Seen PWA Prompt
  enableSlider?: boolean; // Page Progress Slider
  unboundedWidth?: boolean; // Limit Image Width
};
