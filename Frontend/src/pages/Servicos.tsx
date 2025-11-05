import { Link } from "react-router-dom";
import { Monitor, Music, Camera, Shield, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Servicos = () => {
  const services = [
    {
      icon: Monitor,
      title: "Instalação de Central Multimídia",
      items: [
        "Integração perfeita com comandos de volante originais",
        "Conexão com câmera de ré original do veículo",
        "Chicotes plug-and-play para preservar garantia",
        "Configuração completa de Apple CarPlay e Android Auto",
        "Experiência com todas as marcas: Pioneer, Caska, Aikon, Voolt, Positron e mais",
      ],
    },
    {
      icon: Music,
      title: "Instalação de Som de Qualidade (Hi-Fi / SQ)",
      items: [
        "Projetos focados em Sound Quality (SQ), não em volume externo",
        "Instalação de amplificadores e processadores (DSP)",
        "Subwoofers para graves controlados e precisos",
        "Tratamento acústico profissional de portas",
        "Alto-falantes premium com instalação sem vibrações",
        "Cabeamento de qualidade com bitolas corretas",
      ],
    },
    {
      icon: Camera,
      title: "Instalação de Acessórios de Segurança",
      items: [
        "Dash Cams (câmeras de painel) com gravação contínua",
        "Sensores de estacionamento dianteiros e traseiros",
        "Câmeras de ré com linhas dinâmicas",
        "Instalação discreta e integrada ao veículo",
        "Configuração de gravação em caso de impacto",
      ],
    },
    {
      icon: Shield,
      title: "Alarmes e Sistemas de Segurança",
      items: [
        "Alarmes com bloqueio de motor",
        "Sensores de presença e volumétrico",
        "Travas elétricas automáticas",
        "Iluminação LED interna e externa",
        "Módulos de vidros elétricos automáticos",
      ],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Nossos Serviços de Instalação Especializada (BYOD)
            </h1>
            <p className="text-xl text-muted-foreground">
              Instalação profissional para o equipamento que você já comprou. 
              Preservamos a garantia do seu veículo e protegemos seu investimento.
            </p>
          </div>

          <div className="grid gap-8 max-w-5xl mx-auto">
            {services.map((service, index) => (
              <Card key={index} className="hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <service.icon className="w-7 h-7 text-primary" />
                    </div>
                    <CardTitle className="text-2xl">{service.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {service.items.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="text-primary mt-1">✓</span>
                        <span className="text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Alerta de Risco */}
          <Alert className="max-w-5xl mx-auto mt-12 border-destructive/50 bg-destructive/5">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <AlertDescription className="ml-2">
              <h3 className="font-semibold text-lg mb-2 text-foreground">
                O Risco de Uma Instalação Amadora
              </h3>
              <p className="text-muted-foreground">
                Uma instalação incorreta pode causar curtos-circuitos, queimar seu equipamento novo, 
                danificar a central eletrônica do seu carro ou até causar um incêndio. 
                <strong className="text-foreground"> Nosso serviço protege seu investimento.</strong>
              </p>
            </AlertDescription>
          </Alert>

          <div className="text-center mt-12">
            <Button asChild size="lg" className="text-lg px-8">
              <Link to="/contato">Solicitar Orçamento Grátis</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Servicos;
