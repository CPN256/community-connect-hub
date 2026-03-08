import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, Menu, X } from "lucide-react";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/emergency", label: "Emergency" },
  { to: "/hospitals", label: "Hospitals" },
  { to: "/schools", label: "Schools" },
  { to: "/community", label: "Community" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-lg border-b">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2">
          <Shield className="h-8 w-8 text-accent" />
          <span className="font-heading text-xl font-bold text-foreground">
            Community<span className="text-accent">Guardian</span>
          </span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link key={link.to} to={link.to}>
              <Button
                variant={location.pathname === link.to ? "secondary" : "ghost"}
                size="sm"
              >
                {link.label}
              </Button>
            </Link>
          ))}
          <Link to="/emergency">
            <Button variant="emergency" size="sm" className="ml-2 animate-none">
              🚨 SOS
            </Button>
          </Link>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden text-foreground" onClick={() => setOpen(!open)}>
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-card border-b px-4 pb-4 space-y-1">
          {navLinks.map((link) => (
            <Link key={link.to} to={link.to} onClick={() => setOpen(false)}>
              <Button
                variant={location.pathname === link.to ? "secondary" : "ghost"}
                className="w-full justify-start"
              >
                {link.label}
              </Button>
            </Link>
          ))}
          <Link to="/emergency" onClick={() => setOpen(false)}>
            <Button variant="emergency" className="w-full animate-none">
              🚨 Emergency SOS
            </Button>
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
