import Image from "next/image"

export const OrderLoader = () => {
    return (<Image src="/icons/spinner.svg" alt="" height={40} width={40} className="animate-spin opacity-20" />)
}