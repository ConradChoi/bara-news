import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#e8ebe6" }}>
      <Header />
      <main className="flex-1" />
      <Footer />
    </div>
  );
}
