import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import useMediaQuery from "@/hooks/mediaquery";
import { Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { Store } from "@/types";

type Props = {
  name?: string;
  store: Store;
  setStore: (store: Store) => void;
  reset: () => void;
};

export default function SettingsModal(props: Props) {
  const { name, store, setStore, reset } = props;
  const [open, setOpen] = useState(false);
  const md = useMediaQuery("(min-width: 672px)");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "s") {
        e.preventDefault();
        setOpen((prevOpen) => !prevOpen);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  if (md) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            title="Settings"
            variant="secondary"
            className="px-3 rounded-full bg-secondary/75"
          >
            <Settings />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Settings</DialogTitle>
            <DialogDescription>Currently Viewing: {name}</DialogDescription>
          </DialogHeader>
          <Body store={store} setStore={setStore} reset={reset} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen} setBackgroundColorOnScale>
      <DrawerTrigger asChild>
        <Button
          title="Settings"
          variant="secondary"
          className="px-3 rounded-full bg-secondary/75"
        >
          <Settings />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Settings</DrawerTitle>
          <DrawerDescription>Currently Viewing: {name}</DrawerDescription>
        </DrawerHeader>
        <Body
          store={store}
          setStore={setStore}
          reset={reset}
          className="px-4 pb-16"
        />
      </DrawerContent>
    </Drawer>
  );
}

function Body(props: Props & React.ComponentProps<"div">) {
  const { store, setStore, reset, className } = props;

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <Button onClick={reset} variant="secondary">
        Open New File
      </Button>
      <hr className="border-t border-secondary" />
      <div className="flex justify-between items-center gap-2">
        <Label htmlFor="enable-slider" className="w-full cursor-pointer">
          Page Progress Slider
        </Label>
        <Switch
          id="enable-slider"
          checked={store.enableSlider}
          onCheckedChange={() => {
            setStore({ ...store, enableSlider: !store.enableSlider });
          }}
        />
      </div>
      <div className="flex justify-between items-center gap-2">
        <Label htmlFor="limit-width" className="w-full cursor-pointer">
          Unlimit Image Width (Desktop)
        </Label>
        <Switch
          id="limit-width"
          checked={store.unboundedWidth}
          onCheckedChange={() => {
            setStore({ ...store, unboundedWidth: !store.unboundedWidth });
          }}
        />
      </div>
      <hr className="border-t border-secondary" />
      <div>
        <h3 className="text-sm font-semibold mb-4">Keyboard Shortcuts</h3>
        <ul className="text-sm font-medium flex flex-col gap-3">
          <li>
            <Command>Arrow Down</Command> or <Command>Space</Command> : Next
            Page
          </li>
          <li>
            <Command>Arrow Up</Command> : Prev Page
          </li>
          <li>
            <Command>S</Command> : Show / Hide Settings
          </li>
        </ul>
      </div>
    </div>
  );
}

function Command({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded bg-muted px-[0.4rem] py-[0.2rem] font-mono text-xs">
      {children}
    </code>
  );
}
