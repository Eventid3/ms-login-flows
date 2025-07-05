'use client'
import Link from "next/link";
import {usePathname} from "next/navigation";

export default function Header() {
    const pathname = usePathname()
    return (
        <div className="w-full bg-gray-700 fixed flex flex-row justify-between">
            <div className="flex p-4">
                <span className="font-bold py-2 px-4">Microsoft Login Flows - Test App</span>
            </div>
            <nav className="flex flex-row justify-end p-4">
                <Link
                    href="/"
                    className={`font-bold px-4 py-2 hover:bg-gray-500 ${pathname == "/" ? "bg-gray-600" : ""}`}
                >
                    HOME
                </Link>
                <Link
                    href="/pkce"
                    className={`font-bold px-4 py-2 hover:bg-gray-500 ${pathname == "/pkce" ? "bg-gray-600" : ""}`}
                >
                    PKCE FLOW
                </Link>
                <Link
                    href="/web"
                    className={`font-bold px-4 py-2 hover:bg-gray-500 ${pathname == "/web" ? "bg-gray-600" : ""}`}
                >
                    WEB FLOW
                </Link>
            </nav>
        </div>
    )
}