"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import PWAPrompt from "@/components/toast/pwa";
import SettingsModal from "@/components/settings";
import { Github, LoaderCircle } from "lucide-react";
import { toast } from "sonner";

import useLocalStorage from "@/hooks/localstorage";
import { Store, UncompressMessage } from "@/types";

export default function Page() {
  const initialized = useRef(false);
  const workerRef = useRef<Worker>();
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(true);
  const [hidden, setHidden] = useState(false);
  const [activeImage, setActiveImage] = useState<number | null>(null);
  const [sliderValue, setSliderValue] = useState(1);
  const [total, setTotal] = useState(0);
  const [enableScrollSpy, setEnableScrollSpy] = useState(false);
  const [fileName, setFileName] = useState("");
  const [store, setStore] = useLocalStorage<Store>("panels-config", {
    enableSlider: false,
    unboundedWidth: false,
  });

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
        description: <PWAPrompt />,
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
          if (index === e.data.total) {
            setEnableScrollSpy(true);
            setTotal(e.data.total);
          }
          break;

        case "error":
          toast.error(e.data.error);
          setLoading(false);
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

  useEffect(() => {
    if (!enableScrollSpy) return;

    const imageElements = document.querySelectorAll("#images img");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const value = parseInt((entry.target as HTMLElement).style.order);
            setSliderValue(value);
            setActiveImage(value);
          }
        });
      },
      {
        rootMargin: "-1px 0px -99% 0px", // -1px Workaround, -100% Breaks Safari
      }
    );

    imageElements.forEach((img) => {
      observer.observe(img);
    });

    return () => {
      observer?.disconnect();
    };
  }, [enableScrollSpy]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeImage === null || !enableScrollSpy) return;

      const imageElements = document.querySelectorAll("#images img");
      let newActiveImage = activeImage;

      if (e.key === "ArrowDown" || e.key === " ") {
        e.preventDefault();
        newActiveImage = Math.min(activeImage + 1, imageElements.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        newActiveImage = Math.max(activeImage - 1, 1);
      }

      const newActiveImageId = `image-${newActiveImage}`;
      const newActiveImageElement = document.getElementById(newActiveImageId);

      if (newActiveImageElement) {
        setSliderValue(newActiveImage);
        setActiveImage(newActiveImage);
        newActiveImageElement.scrollIntoView();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeImage, enableScrollSpy]);

  const onFileSelected = async (e: React.FormEvent<HTMLInputElement>) => {
    const file = e.currentTarget?.files?.[0];
    if (!file) return;

    if (inputRef.current) {
      inputRef.current.value = "";
    }

    if (![".cbr", ".cbz", ".cbt"].includes(file.name.slice(-4).toLowerCase())) {
      toast.error("Invalid File Type");
      return;
    }

    setLoading(true);
    setFileName(file.name);

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

  const onReset = () => {
    const images = document.getElementById("images");
    if (!images) return;
    for (const img of Array.from(images.children)) {
      URL.revokeObjectURL((img as HTMLImageElement).src);
    }
    images.innerHTML = "";
    setHidden(false);
    setEnableScrollSpy(false);
    setTotal(0);
    setFileName("");
    setSliderValue(1);
    setActiveImage(null);
    inputRef.current?.click();
  };

  return (
    <main
      className={`flex flex-col justify-center text-center w-full transition-all duration-500 ${
        store.unboundedWidth ? "max-w-full" : "max-w-screen-xl"
      }`}
    >
      <input
        type="file"
        tabIndex={-1}
        ref={inputRef}
        onChange={onFileSelected}
        accept=".cbr,.cbz,.cbt"
        hidden
      />
      {!hidden && (
        <div className="flex flex-col items-center p-6">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            Panels
          </h1>
          <p className="leading-7 mt-6">
            A lightweight{" "}
            <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
              .cbr/.cbz/.cbt
            </code>{" "}
            file reader.
          </p>
          <Button
            disabled={loading}
            className={`mt-6 ${loading && "px-2"}`}
            onClick={(e) => {
              e.stopPropagation();
              inputRef.current?.click();
            }}
          >
            {loading ? (
              <LoaderCircle className="animate-spin [&&]:w-6 [&&]:h-6" />
            ) : (
              "Open File"
            )}
          </Button>
        </div>
      )}
      <div
        id="images"
        className={`flex flex-col ${!hidden ? "hidden" : ""}`}
      ></div>
      <div className="fixed bottom-4 right-4">
        {hidden ? (
          <SettingsModal
            name={fileName}
            store={store}
            setStore={setStore}
            reset={onReset}
          />
        ) : (
          <Link
            tabIndex={-1}
            aria-label="GitHub"
            href="https://github.com/anthonytedja/panels"
            passHref
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full"
          >
            <Button
              title="GitHub"
              variant="secondary"
              className="px-3 rounded-full bg-secondary/75"
            >
              <Github />
            </Button>
          </Link>
        )}
      </div>
      <div
        className={`fixed flex w-full py-4 px-1.5 top-0 backdrop-blur supports-\[backdrop-filter\]\:bg-background\/60 transition-all duration-500 ${
          !store.enableSlider || activeImage === null || total === 0
            ? "opacity-0 invisible"
            : "opacity-100 visible"
        } ${store.unboundedWidth ? "max-w-full" : "max-w-screen-xl"}`}
      >
        <Slider
          step={1}
          min={1}
          max={total}
          value={[sliderValue]}
          onValueChange={(value) => {
            setSliderValue(value[0]);
          }}
          onValueCommit={(value) => {
            setActiveImage(value[0]);
            const newActiveImageId = `image-${value[0]}`;
            const newActiveImageElement =
              document.getElementById(newActiveImageId);
            if (newActiveImageElement) {
              newActiveImageElement.scrollIntoView();
            }
          }}
        />
      </div>
      {hidden && (
        <>
          <div className="flex justify-center break-words">
            <p className="text-xs bg-muted py-2 px-3 mx-2 border-[1px] border-t-0 border-primary/25 rounded-b-lg">
              {fileName}
            </p>
          </div>
          <div className="flex justify-center mt-8 mb-12">
            <Button onClick={onReset}>Open New File</Button>
          </div>
        </>
      )}
    </main>
  );
}
