import Image from "next/image"
import Link from "next/link"

export const InfoLink = ({ href, external }: { href: string, external?: boolean }) => {
    return (
        <Link href={href} target={external ? "_blank" : "_self"}>
            <Image src="/icons/info.svg" className="dark:filter dark:invert opacity-50" height={15} width={15} alt="Icon"/>
        </Link>
    )
}