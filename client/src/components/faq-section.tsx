import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";

export default function FAQSection() {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const faqs = [
    {
      question: "¿Es gratis usar VideoDown?",
      answer: "Sí, VideoDown es completamente gratuito. No hay límites de descarga ni necesidad de registro."
    },
    {
      question: "¿Qué plataformas son compatibles?",
      answer: "Soportamos YouTube, Vimeo, TikTok, Instagram, Facebook y muchas otras plataformas populares de video."
    },
    {
      question: "¿Es legal descargar videos?",
      answer: "La legalidad depende de los derechos de autor del contenido. Recomendamos descargar solo contenido propio o con permiso del autor."
    },
    {
      question: "¿Qué formatos están disponibles?",
      answer: "Ofrecemos múltiples formatos incluyendo MP4 (video), MP3 (solo audio), WebM, y diferentes calidades desde 360p hasta 1080p HD."
    },
    {
      question: "¿Hay límites de descarga?",
      answer: "No hay límites en el número de descargas. Sin embargo, recomendamos uso responsable y respetar los términos de servicio de las plataformas."
    }
  ];

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  return (
    <section className="mb-12">
      <h3 className="text-2xl font-bold text-center mb-8">Preguntas Frecuentes</h3>
      <div className="max-w-3xl mx-auto space-y-4">
        {faqs.map((faq, index) => (
          <Collapsible 
            key={index}
            open={openItems.includes(index)}
            onOpenChange={() => toggleItem(index)}
          >
            <div className="video-card rounded-xl p-6" data-testid={`card-faq-${index}`}>
              <CollapsibleTrigger className="flex justify-between items-center w-full text-left">
                <h4 className="font-semibold pr-4" data-testid={`text-faq-question-${index}`}>
                  {faq.question}
                </h4>
                <svg 
                  className={`w-5 h-5 transition-transform flex-shrink-0 ${openItems.includes(index) ? 'rotate-180' : ''}`} 
                  fill="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"/>
                </svg>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-4">
                <p className="text-muted-foreground" data-testid={`text-faq-answer-${index}`}>
                  {faq.answer}
                </p>
              </CollapsibleContent>
            </div>
          </Collapsible>
        ))}
      </div>
    </section>
  );
}
