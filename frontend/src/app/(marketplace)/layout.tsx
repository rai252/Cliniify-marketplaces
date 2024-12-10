import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import BackToTop from "@/components/back-to-top";
export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
      <BackToTop />
    </div>
  );
}
