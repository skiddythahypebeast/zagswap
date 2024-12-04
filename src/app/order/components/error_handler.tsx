import Image from "next/image"

export const OrderErrorHandler = ({ reset, back }: { error: Error & { digest?: string }, reset: () => void, back: () => void }) => {
    return (
        <div className="w-[600px] max-w-[95%] h-[600px] px-20 flex flex-col gap-5 items-center justify-center text-stone-800">
            <h2 className='text-4xl font-bold text-center'>Internal server error</h2>
            <p className="text-sm">There is a technical issue on our server. Please try again later.</p>
            <div className="py-5">
                <Image src="/icons/error.svg" className="opacity-10" alt="" height={200} width={200} />
            </div>
            <div className="flex flex-row gap-2">
                <button onClick={back} className="border-blue-500 bg-blue-100 border-2 flex-1 rounded-md py-2 px-20">
                    <p className="font-medium text-blue-500">Back</p>
                </button>
                <button onClick={reset} className="bg-blue-500 rounded-md py-2 px-3">
                    <Image src="/icons/white-refresh.svg" alt="" height={20} width={20} />
                </button>
            </div>
        </div>
    )
}