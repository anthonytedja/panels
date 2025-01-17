"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function Index() {
  const workerRef = useRef<Worker>();
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(true);
  const [hidden, setHidden] = useState(false);

  type UncompressMessage =
    | {
        action: "uncompress";
        url: string;
        index: number;
        total: number;
      }
    | {
        action: "error";
        message: string;
      }
    | {
        action: "ready";
      };

  useEffect(() => {
    const images = document.getElementById("images");
    if (!images) return;

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

          // TODO: Make Dynamic
          img.width = 2200;
          img.height = 3200;

          if (index > 3) {
            img.loading = "lazy";
          } else if (index === 1) {
            setHidden(true);
            setLoading(false);
          }

          images?.appendChild(img);
          break;

        case "error":
          toast.error(e.data.message);
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
    if (!e.currentTarget?.files) return;
    const file = e.currentTarget.files[0];
    if (!file) return;

    if (inputRef.current) {
      inputRef.current.value = "";
    }

    if (![".cbr", ".cbz", ".cbt"].includes(file.name.slice(-4))) {
      toast.error("Invalid File Type");
      return;
    }

    setLoading(true);

    const blob = file.slice();
    const file_name = file.name;

    // Convert the blob into an array buffer
    const reader = new FileReader();
    reader.onload = function () {
      const array_buffer = reader.result;

      // Send the file name and array buffer to the web worker
      const message = {
        action: "start",
        file_name: file_name,
        array_buffer: array_buffer,
      };

      workerRef.current?.postMessage(message);
    };
    reader.readAsArrayBuffer(blob);
  };

  return (
    <div className="grid grid-rows-[0px_1fr_0px] items-center justify-items-center min-h-screen sm:p-10">
      <main className="flex flex-col row-start-2 items-center sm:items-start">
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
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                inputRef.current?.click();
              }}
            >
              {loading ? <Loader2 className="animate-spin" /> : "Select File"}
            </Button>
          </>
        )}
        <div
          id="images"
          className={`flex flex-col justify-center max-w-screen-lg gap-0.5 ${
            !hidden ? "hidden" : ""
          } `}
        ></div>
      </main>
    </div>
  );
}
