"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

export default function Index() {
  const workerRef = useRef<Worker>();
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(true);
  const [hidden, setHidden] = useState(false);

  type UncompressMessage = {
    action: "uncompress_each" | "error" | "ready";
    file_name: string;
    url: string;
    index: number;
    size: number;
  };

  useEffect(() => {
    workerRef.current = new Worker(
      new URL("../lib/worker.js", import.meta.url)
    );
    workerRef.current.onmessage = (e: MessageEvent<UncompressMessage>) => {
      switch (e.data.action) {
        case "uncompress_each":
          const file_name = e.data.file_name;
          const url = e.data.url;
          const index = e.data.index;

          // add the image to the page
          const img = document.createElement("img");
          img.src = url;
          img.alt = file_name;
          img.id = `image-${index}`;
          if (index > 3) {
            img.loading = "lazy";
          }

          const images = document.getElementById("images");
          img.classList.add("w-full");
          images?.appendChild(img);
          break;
        case "error":
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
      alert("Invalid file type");
      return;
    }

    const blob = file.slice();
    const file_name = file.name;

    // Convert the blob into an array buffer
    const reader = new FileReader();
    reader.onload = function () {
      const array_buffer = reader.result;

      // Send the file name and array buffer to the web worker
      const message = {
        action: "uncompress_start",
        file_name: file_name,
        array_buffer: array_buffer,
      };

      workerRef.current?.postMessage(message);
    };
    reader.readAsArrayBuffer(blob);

    setHidden(true);
  };

  return (
    <div className="grid grid-rows-[0px_1fr_0px] items-center justify-items-center min-h-screen p-1 sm:p-10 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
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
          className={hidden ? "hidden" : ""}
          onClick={(e) => {
            e.stopPropagation();
            inputRef.current?.click();
          }}
        >
          Select File
        </Button>
        <div
          id="images"
          className={`flex flex-col justify-center max-w-screen-lg gap-1 ${
            !hidden ? "hidden" : ""
          } `}
        ></div>
      </main>
    </div>
  );
}
