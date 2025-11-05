import { Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Contato = () => {
  const contactInfo = [
    {
      icon: Phone,
      title: "Telefone / WhatsApp",
      content: "(XX) XXXXX-XXXX",
      link: "tel:+55XXXXXXXXXXX",
    },
    {
      icon: Mail,
      title: "E-mail",
      content: "contato@pulsetronic.com.br",
      link: "mailto:contato@pulsetronic.com.br",
    },
    {
      icon: MapPin,
      title: "Endereço",
      content: "Rua Example, 123 - Bairro\nCidade - Estado, CEP",
    },
    {
      icon: Clock,
      title: "Horário de Funcionamento",
      content: "Segunda a Sexta: 8h às 18h\nSábado: 8h às 13h",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Agende Sua Instalação
            </h1>
            <p className="text-xl text-muted-foreground">
              Entre em contato conosco e receba um orçamento personalizado para sua instalação.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Informações de Contato */}
            <div className="space-y-6">
              {contactInfo.map((info, index) => (
                <Card key={index}>
                  <CardContent className="pt-6 pb-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <info.icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">{info.title}</h3>
                        {info.link ? (
                          <a 
                            href={info.link} 
                            className="text-muted-foreground hover:text-primary transition-colors"
                          >
                            {info.content}
                          </a>
                        ) : (
                          <p className="text-muted-foreground whitespace-pre-line">{info.content}</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* WhatsApp CTA */}
              <Card className="bg-primary text-primary-foreground">
                <CardContent className="pt-6 pb-6">
                  <div className="flex items-center gap-4">
                    <MessageCircle className="w-12 h-12" />
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">Atendimento Rápido via WhatsApp</h3>
                      <p className="text-sm opacity-90 mb-3">Tire suas dúvidas instantaneamente!</p>
                      <Button variant="secondary" size="sm" asChild>
                        <a href="https://wa.me/55XXXXXXXXXXX" target="_blank" rel="noopener noreferrer">
                          Abrir WhatsApp
                        </a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Mapa */}
              <Card>
                <CardHeader>
                  <CardTitle>Nossa Localização</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                    <p className="text-muted-foreground">Mapa do Google Maps aqui</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Formulário de Orçamento */}
            <Card>
              <CardHeader>
                <CardTitle>Solicitar Orçamento Grátis</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nome Completo</Label>
                    <Input id="name" placeholder="Seu nome" />
                  </div>
                  
                  <div>
                    <Label htmlFor="whatsapp">WhatsApp</Label>
                    <Input id="whatsapp" placeholder="(XX) XXXXX-XXXX" />
                  </div>
                  
                  <div>
                    <Label htmlFor="vehicle">Modelo do Veículo (Ano/Versão)</Label>
                    <Input id="vehicle" placeholder="Ex: Honda Civic 2020 EX" />
                  </div>
                  
                  <div>
                    <Label htmlFor="equipment">Equipamento que Deseja Instalar</Label>
                    <Textarea 
                      id="equipment" 
                      placeholder="Ex: Central multimídia Pioneer, sistema de som completo, câmera de ré, etc."
                      rows={4}
                    />
                  </div>
                  
                  <Button type="submit" className="w-full" size="lg">
                    Enviar Pedido de Orçamento
                  </Button>
                  
                  <p className="text-sm text-muted-foreground text-center">
                    Responderemos em até 24 horas úteis
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contato;
