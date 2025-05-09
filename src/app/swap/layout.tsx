export default function Layout({ children, modal }: { modal: React.ReactNode, children: React.ReactNode }) {
    return (
        <>
            <main className="flex w-[500px] max-w-[95%] m-auto min-h-screen flex-col items-center justify-center bg-gradient-to-b text-text dark:text-text-dark">
                {modal}
                {children}
            </main>
        </>
    )
}