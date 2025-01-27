import Image from "next/image"

export const OrderLoader = () => {
    return (<Image src="/icons/spinner.svg" className="dark:filter dark:invert animate-spin opacity-30" height={30} width={30} alt="Icon"/>)
}