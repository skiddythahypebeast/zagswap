import { SwapLoader } from "./components/page-loader";

export default function Loading() {
    return (<div className="absolute inset-0 flex items-center justify-center -z-10"><SwapLoader /></div>)
}