import { PrismaClient, UserRole, ServiceCategory } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create default admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@pulsetronic.com.br' },
    update: {},
    create: {
      email: 'admin@pulsetronic.com.br',
      password: hashedPassword,
      name: 'Administrador',
      role: UserRole.ADMIN,
    },
  });

  console.log('✅ Admin user created:', admin.email);

  // Create services
  const services = [
    {
      title: 'Instalação de Central Multimídia',
      slug: 'instalacao-central-multimidia',
      description: 'Instalação profissional de centrais multimídia com integração total ao veículo',
      category: ServiceCategory.MULTIMEDIA,
      estimatedTime: 180, // 3 hours
      items: [
        'Integração perfeita com comandos de volante originais',
        'Conexão com câmera de ré original do veículo',
        'Chicotes plug-and-play para preservar garantia',
        'Configuração completa de Apple CarPlay e Android Auto',
        'Experiência com todas as marcas: Pioneer, Caska, Aikon, Voolt, Positron',
      ],
    },
    {
      title: 'Sistema de Som (Hi-Fi / SQ)',
      slug: 'sistema-som-hifi-sq',
      description: 'Instalação de sistemas de som com foco em Sound Quality',
      category: ServiceCategory.SOUND,
      estimatedTime: 480, // 8 hours
      items: [
        'Projetos focados em Sound Quality (SQ)',
        'Instalação de amplificadores e processadores (DSP)',
        'Subwoofers para graves controlados e precisos',
        'Tratamento acústico profissional de portas',
        'Alto-falantes premium com instalação sem vibrações',
        'Cabeamento de qualidade com bitolas corretas',
      ],
    },
    {
      title: 'Câmeras e Dash Cams',
      slug: 'cameras-dash-cams',
      description: 'Instalação de sistemas de segurança veicular',
      category: ServiceCategory.CAMERA,
      estimatedTime: 120, // 2 hours
      items: [
        'Dash Cams com gravação contínua',
        'Sensores de estacionamento dianteiros e traseiros',
        'Câmeras de ré com linhas dinâmicas',
        'Instalação discreta e integrada ao veículo',
        'Configuração de gravação em caso de impacto',
      ],
    },
    {
      title: 'Alarmes e Sistemas de Segurança',
      slug: 'alarmes-sistemas-seguranca',
      description: 'Instalação de alarmes e acessórios de segurança',
      category: ServiceCategory.SECURITY,
      estimatedTime: 240, // 4 hours
      items: [
        'Alarmes com bloqueio de motor',
        'Sensores de presença e volumétrico',
        'Travas elétricas automáticas',
        'Iluminação LED interna e externa',
        'Módulos de vidros elétricos automáticos',
      ],
    },
  ];

  for (const serviceData of services) {
    const { items, ...serviceInfo } = serviceData;

    const service = await prisma.service.upsert({
      where: { slug: serviceInfo.slug },
      update: {},
      create: {
        ...serviceInfo,
        items: {
          create: items.map((item, index) => ({
            item,
            displayOrder: index,
          })),
        },
      },
    });

    console.log('✅ Service created:', service.title);
  }

  // Create FAQs
  const faqs = [
    {
      question: 'Vocês instalam qualquer marca de equipamento que eu comprar online?',
      answer: 'Sim. Somos multimarcas e especializados em integrar qualquer aparelho ao seu veículo, desde que seja compatível com o modelo do seu carro. Trabalhamos com Pioneer, Caska, Aikon, Voolt, Positron, JBL, Taramps e todas as principais marcas do mercado.',
      displayOrder: 0,
    },
    {
      question: 'A instalação pode fazer eu perder a garantia do meu carro?',
      answer: 'Não. Utilizamos chicotes e conectores "plug-and-play" sempre que possível, evitando cortes na fiação original e preservando 100% da garantia do seu veículo. Nossa instalação respeita todas as normas técnicas do fabricante.',
      displayOrder: 1,
    },
    {
      question: 'Vocês dão garantia do serviço?',
      answer: 'Sim. A garantia do equipamento é com a loja onde você comprou, mas oferecemos garantia total sobre o nosso serviço de instalação. Se houver qualquer problema relacionado à instalação, nós resolvemos sem custo adicional.',
      displayOrder: 2,
    },
    {
      question: 'Por que não devo tentar instalar em casa (DIY)?',
      answer: 'Equipamentos modernos exigem conhecimento da rede elétrica do carro (Rede CAN). Uma ligação errada pode queimar o aparelho ou módulos caros do veículo, como a central eletrônica. O custo da instalação profissional é um seguro para o seu investimento e evita prejuízos muito maiores.',
      displayOrder: 3,
    },
    {
      question: 'Quanto tempo demora a instalação?',
      answer: 'O tempo varia de acordo com a complexidade do serviço. Uma central multimídia simples pode levar 2-3 horas. Sistemas de som completos com tratamento acústico podem levar um dia inteiro. Fornecemos um prazo estimado no orçamento.',
      displayOrder: 4,
    },
  ];

  for (const faq of faqs) {
    await prisma.fAQ.upsert({
      where: {
        id: `faq-${faq.displayOrder}` // Temporary ID for upsert
      },
      update: {},
      create: faq,
    });
  }

  console.log('✅ FAQs created');

  // Create company settings
  const settings = [
    { key: 'company_name', value: 'Pulse Tronic', description: 'Nome da empresa' },
    { key: 'company_phone', value: '(XX) XXXXX-XXXX', description: 'Telefone principal' },
    { key: 'company_email', value: 'contato@pulsetronic.com.br', description: 'Email de contato' },
    { key: 'company_address', value: 'Rua Example, 123 - Bairro\nCidade - Estado, CEP', description: 'Endereço completo' },
    { key: 'company_whatsapp', value: '+5511999999999', description: 'WhatsApp' },
    { key: 'working_hours', value: 'Segunda a Sexta: 8h às 18h\nSábado: 8h às 13h', description: 'Horário de funcionamento' },
    { key: 'instagram_url', value: 'https://instagram.com/pulsetronic', description: 'Instagram' },
    { key: 'facebook_url', value: 'https://facebook.com/pulsetronic', description: 'Facebook' },
  ];

  for (const setting of settings) {
    await prisma.settings.upsert({
      where: { key: setting.key },
      update: {},
      create: setting,
    });
  }

  console.log('✅ Settings created');
  console.log('🎉 Seed completed successfully!');
  console.log('');
  console.log('📝 Default Admin Credentials:');
  console.log('   Email: admin@pulsetronic.com.br');
  console.log('   Password: admin123');
  console.log('   ⚠️  CHANGE THIS PASSWORD IN PRODUCTION!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
