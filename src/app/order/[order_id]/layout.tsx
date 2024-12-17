import { type ReactNode } from "react";

export default function OrderLayout({ children }: { children: ReactNode }) {
    return (
        <>
            <main className="flex min-h-screen w-full flex-col items-center justify-center bg-bg1 dark:bg-dark-bg1 text-text">
                {children}
            </main>
        </>
    )
}