"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import SellForm from "@/components/sell-drawer/SellForm";

export default function SellFab() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="relative ml-1.5">
        <button
          type="button"
          aria-label="Sell now"
          onClick={() => setOpen(true)}
          className="flex cursor-pointer items-center gap-2 rounded-full border-2 border-white bg-[#ff5a1f] py-1.5 pr-4 pl-1.5 text-sm font-semibold text-white shadow-2xl transition-all duration-200 hover:border-white hover:text-white"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-[#ff5a1f]">
            <Plus className="h-4 w-4" strokeWidth={3} />
          </span>
          <span className="hidden max-w-24 truncate font-semibold md:block">
            Sell Now
          </span>
        </button>
      </div>

      <SellForm open={open} onClose={() => setOpen(false)} />
    </>
  );
}
