import Image from "next/image";
import { Check, ArrowRight } from "lucide-react";

export default function BannerSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Left banner */}
        <div className="relative isolate flex min-h-85 flex-col justify-end overflow-hidden rounded-3xl">
          <Image
            src="https://loremflickr.com/800/600/shipping/all?lock=201"
            alt="Seller packing an order to ship"
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/40 to-black/5" />

          <div className="relative z-10 p-6 sm:p-8">
            <h2 className="font-heading text-2xl leading-tight font-extrabold text-white sm:text-3xl">
              SELL <span className="text-primary">WITH</span> ZERO
              <br />
              <span className="text-primary">COMMISSION</span>
            </h2>

            <div className="mt-5 flex flex-wrap gap-2">
              {["0% Listing Fee", "0% Commission*", "Verified Buyers"].map(
                (item) => (
                  <span
                    key={item}
                    className="flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-sm sm:text-sm"
                  >
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary">
                      <Check className="h-2.5 w-2.5 text-white" />
                    </span>
                    {item}
                  </span>
                ),
              )}
            </div>

            <button className="mt-6 flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-hover">
              Start selling
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Right banner */}
        <div className="relative isolate flex min-h-85 flex-col justify-end overflow-hidden rounded-3xl">
          <Image
            src="https://loremflickr.com/800/600/handshake/all?lock=202"
            alt="Buyer and seller meeting to complete a trade"
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/40 to-black/5" />

          <div className="relative z-10 p-6 sm:p-8">
            <h2 className="font-heading text-2xl leading-tight font-extrabold text-white sm:text-3xl">
              SAFE
              <br />
              TRADE ZONE
            </h2>
            <p className="mt-3 max-w-sm text-sm text-white/80">
              Meet, inspect and pay securely with buyer &amp; seller
              protection built in.
            </p>
            <button className="mt-6 flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 transition-colors hover:bg-white/90">
              Explore now
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
