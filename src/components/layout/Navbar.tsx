import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, Menu, X, User, LogOut, BarChart3 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import NotificationBell from "@/components/NotificationBell";
import ThemeToggle from "@/components/ThemeToggle";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/emergency", label: "Emergency" },
  { to: "/hospitals", label: "Hospitals" },
  { to: "/schools", label: "Schools" },
  { to: "/report", label: "Report" },
  { to: "/impact", label: "Impact" },
  { to: "/forum", label: "Forum" },
  { to: "/profile", label: "Profile" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { user, profile, roles, signOut, isLoading } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-lg border-b">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2">
          <Shield className="h-8 w-8 text-accent" />
          <span className="font-heading text-xl font-bold text-foreground">
            Uganda<span className="text-accent">Staff</span>
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
          <Link to="/analytics">
            <Button variant={location.pathname === "/analytics" ? "secondary" : "ghost"} size="sm">
              <BarChart3 className="h-4 w-4 mr-1" /> Analytics
            </Button>
          </Link>
          <Link to="/emergency">
            <Button variant="emergency" size="sm" className="ml-2 animate-none">
              🚨 SOS
            </Button>
          </Link>

          <ThemeToggle />
          {!isLoading && user && <NotificationBell />}
          {!isLoading && (
            user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="ml-2 gap-2">
                    <User className="h-4 w-4" />
                    <span className="max-w-[120px] truncate">
                      {profile?.display_name || user.email}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">{profile?.display_name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                    <div className="flex gap-1 mt-1">
                      {roles.map((role) => (
                        <Badge key={role} variant="secondary" className="text-xs capitalize">
                          {role}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      My Profile
                    </Link>
                  </DropdownMenuItem>
                  {roles.includes("admin") && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin" className="cursor-pointer">
                        <Shield className="mr-2 h-4 w-4" />
                        Admin Dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={signOut} className="text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/auth">
                <Button variant="outline" size="sm" className="ml-2">
                  Sign In
                </Button>
              </Link>
            )
          )}
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
          <div className="flex justify-center py-1">
            <ThemeToggle />
          </div>
          {!isLoading && (
            user ? (
              <div className="pt-2 border-t space-y-1">
                <div className="px-3 py-2">
                  <p className="text-sm font-medium">{profile?.display_name}</p>
                  <div className="flex gap-1 mt-1">
                    {roles.map((role) => (
                      <Badge key={role} variant="secondary" className="text-xs capitalize">
                        {role}
                      </Badge>
                    ))}
                  </div>
                </div>
                <Button variant="ghost" className="w-full justify-start text-destructive" onClick={() => { signOut(); setOpen(false); }}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <Link to="/auth" onClick={() => setOpen(false)}>
                <Button variant="outline" className="w-full">Sign In</Button>
              </Link>
            )
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
