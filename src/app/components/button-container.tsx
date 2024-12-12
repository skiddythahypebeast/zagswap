import { type ReactNode, useMemo } from "react";

interface ButtonContainerProps {
    children: ReactNode,
    size?: "small" | "large"
}
export const ButtonContainer = ({ children, size }: ButtonContainerProps) => {
    const height = useMemo(() => {
        if(size){
            switch (size) {
                case "small": return "h-10";
                case "large": return "h-14";
            }
        } else {
            return "h-14"
        }
        }, [size]);

    return (
        <div className={`${height} w-full flex flex-row items-center justify-between`}>
            {children}
        </div>
    )
}