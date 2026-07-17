import Image from "next/image";

export default function BannerSection() {
    return (
        <section className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
            <div className="relative isolate flex min-h-85 flex-col justify-end overflow-hidden rounded-3xl">
                <Image
                    src="https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/portal/m/seo/App_download_banner.png"
                    alt="Seller packing an order to ship"
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover"
                />

            </div>
        </section>
    );
}
