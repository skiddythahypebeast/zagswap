import Image from "next/image"

export const SwapLoader = () => {
    return (<Image src="/icons/spinner.svg" className="dark:filter dark:invert opacity-20 animate-spin" height={30} width={30} alt="Icon"/>)
}