import Link from "next/link";

export default function Navbar() {
    return (
        <>
            <div className="flex justify-between p-4 border-b-1 border-ctp-surface0">
                { /* Left hand side */ }
                <div className="hover:underline text-ctp-mauve font-semibold">
                    <Link href="/">\ciro</Link>
                </div>

                { /* Right hand side */ }
                <div className="[&>*]:hover:underline [&>*]:p-4 [&>*]:transition-all [&>*]:delay-700 [&>*]:duration-700">
                    <Link href="/">about</Link>
                    <Link href="/projects">projects</Link>
                    <Link href="/blog">blog</Link>
                    <Link href="/contact">contact</Link>
                </div>
            </div>
        </>
    );
}