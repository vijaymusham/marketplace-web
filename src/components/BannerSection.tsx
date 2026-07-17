import { Check, Percent, ShieldCheck, ArrowRight, Handshake } from "lucide-react";

export default function BannerSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Left banner */}
        <div className="rounded-2xl bg-[#F1EFFC] p-6 sm:p-8">
          <h2 className="font-heading text-2xl leading-tight font-extrabold text-slate-900 sm:text-3xl">
            SELL <span className="text-primary">WITH</span> ZERO
            <br />
            <span className="text-primary">COMMISSION</span>
          </h2>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <Percent className="h-5 w-5 text-primary" />
              </span>
              <span className="font-heading text-lg font-extrabold text-slate-900">
                0% FEES
              </span>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <ShieldCheck className="h-5 w-5 text-primary" />
              </span>
              <span className="font-heading text-lg font-extrabold text-slate-900">
                VERIFIED USERS
              </span>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-8">
            {[
              "0% Listing Fee",
              "0% Commission Fee*",
              "0% Hidden Charges",
            ].map((item) => (
              <span
                key={item}
                className="flex items-center gap-2 text-sm font-bold text-slate-700"
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100">
                  <Check className="h-3.5 w-3.5 text-green-600" />
                </span>
                {item}
              </span>
            ))}
          </div>
          <p className="mt-3 text-center text-xs text-slate-500">
            *T&amp;C Apply.
          </p>
        </div>

        {/* Right banner */}
        <div className="relative flex flex-col justify-between overflow-hidden rounded-2xl bg-linear-to-br from-teal-50 to-cyan-100 p-6 sm:p-8">
          <div className="relative z-10 max-w-sm">
            <h2 className="font-heading text-3xl leading-tight font-extrabold text-teal-900 sm:text-4xl">
              SAFE
              <br />
              TRADE ZONE
            </h2>
            <p className="mt-3 text-sm text-teal-800/80">
              Meet, inspect and pay securely with buyer &amp; seller
              protection built in.
            </p>
            <button className="mt-6 flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-800">
              Explore now
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <span className="absolute -right-6 -bottom-6 flex h-40 w-40 items-center justify-center rounded-full bg-white/40 sm:h-48 sm:w-48">
            <Handshake
              className="h-20 w-20 text-teal-700/70 sm:h-24 sm:w-24"
              strokeWidth={1.25}
            />
          </span>
        </div>
      </div>
    </section>
  );
}
