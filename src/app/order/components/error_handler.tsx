import Image from "next/image"

export const ErrorHandler = ({ reset, back, message }: { error: Error & { digest?: string }, reset: () => void, back: () => void, message?: string }) => {
    return (
        <div className="w-[600px] max-w-[95%] h-[600px] px-20 flex flex-col gap-5 items-center justify-center text-stone-800">
            <h2 className='text-3xl font-bold text-center'>Sorry we could not find your order</h2>
            {message && <p className="font-sm text-medium opacity-80">{message}</p>}
            <Image src="/icons/error.svg" className="opacity-10" alt="" height={200} width={200} />
            <div className="flex flex-row w-full gap-2">
                <button onClick={back} className="bg-blue-500 flex-1 rounded-md py-2 px-3">
                    <p className="font-medium text-white">Back</p>
                </button>
                <button onClick={reset} className="border-blue-500 border-2 rounded-md py-2 px-3">
                    <Image src="/icons/primary-retry.svg" alt="" height={20} width={20} />
                </button>
            </div>
        </div>
    )
}