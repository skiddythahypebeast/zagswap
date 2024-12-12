import Image from "next/image"
import Link from "next/link"

export const InfoLink = ({ href, external }: { href: string, external?: boolean }) => {
    return (
        <Link href={href} target={external ? "_blank" : "_self"}>
            <Image src="/icons/info.svg" className="opacity-50" alt="" height={17} width={17} />
        </Link>
    )
}