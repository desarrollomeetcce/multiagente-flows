'use server'
import { cookies } from "next/headers";

const BASE_URL = process.env.PULPOCENTRAL_API_URL;

type FetchOptions = RequestInit & {
    auth?: boolean;
};

export async function pulpoFetch<T>(
    endpoint: string,
    options: FetchOptions = {}
): Promise<T> {
    const cookieStore = cookies();
    const token = (await cookieStore).get("token2")?.value;

    const headers = new Headers(options.headers);

    headers.set("Content-Type", "application/json");

    if (options.auth !== false && token) {
        headers.set("pulpocentral-access-token", token);
    }
    console.log(`${BASE_URL}${endpoint}`)
    const res = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers,
        cache: "no-store",
    });

    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Error al consumir PulpoCentral");
    }

    return res.json();
}
