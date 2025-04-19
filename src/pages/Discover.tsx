
import { Navbar } from "@/components/Navbar";

export default function Discover() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold">Discover</h1>
        <p className="text-gray-500 mt-2">Find new plushies and connect with the community</p>
      </main>
    </div>
  );
}
