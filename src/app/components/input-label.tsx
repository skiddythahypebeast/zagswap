

export const InputLabel = ({ label }: { label: { default: string, error: [string, string] | undefined } }) => {
    return (
        <div className={`w-full bg-four dark:bg-four-dark rounded-lg py-1 flex flex-row justify-between relative`}>
            {!label.error && <p className="font-bold px-2 text-sm absolute">{label.default}</p>}
            {label.error && (
                <div className="text-red-500 px-2 font-bold text-sm absolute flex flex-row justify-between items-center w-full">
                    <p>{label.error[0]}</p>
                    <p>{label.error[1]}</p>
                </div>
            )}
            <p className="pointer-events-none text-sm opacity-0">hidden</p>
        </div>
    )
}