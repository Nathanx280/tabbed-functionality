import { NavLink } from "react-router-dom";
import { Zap, Wand2, Video, GitMerge, Layers } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

const NavItem = ({ to, icon, children }: NavItemProps) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      cn(
        "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
        isActive
          ? "bg-primary/20 text-primary neon-glow"
          : "text-muted-foreground hover:text-foreground hover:bg-secondary"
      )
    }
  >
    {icon}
    <span className="hidden sm:inline">{children}</span>
  </NavLink>
);

export const MainNav = () => {
  return (
    <nav className="flex items-center gap-1 p-1.5 rounded-xl glass border border-border/50">
      <NavItem to="/" icon={<Zap className="w-4 h-4" />}>
        Remix Studio
      </NavItem>
      <NavItem to="/deep-remixer" icon={<Wand2 className="w-4 h-4" />}>
        Deep Remixer
      </NavItem>
      <NavItem to="/audio-to-video" icon={<Video className="w-4 h-4" />}>
        Audio to Video
      </NavItem>
      <NavItem to="/remix-merge" icon={<GitMerge className="w-4 h-4" />}>
        Remix Merge
      </NavItem>
      <NavItem to="/stem-reconstruct" icon={<Layers className="w-4 h-4" />}>
        Stem Reconstruct
      </NavItem>
    </nav>
  );
};
