"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

import { toast } from "sonner";
import { Loader2 } from "lucide-react";

type UncompressMessage =
  | {
      action: "uncompress";
      url: string;
      index: number;
      width: number;
      height: number;
    }
  | {
      action: "error";
      error: string;
    }
  | {
      action: "ready";
    };

export default function Page() {
  const workerRef = useRef<Worker>();
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(true);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const images = document.getElementById("images");
    workerRef.current = new Worker(
      new URL("../lib/worker.js", import.meta.url)
    );

    workerRef.current.onmessage = (e: MessageEvent<UncompressMessage>) => {
      switch (e.data.action) {
        case "uncompress":
          const url = e.data.url;
          const index = e.data.index;

          const img = document.createElement("img");
          const id = `image-${index}`;
          img.id = id;
          img.alt = id;
          img.src = url;
          img.width = e.data.width;
          img.height = e.data.height;
          img.style.order = index.toString();

          if (index > 3) {
            img.loading = "lazy";
          } else if (index === 1) {
            setHidden(true);
            setLoading(false);
          }

          images?.appendChild(img);
          break;

        case "error":
          toast.error(e.data.error);
          break;

        case "ready":
          setLoading(false);
          break;
      }
    };
    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  const onFileSelected = async (e: React.FormEvent<HTMLInputElement>) => {
    const file = e.currentTarget?.files?.[0];
    if (!file) return;

    if (inputRef.current) {
      inputRef.current.value = "";
    }

    if (![".cbr", ".cbz", ".cbt"].includes(file.name.slice(-4))) {
      toast.error("Invalid File Type");
      return;
    }

    setLoading(true);

    const reader = new FileReader();
    reader.readAsArrayBuffer(file.slice());
    reader.onload = function () {
      workerRef.current?.postMessage(
        {
          action: "start",
          file_name: file.name,
          array_buffer: reader.result,
        },
        [reader.result as ArrayBuffer]
      );
    };
    reader.onerror = function () {
      toast.error("Error Reading File");
    };
  };

  return (
    <div className="flex justify-center items-center min-h-dvh">
      <main className="flex flex-col justify-center max-w-screen-lg">
        {!hidden && (
          <>
            <input
              type="file"
              tabIndex={-1}
              ref={inputRef}
              onChange={onFileSelected}
              accept=".cbr,.cbz,.cbt"
              hidden
            />
            <Button
              disabled={loading}
              {...(loading && { className: "px-2" })}
              onClick={(e) => {
                e.stopPropagation();
                inputRef.current?.click();
              }}
            >
              {loading ? (
                <Loader2 className="animate-spin [&&]:w-6 [&&]:h-6" />
              ) : (
                "Select File"
              )}
            </Button>
          </>
        )}
        <div
          id="images"
          className={`flex flex-col ${!hidden ? "hidden" : ""}`}
        ></div>
      </main>
    </div>
  );
}
