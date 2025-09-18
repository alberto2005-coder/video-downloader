export default function Footer() {
  const footerSections = [
    {
      title: "Plataformas",
      links: [
        { name: "YouTube", href: "#" },
        { name: "Vimeo", href: "#" },
        { name: "TikTok", href: "#" },
        { name: "Instagram", href: "#" }
      ]
    },
    {
      title: "Soporte",
      links: [
        { name: "Ayuda", href: "#" },
        { name: "Contacto", href: "#" },
        { name: "Reportar problema", href: "#" },
        { name: "API", href: "#" }
      ]
    },
    {
      title: "Legal",
      links: [
        { name: "Términos de uso", href: "#" },
        { name: "Privacidad", href: "#" },
        { name: "DMCA", href: "#" },
        { name: "Cookies", href: "#" }
      ]
    }
  ];

  return (
    <footer className="border-t border-border/20 bg-card/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-4 gap-6">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-primary-foreground" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
                </svg>
              </div>
              <span className="font-bold">VideoDown</span>
            </div>
            <p className="text-muted-foreground text-sm">
              El descargador de videos más rápido y seguro de internet.
            </p>
          </div>
          
          {footerSections.map((section, sectionIndex) => (
            <div key={sectionIndex}>
              <h5 className="font-semibold mb-3" data-testid={`text-footer-title-${sectionIndex}`}>
                {section.title}
              </h5>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a 
                      href={link.href} 
                      className="hover:text-foreground transition-colors"
                      data-testid={`link-footer-${sectionIndex}-${linkIndex}`}
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="border-t border-border/20 mt-8 pt-6 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 VideoDown. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
