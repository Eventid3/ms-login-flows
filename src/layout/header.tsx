import Link from "next/link";

export default function Header() {
    return (
        <div className="w-full bg-stone-700 fixed">
            <nav className="flex flex-row justify-end p-4">
                <Link
                    href="/"
                    className="p-4"
                >
                    HOME
                </Link>
                <Link
                    href="/pkce"
                    className="p-4"
                >
                    PKCE FLOW
                </Link>
                <Link
                    href="/web"
                    className="p-4"
                >
                    WEB FLOW
                </Link>
            </nav>
        </div>
    )
}