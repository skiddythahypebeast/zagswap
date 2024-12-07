import { getToken } from "next-auth/jwt";
import { notFound } from "next/navigation";
import { type NextRequest, NextResponse } from "next/server";
import { env } from "~/env";

export async function POST(request: NextRequest) {
    const url = new URL(`${env.SERVER_URL}/create_exchange`);
    const token = await getToken({ req: request });

    if (token?.swap_api_key) {
        url.searchParams.append('api_key', token.swap_api_key);
    } else {
        url.searchParams.append('api_key', env.API_KEY_WITH_FEE);
    }

    const contentType = request.headers.get("Content-Type");
    if (contentType !== "application/json") {
    return NextResponse.json({ error: "Something went wrong on the server." }, { status: 500 });
    }

    const response = await fetch(url.toString(), {
        method: 'POST',
        body: request.body,
        headers: { "Content-Type": "application/json" },
        duplex: 'half',
    } as object);

    if (!response.ok) {
        const error = await response.text();
    if (response.status === 404) { notFound(); }
        console.error(`Error response from origin server: ${error}`);
        return NextResponse.json({ error: 'Something went wrong on the server.' }, { status: 500 });
    }

    const data = await response.json() as object;
    return NextResponse.json(data);
}