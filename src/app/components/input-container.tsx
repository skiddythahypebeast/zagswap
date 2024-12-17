import { type ReactNode, useMemo } from "react";

interface InputContainerProps {
    children: ReactNode,
    position: "top" | "bottom" | "center",
    size?: "small" | "large"
}
export const InputContainer = ({ children, position, size }: InputContainerProps) => {
    const borderRadius = useMemo(() => {
    switch (position) {
        case "bottom": return "rounded-b-lg";
        case "top": return "rounded-t-lg";
        case "center": return "rounded-lg";
    }
    }, [position]);

    const height = useMemo(() => {
        if(size){
            switch (size) {
                case "small": return "h-8";
                case "large": return "h-14";
            }
        } else {
            return "h-14"
        }
        }, [size]);

    return (
        <div className={`${borderRadius} ${height} w-full bg-input dark:bg-dark-input shadow-sm shadow-shadow rounded-t-lg flex flex-row items-center justify-between overflow-clip`}>
            {children}
        </div>
    )
}