import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const FAQ = () => {
  const faqs = [
    {
      question: "Vocês instalam qualquer marca de equipamento que eu comprar online?",
      answer: "Sim. Somos multimarcas e especializados em integrar qualquer aparelho ao seu veículo, desde que seja compatível com o modelo do seu carro. Trabalhamos com Pioneer, Caska, Aikon, Voolt, Positron, JBL, Taramps e todas as principais marcas do mercado.",
    },
    {
      question: "A instalação pode fazer eu perder a garantia do meu carro?",
      answer: "Não. Utilizamos chicotes e conectores 'plug-and-play' sempre que possível, evitando cortes na fiação original e preservando 100% da garantia do seu veículo. Nossa instalação respeita todas as normas técnicas do fabricante.",
    },
    {
      question: "Vocês dão garantia do serviço?",
      answer: "Sim. A garantia do equipamento é com a loja onde você comprou, mas oferecemos garantia total sobre o nosso serviço de instalação. Se houver qualquer problema relacionado à instalação, nós resolvemos sem custo adicional.",
    },
    {
      question: "Por que não devo tentar instalar em casa (DIY)?",
      answer: "Equipamentos modernos exigem conhecimento da rede elétrica do carro (Rede CAN). Uma ligação errada pode queimar o aparelho ou módulos caros do veículo, como a central eletrônica. O custo da instalação profissional é um seguro para o seu investimento e evita prejuízos muito maiores.",
    },
    {
      question: "Quanto tempo demora a instalação?",
      answer: "O tempo varia de acordo com a complexidade do serviço. Uma central multimídia simples pode levar 2-3 horas. Sistemas de som completos com tratamento acústico podem levar um dia inteiro. Fornecemos um prazo estimado no orçamento.",
    },
    {
      question: "Preciso deixar o carro na oficina?",
      answer: "Sim, para garantir a qualidade do serviço, é necessário deixar o veículo. O tempo de permanência depende do tipo de instalação. Sempre agendamos previamente para otimizar seu tempo.",
    },
    {
      question: "Vocês fazem orçamento antes?",
      answer: "Sim! Sempre fazemos um orçamento detalhado sem compromisso. Basta entrar em contato informando o modelo do seu carro e o equipamento que você quer instalar.",
    },
    {
      question: "Posso comprar o equipamento com vocês?",
      answer: "Nosso foco é na instalação profissional (modelo BYOD), mas podemos indicar fornecedores confiáveis caso você precise. O diferencial é que você tem a liberdade de comprar onde quiser e nós cuidamos da instalação perfeita.",
    },
    {
      question: "A instalação preserva as funções originais do carro?",
      answer: "Sim! Mantemos todas as funcionalidades originais do veículo, incluindo comandos de volante, display de informações, câmeras originais e sensores. A instalação é integrada, não improvisada.",
    },
    {
      question: "Vocês trabalham com que tipos de veículos?",
      answer: "Atendemos todos os tipos de veículos: carros populares, sedãs, SUVs, picapes e veículos importados. Cada instalação é personalizada de acordo com as características específicas do modelo.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Tire suas Dúvidas sobre o Modelo BYOD
            </h1>
            <p className="text-xl text-muted-foreground">
              Respondemos as perguntas mais comuns sobre nossos serviços de instalação.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem 
                  key={index} 
                  value={`item-${index}`}
                  className="bg-card border border-border rounded-lg px-6"
                >
                  <AccordionTrigger className="text-left hover:no-underline hover:text-primary">
                    <span className="font-semibold">{faq.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          <div className="text-center mt-12">
            <p className="text-lg text-muted-foreground mb-6">
              Ainda tem dúvidas? Entre em contato conosco!
            </p>
            <Button asChild size="lg" className="text-lg px-8">
              <Link to="/contato">Falar com Especialista</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FAQ;
