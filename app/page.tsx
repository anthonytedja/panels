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
  const initialized = useRef(false);
  const workerRef = useRef<Worker>();
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(true);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const ios =
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    const standalone = window.matchMedia("(display-mode: fullscreen)").matches;

    if (!initialized.current && !standalone && ios) {
      initialized.current = true;
      toast("Add Panels to Home Screen", {
        duration: 10000,
        closeButton: true,
        description: (
          <>
            <p>
              Install the app for the best experience & offline viewing support.
            </p>
            <p className="mt-3 flex items-center gap-2">
              Tap on{" "}
              <svg
                width="28"
                height="28"
                viewBox="0 0 800 800"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-blue-700 bg-blue-100 p-0.5 rounded-md"
              >
                <path
                  d="M496 208C489.814 214.186 479.786 214.186 473.6 208L414.142 148.542C406.332 140.732 393.668 140.732 385.858 148.542L326.4 208C320.214 214.186 310.186 214.186 304 208V208C297.814 201.815 297.814 191.786 304 185.6L385.858 103.742C393.668 95.9318 406.332 95.9317 414.142 103.742L496 185.6C502.186 191.786 502.186 201.815 496 208V208Z"
                  fill="currentColor"
                />
                <path
                  d="M384 128C384 119.163 391.163 112 400 112V112C408.837 112 416 119.163 416 128V432C416 440.837 408.837 448 400 448V448C391.163 448 384 440.837 384 432V128Z"
                  fill="currentColor"
                />
                <path
                  d="M560 640H240C212.8 640 192 619.2 192 592V304C192 276.8 212.8 256 240 256H336C344.837 256 352 263.163 352 272V272C352 280.837 344.837 288 336 288H240C230.4 288 224 294.4 224 304V592C224 601.6 230.4 608 240 608H560C569.6 608 576 601.6 576 592V304C576 294.4 569.6 288 560 288H464C455.163 288 448 280.837 448 272V272C448 263.163 455.163 256 464 256H560C587.2 256 608 276.8 608 304V592C608 619.2 587.2 640 560 640Z"
                  fill="currentColor"
                />
              </svg>{" "}
              & select{" "}
              <p className="text-xs text-blue-700 bg-blue-100 py-1.5 px-2.5 rounded-md">
                Add to Home Screen
              </p>
            </p>
          </>
        ),
      });
    }

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
    reader.readAsArrayBuffer(file);
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
      <main className="flex flex-col justify-center text-center max-w-screen-lg">
        {!hidden && (
          <div className="flex flex-col items-center p-6">
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
              Panels
            </h1>
            <p className="leading-7 [&:not(:first-child)]:mt-6">
              A lightweight{" "}
              <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
                .cbr/.cbz/.cbt
              </code>{" "}
              file reader.
            </p>
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
              className={`mt-6 ${loading && "px-2"}`}
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
          </div>
        )}
        <div
          id="images"
          className={`flex flex-col ${!hidden ? "hidden" : ""}`}
        ></div>
        {hidden && (
          <div className="flex justify-center my-10">
            <Button onClick={() => window.location.reload()}>Reset</Button>
          </div>
        )}
      </main>
    </div>
  );
}
