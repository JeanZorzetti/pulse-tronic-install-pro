import { Zap, Wrench, Shield, Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Sobre = () => {
  const values = [
    {
      icon: Zap,
      title: "Paixão por Eletrônica",
      description: "Somos apaixonados por tecnologia e eletrônica automotiva de precisão.",
    },
    {
      icon: Wrench,
      title: "Expertise Técnica",
      description: "Anos de experiência em instalações complexas e integração de sistemas.",
    },
    {
      icon: Shield,
      title: "Segurança Primeiro",
      description: "Preservamos a garantia do seu veículo e a integridade do equipamento.",
    },
    {
      icon: Award,
      title: "Qualidade Garantida",
      description: "Acabamento de fábrica e garantia total sobre nossos serviços.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Somos Apaixonados por Eletrônica Automotiva
            </h1>
          </div>

          <div className="max-w-4xl mx-auto space-y-8 mb-16">
            <Card>
              <CardContent className="pt-8 pb-8">
                <p className="text-lg text-muted-foreground leading-relaxed">
                  A <strong className="text-foreground">Pulse Tronic</strong> nasceu da união de duas paixões: 
                  o <strong className="text-primary">Pulso</strong> da música e a precisão da eletrônica 
                  (<strong className="text-primary">Tronic</strong>). Entendemos que o cliente BYOD é inteligente 
                  e buscou o melhor preço para seu equipamento. Nossa missão é oferecer a expertise técnica 
                  que finaliza essa compra com perfeição.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-8 pb-8">
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Não somos apenas "instaladores". <strong className="text-foreground">Somos técnicos especializados 
                  em eletrônica</strong>. Cuidamos do acabamento do seu painel, usamos as ferramentas corretas 
                  e garantimos que a instalação seja segura e durável. Cada projeto é tratado com o mesmo cuidado 
                  que daríamos ao nosso próprio veículo.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-8 pb-8">
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Trabalhamos com o conceito <strong className="text-foreground">BYOD (Bring Your Own Device)</strong> porque 
                  acreditamos que você deve ter a liberdade de escolher seu equipamento onde preferir. Nossa especialidade 
                  é transformar essa escolha em uma instalação profissional, com acabamento perfeito e total 
                  integração com seu veículo.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Nossos Valores */}
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Nossos Valores
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {values.map((value, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-8 pb-8">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <value.icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                        <p className="text-muted-foreground">{value.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Sobre;
