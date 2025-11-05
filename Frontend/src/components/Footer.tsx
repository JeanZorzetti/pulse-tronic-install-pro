import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Instagram, Facebook } from "lucide-react";
import logo from "@/assets/pulse-tronic-logo.png";
import { trackPhoneClick } from "@/hooks/useAnalytics";

const Footer = () => {
  const handlePhoneClick = () => {
    trackPhoneClick('footer');
  };
  return (
    <footer className="bg-secondary/30 border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo e Descrição */}
          <div className="col-span-1 md:col-span-2">
            <img src={logo} alt="Pulse Tronic" className="h-16 mb-4" />
            <p className="text-sm text-muted-foreground max-w-md">
              Especialistas em instalação automotiva BYOD. Protegemos seu investimento 
              com precisão técnica e acabamento profissional.
            </p>
          </div>

          {/* Links Rápidos */}
          <div>
            <h3 className="font-semibold mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Início
                </Link>
              </li>
              <li>
                <Link to="/servicos" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Serviços
                </Link>
              </li>
              <li>
                <Link to="/sobre" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Sobre Nós
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h3 className="font-semibold mb-4">Contato</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <Phone size={18} className="text-primary mt-0.5 flex-shrink-0" />
                <a
                  href="tel:+55XXXXXXXXXXX"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  onClick={handlePhoneClick}
                >
                  (XX) XXXXX-XXXX
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Mail size={18} className="text-primary mt-0.5 flex-shrink-0" />
                <span className="text-sm text-muted-foreground">contato@pulsetronic.com.br</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={18} className="text-primary mt-0.5 flex-shrink-0" />
                <span className="text-sm text-muted-foreground">
                  Endereço da Loja<br />Cidade - Estado
                </span>
              </li>
            </ul>
            <div className="flex gap-4 mt-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Pulse Tronic. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
