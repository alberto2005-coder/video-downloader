import Header from "@/components/header";
import VideoAnalyzer from "@/components/video-analyzer";
import FeaturesSection from "@/components/features-section";
import FAQSection from "@/components/faq-section";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground gradient-bg">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            Descarga Videos Fácilmente
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Descarga videos de YouTube y otras plataformas en el formato y calidad que prefieras. 
            Rápido, seguro y completamente gratis.
          </p>
          
          <VideoAnalyzer />
        </section>
        
        <FeaturesSection />
        <FAQSection />
      </main>
      <Footer />
    </div>
  );
}
