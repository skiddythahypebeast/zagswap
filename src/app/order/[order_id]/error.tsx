'use client' // Error boundaries must be Client Components
 
import { useRouter } from 'next/navigation';
import { OrderErrorHandler } from '../components/error_handler';
 
export default function Error({ error, reset }: { error: Error & { digest?: string }, reset: () => void }) { 
    const router = useRouter();
    return (<OrderErrorHandler back={() => router.push("/swap")} error={error} reset={reset} />)    
}