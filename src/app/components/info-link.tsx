/* eslint-disable @next/next/no-img-element */
import Link from "next/link"

export const InfoLink = ({ href, external }: { href: string, external?: boolean }) => {
    return (
        <Link href={href} target={external ? "_blank" : "_self"}>
            <img src="/icons/info.svg" className="w-5 h-5 dark:filter dark:invert opacity-50" alt="Icon"/>
        </Link>
    )
}