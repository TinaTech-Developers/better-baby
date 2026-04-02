// /app/(main)/layout.tsx

import Navbar from "./_components/navbar";
import Footer from "./_components/footer";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-[#F7F5F2] text-[#0F0F0F] min-h-screen flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
