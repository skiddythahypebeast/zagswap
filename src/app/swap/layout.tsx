export default function Layout({
    children,
    modal
}: {
    modal: React.ReactNode
    children: React.ReactNode
}) {
    return (
        <>
            {modal}
            {children}
        </>
    )
}