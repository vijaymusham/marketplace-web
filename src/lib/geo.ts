/** Geographic center of India — used until the user picks a location. */
export const DEFAULT_INDIA_LOCATION = {
    latitude: 20.5937,
    longitude: 78.9629,
} as const;

export type GeoCoords = {
    latitude: number;
    longitude: number;
};

export function resolveCoords(location?: GeoCoords | null): GeoCoords {
    const latitude = location?.latitude;
    const longitude = location?.longitude;
    if (typeof latitude === "number" && typeof longitude === "number") {
        return { latitude, longitude };
    }
    return {
        latitude: DEFAULT_INDIA_LOCATION.latitude,
        longitude: DEFAULT_INDIA_LOCATION.longitude,
    };
}

type GoogleGeocoder = {
    geocode: (
        request: { placeId?: string; address?: string },
        callback: (
            results: Array<{
                geometry?: { location?: { lat: () => number; lng: () => number } };
            }> | null,
            status: string,
        ) => void,
    ) => void;
};

export async function geocodePlace(address: string, placeId?: string): Promise<GeoCoords | null> {
    const Geocoder = (
        globalThis as { google?: { maps?: { Geocoder?: new () => GoogleGeocoder } } }
    ).google?.maps?.Geocoder;

    if (Geocoder) {
        const coords = await new Promise<GeoCoords | null>((resolve) => {
            new Geocoder().geocode(
                placeId ? { placeId } : { address },
                (results, status) => {
                    const loc = results?.[0]?.geometry?.location;
                    if (status === "OK" && loc) {
                        resolve({ latitude: loc.lat(), longitude: loc.lng() });
                        return;
                    }
                    resolve(null);
                },
            );
        });
        if (coords) return coords;
    }

    try {
        const res = await fetch(
            `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(address)}&limit=1`,
        );
        const data: Array<{ lat?: string; lon?: string }> = await res.json();
        if (data[0]?.lat && data[0]?.lon) {
            return {
                latitude: Number(data[0].lat),
                longitude: Number(data[0].lon),
            };
        }
    } catch {
        return null;
    }
    return null;
}
