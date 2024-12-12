

export const InputLabel = ({ label }: { label: { default: string } | { error: [string, string] } }) => {
    return (
        <div className={`w-full bg-slate-100 rounded-lg py-1 px-2 flex flex-row justify-between relative`}>
            {"default" in label && <p className="text-stone-800 font-bold px-2 text-sm absolute">{label.default}</p>}
            {"error" in label && (
                <div className="text-red-500 px-2 font-bold text-sm absolute flex flex-row justify-between items-center w-full">
                    <p>{label.error[0]}</p>
                    <p>{label.error[1]}</p>
                </div>
            )}
            <p className="pointer-events-none text-sm opacity-0">hidden</p>
        </div>
    )
}