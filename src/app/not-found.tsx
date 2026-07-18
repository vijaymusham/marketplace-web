import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
    return (
        <main className="relative flex-1 bg-white px-4 pb-8 pt-6 sm:px-6 sm:pb-16 sm:pt-8 lg:px-8">
            <section className="relative mx-auto max-w-6xl overflow-hidden rounded-4xl bg-white sm:rounded-[2.5rem] lg:overflow-visible">
                <div className="relative grid items-center gap-6 px-8 py-12 sm:px-12 sm:py-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-2 lg:px-14 lg:py-17">
                    <div className="relative z-10 max-w-lg">
                        <h1 className="font-heading text-[4.75rem] leading-[0.9] font-extrabold tracking-tight text-slate-200 sm:text-[6.75rem] lg:text-[10rem]">
                            404.
                        </h1>

                        <p className="mt-5 text-[1.75rem] font-bold tracking-tight text-black sm:text-4xl lg:text-[2.65rem] lg:leading-[1.15]">
                            Page{" "}
                            <span className="inline rounded-[0.35rem] text-white bg-primary px-2 py-[0.1em]">
                                not found.
                            </span>
                        </p>

                        <p className="mt-6 max-w-88 text-[0.9375rem] leading-[1.65] text-slate-500 font-medium">
                            The page you&apos;re looking for doesn&apos;t exist or may
                            have been moved. Try heading back home to keep browsing.
                        </p>

                        <Link
                            href="/"
                            className="mt-9 inline-flex items-center justify-center rounded-full bg-black px-8 py-3.5 text-[0.9375rem] font-semibold text-white transition-transform duration-200 hover:scale-[1.03] active:scale-[0.98]"
                        >
                            Go back home
                        </Link>
                    </div>

                    <div className="relative mx-auto aspect-square w-full max-w-md lg:-mb-40 lg:max-w-none lg:translate-x-2">
                        <Image
                            src="/404-plug.png"
                            alt="Unplugged power plug illustration"
                            fill
                            priority
                            className="object-contain object-center"
                            sizes="(max-width: 1024px) 90vw, 480px"
                        />
                    </div>
                </div>
            </section>
        </main>
    );
}
