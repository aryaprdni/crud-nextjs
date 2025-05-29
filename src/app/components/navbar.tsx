import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function Navbar() {
  return (
    <nav className="border-b bg-white py-4 mb-8 shadow-sm">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-extrabold tracking-tight">
          UserCRUD
        </Link>
        <Link
          href="/users/create-user"
          className={`${buttonVariants({
            variant: "outline",
          })} text-gray-600 border-gray-400 hover:bg-gray-100`}
        >
          Add User
        </Link>
      </div>
    </nav>
  );
}
