'use client' // Error boundaries must be Client Components
 
import { useRouter } from 'next/navigation';
import { ErrorHandler } from '../components/error_handler';
 
export default function Error({ error, reset }: { error: Error & { digest?: string }, reset: () => void }) { 
    const router = useRouter();
    return (
        <div className="flex min-h-screen w-full flex-col items-center justify-center bg-gradient-to-b text-stone-800">
            <ErrorHandler 
                message="Please check your order ID and try again." 
                error={error} 
                reset={reset} 
                back={() => router.push("/swap")} />
        </div>
    )    
}