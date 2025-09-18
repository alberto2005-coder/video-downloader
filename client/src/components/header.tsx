export default function Header() {
  return (
    <header className="border-b border-border/20 backdrop-blur-sm bg-background/50 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-primary-foreground" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-foreground">VideoDown</h1>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-inicio">
              Inicio
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-ayuda">
              Ayuda
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-contacto">
              Contacto
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}
