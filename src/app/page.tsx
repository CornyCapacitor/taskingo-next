import Link from "next/link";

export default function Home() {
  return (
    <main className="poppins h-screen w-screen flex flex-col gap-3 items-center justify-center">
      <span>Welcome to Taskingo!</span>
      <span>In order to access the page, you must be logged in.</span>
      <Link href="/login" className="w-[320px] p-3 rounded-md bg-blue-600 text-white hover:bg-blue-700 focus:outline-none text-center">To login page</Link>
    </main>
  );
}
