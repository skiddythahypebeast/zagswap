'use client' // Error boundaries must be Client Components
 
import { useRouter } from 'next/navigation';
import { OrderErrorHandler } from '~/app/order/components/error_handler';
 
export default function Error({ error, reset }: { error: Error & { digest?: string }, reset: () => void }) { 
    const router = useRouter();
    return (<OrderErrorHandler error={error} reset={reset} back={() => router.back()} />)    
}