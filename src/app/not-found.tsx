"use client"

import { useRouter } from "next/navigation"

export default function NotFound() {
    const router = useRouter();
    return (
        <div className="min-h-screen w-full h-full flex flex-col gap-5 items-center justify-center">
            <h2 className='text-3xl font-bold text-center'>Page not found</h2>
            <p className="font-sm text-medium opacity-80">The page you are looking for does not exist</p>
            <div className="py-5">
                <p className="text-9xl font-bold opacity-20">404</p>
            </div>
            <button onClick={() => router.push("/swap")} className="bg-blue-500 rounded-md py-2 px-20">
                <p className="font-medium text-white">Back</p>
            </button>
        </div>
    )
}