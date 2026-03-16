import { Shield } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="bg-primary text-primary-foreground py-12">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Shield className="h-6 w-6 text-accent" />
            <span className="font-heading text-lg font-bold">UgandaStaff</span>
          </div>
          <p className="text-primary-foreground/70 text-sm">
            Empowering Ugandan staff nationwide with safety, education, and health services.
          </p>
        </div>
        <div>
          <h4 className="font-heading font-semibold mb-3">Emergency</h4>
          <ul className="space-y-2 text-sm text-primary-foreground/70">
            <li><Link to="/emergency" className="hover:text-accent transition-colors">SOS Help</Link></li>
            <li><Link to="/hospitals" className="hover:text-accent transition-colors">Find Hospital</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-heading font-semibold mb-3">Services</h4>
          <ul className="space-y-2 text-sm text-primary-foreground/70">
            <li><Link to="/schools" className="hover:text-accent transition-colors">Schools</Link></li>
            <li><Link to="/community" className="hover:text-accent transition-colors">Community</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-heading font-semibold mb-3">Contact</h4>
          <ul className="space-y-2 text-sm text-primary-foreground/70">
            <li>Emergency: 911</li>
            <li>support@communityguardian.org</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-primary-foreground/20 mt-8 pt-6 text-center text-sm text-primary-foreground/50">
        © 2026 Community Guardian. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
