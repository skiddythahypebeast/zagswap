import { type ReactNode, useMemo } from "react";

interface InputContainerProps {
    children: ReactNode,
    position: "top" | "bottom" | "center"
}
export const InputContainer = ({ children, position }: InputContainerProps) => {
    const borderRadius = useMemo(() => {
    switch (position) {
        case "bottom": return "rounded-b-lg";
        case "top": return "rounded-t-lg";
        case "center": return "rounded-lg";
    }
    }, [position]);
    return (
        <div className={`${borderRadius} h-14 w-full bg-gray-200 shadow-sm shadow-[#00000020] rounded-t-lg flex flex-row items-center justify-between overflow-clip`}>
            {children}
        </div>
    )
}