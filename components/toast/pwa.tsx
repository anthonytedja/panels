export default function PWAPrompt() {
  return (
    <>
      <p>Install the app for the best experience & offline viewing support.</p>
      <p className="mt-3 flex items-center gap-2">
        Tap on{" "}
        <svg
          width="28"
          height="28"
          viewBox="0 0 800 800"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-primary-foreground bg-primary p-0.5 rounded-md"
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
        <p className="text-xs text-primary-foreground bg-primary py-1.5 px-2.5 rounded-md">
          Add to Home Screen
        </p>
      </p>
    </>
  );
}
