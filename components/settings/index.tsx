import { useState } from "react";
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
  const isDesktop = useMediaQuery("(min-width: 672px)");

  if (isDesktop) {
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
    <div className={cn("flex flex-col gap-4 pt-2", className)}>
      <div className="flex justify-between items-center gap-4">
        <Label htmlFor="slider" className="w-full">
          Page Progress Slider
        </Label>
        <Switch
          id="slider"
          checked={store.enableSlider}
          onCheckedChange={() => {
            setStore({ ...store, enableSlider: !store.enableSlider });
          }}
        />
      </div>
      <Button onClick={reset} variant="secondary" className="mt-2">
        Open New File
      </Button>
    </div>
  );
}
