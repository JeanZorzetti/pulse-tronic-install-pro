import { Link } from "react-router-dom";
import { ShoppingCart, Wrench, Music, Camera, Shield, Zap, Package, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Home = () => {
  const steps = [
    {
      icon: ShoppingCart,
      title: "Você Traz o Equipamento",
      description: "Comprou online? Sem problemas. Nós instalamos qualquer marca.",
    },
    {
      icon: Wrench,
      title: "Nós Instalamos com Precisão",
      description: "Nossa equipe é especialista em eletrônica automotiva, garantindo acabamento e funcionalidade de fábrica.",
    },
    {
      icon: Music,
      title: "Você Curte com Segurança",
      description: "Serviço com garantia, sem riscos de queimar seu aparelho ou danificar seu carro.",
    },
  ];

  const services = [
    {
      icon: Zap,
      title: "Centrais Multimídia",
      description: "Apple CarPlay, Android Auto, integração total com seu veículo.",
    },
    {
      icon: Music,
      title: "Sistemas de Som (SQ)",
      description: "Módulos, Subwoofers, Alto-falantes, Tratamento Acústico profissional.",
    },
    {
      icon: Camera,
      title: "Dash Cams e Câmeras",
      description: "Instalação discreta e integrada de câmeras de ré e dash cams.",
    },
    {
      icon: Shield,
      title: "Alarmes e Acessórios",
      description: "Sensores, Iluminação, Travas e sistemas de segurança.",
    },
  ];

  const testimonials = [
    {
      name: "Carlos Silva",
      text: "Levei meu multimídia que comprei na internet e o pessoal da Pulse Tronic instalou perfeitamente. Ficou parecendo de fábrica!",
    },
    {
      name: "Marina Costa",
      text: "Profissionais extremamente competentes. A instalação do sistema de som ficou impecável, sem nenhum fio aparente.",
    },
    {
      name: "Roberto Alves",
      text: "Melhor custo-benefício! Economizei comprando o equipamento online e a instalação profissional garantiu que tudo funcionasse perfeitamente.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/5 via-background to-accent/5 py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Pulse Tronic: A Instalação Profissional para o Equipamento que Você Já Comprou
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8">
              Somos especialistas em instalação BYOD de som e multimídia. Proteja seu equipamento 
              e a garantia do seu veículo com precisão técnica.
            </p>
            <Button asChild size="lg" className="text-lg px-8">
              <Link to="/contato">Agendar Instalação</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Como Funciona */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Nosso Processo BYOD é Simples
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {steps.map((step, index) => (
              <Card key={index} className="text-center border-2 hover:border-primary transition-colors">
                <CardContent className="pt-8 pb-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                    <step.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Serviços */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Especialistas em Instalação
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {services.map((service, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-8 pb-8">
                  <service.icon className="w-12 h-12 text-primary mb-4" />
                  <h3 className="text-lg font-semibold mb-2">{service.title}</h3>
                  <p className="text-sm text-muted-foreground">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-10">
            <Button asChild variant="outline" size="lg">
              <Link to="/servicos">Ver Todos os Serviços</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Depoimentos */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            A Instalação que Gera Confiança
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-card">
                <CardContent className="pt-8 pb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <CheckCircle className="w-5 h-5 text-primary" />
                    <span className="font-semibold">{testimonial.name}</span>
                  </div>
                  <p className="text-muted-foreground italic">&ldquo;{testimonial.text}&rdquo;</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-gradient-to-r from-primary to-accent text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Pronto para Proteger Seu Investimento?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Agende sua instalação agora e tenha a garantia de um serviço profissional 
            que respeita seu equipamento e seu veículo.
          </p>
          <Button asChild size="lg" variant="secondary" className="text-lg px-8">
            <Link to="/contato">Entre em Contato</Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
