import { MainNav } from "./MainNav";
import { Music2 } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border/50 glass">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center neon-glow">
              <Music2 className="w-5 h-5 text-background" />
            </div>
            <div>
              <h1 className="text-xl font-bold neon-text">Sonic Symphony</h1>
              <p className="text-xs text-muted-foreground">AI Audio Remixer</p>
            </div>
          </div>
          <MainNav />
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
};
