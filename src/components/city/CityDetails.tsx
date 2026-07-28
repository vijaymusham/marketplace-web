'use client'

import { ArrowLeft, ChevronRight, MapPin } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useParams, useSearchParams } from 'next/navigation'
import type { ApiAd, ApiCategoryAds, ApiCity } from '../types/AllTypes'
import { getCategoriesAds } from '../api/apis'
import { useQuery } from '@tanstack/react-query'
import PaginatedListings from '../category-ui/PaginatedListings'

function cityFromSearchParams(
    searchParams: URLSearchParams,
): ApiCity | null {
    const id = searchParams.get('id')
    const name = searchParams.get('name')
    if (!id || !name) return null

    return {
        id,
        stateId: searchParams.get('stateId') ?? '',
        name,
        imageUrl: searchParams.get('imageUrl') ?? '',
        latitude: Number(searchParams.get('latitude')) || 0,
        longitude: Number(searchParams.get('longitude')) || 0,
        distanceKm: Number(searchParams.get('distanceKm')) || 0,
        distanceLabel: searchParams.get('distanceLabel') ?? '',
    }
}

function adsFromResponse(payload: ApiCategoryAds | { items?: ApiAd[] } | null | undefined): ApiAd[] {
    if (!payload) return []
    if ('items' in payload && Array.isArray(payload.items)) return payload.items
    if ('data' in payload && Array.isArray(payload.data?.items)) return payload.data.items
    return []
}

const CityDetails = () => {
    const params = useParams<{ slug: string }>()
    const searchParams = useSearchParams()
    const city = cityFromSearchParams(searchParams)
    const slug = String(params.slug ?? '')

    const { data: categoryAds } = useQuery({
        queryKey: ['cityAds', city?.id],
        queryFn: () => getCategoriesAds({
            cityId: city!.id,
            categoryId: '',
            subCategoryId: '',
            latitude: city!.latitude,
            longitude: city!.longitude,
        }),
        enabled: Boolean(city?.id),
    })

    const listings = adsFromResponse(categoryAds)

    if (!city) {
        return (
            <main className="flex-1 bg-white">
                <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                    <p className="text-sm font-medium text-slate-500">
                        City not found{slug ? ` for “${slug}”` : ''}.
                    </p>
                    <Link
                        href="/"
                        className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to home
                    </Link>
                </div>
            </main>
        )
    }

    return (
        <main className="flex-1 bg-white">
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 md:py-10 lg:px-8">
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 transition-colors hover:text-primary"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back
                    </Link>

                    <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-sm font-medium">
                        <Link href="/" className="text-slate-400 transition-colors hover:text-primary">
                            Home
                        </Link>
                        <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
                        <span className="font-semibold text-slate-900">{city.name}</span>
                    </nav>
                </div>

                <header className="mb-8 md:mb-10">
                    <div className="relative aspect-16/10 overflow-hidden rounded-2xl bg-slate-100 sm:aspect-21/9 sm:rounded-[1.75rem] md:aspect-3/1">
                        <Image
                            src={city.imageUrl || '/images/city-placeholder.png'}
                            alt={`${city.name} cityscape`}
                            fill
                            priority
                            sizes="(min-width: 1280px) 1280px, 100vw"
                            className="object-cover"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent" />
                        <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8">
                            {city.distanceLabel && (
                                <p className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
                                    <MapPin className="h-3.5 w-3.5" />
                                    {city.distanceLabel}
                                </p>
                            )}
                            <h1 className="mt-3 font-heading text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl">
                                Deals in {city.name}
                            </h1>
                        </div>
                    </div>
                </header>

                <PaginatedListings listings={listings} />
            </div>
        </main>
    )
}
export default CityDetails
