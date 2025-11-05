"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var client_1 = require("@prisma/client");
var bcrypt_1 = __importDefault(require("bcrypt"));
var prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var hashedPassword, admin, services, _i, services_1, serviceData, items, serviceInfo, service, faqs, _a, faqs_1, faq, existing, settings, _b, settings_1, setting;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    console.log('🌱 Starting database seed...');
                    return [4 /*yield*/, bcrypt_1.default.hash('admin123', 10)];
                case 1:
                    hashedPassword = _c.sent();
                    return [4 /*yield*/, prisma.user.upsert({
                            where: { email: 'admin@pulsetronic.com.br' },
                            update: {},
                            create: {
                                email: 'admin@pulsetronic.com.br',
                                password: hashedPassword,
                                name: 'Administrador',
                                role: client_1.UserRole.ADMIN,
                            },
                        })];
                case 2:
                    admin = _c.sent();
                    console.log('✅ Admin user created:', admin.email);
                    services = [
                        {
                            title: 'Instalação de Central Multimídia',
                            slug: 'instalacao-central-multimidia',
                            description: 'Instalação profissional de centrais multimídia com integração total ao veículo',
                            category: client_1.ServiceCategory.MULTIMEDIA,
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
                            category: client_1.ServiceCategory.SOUND,
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
                            category: client_1.ServiceCategory.CAMERA,
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
                            category: client_1.ServiceCategory.SECURITY,
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
                    _i = 0, services_1 = services;
                    _c.label = 3;
                case 3:
                    if (!(_i < services_1.length)) return [3 /*break*/, 6];
                    serviceData = services_1[_i];
                    items = serviceData.items, serviceInfo = __rest(serviceData, ["items"]);
                    return [4 /*yield*/, prisma.service.upsert({
                            where: { slug: serviceInfo.slug },
                            update: {},
                            create: __assign(__assign({}, serviceInfo), { items: {
                                    create: items.map(function (item, index) { return ({
                                        item: item,
                                        displayOrder: index,
                                    }); }),
                                } }),
                        })];
                case 4:
                    service = _c.sent();
                    console.log('✅ Service created:', service.title);
                    _c.label = 5;
                case 5:
                    _i++;
                    return [3 /*break*/, 3];
                case 6:
                    faqs = [
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
                    _a = 0, faqs_1 = faqs;
                    _c.label = 7;
                case 7:
                    if (!(_a < faqs_1.length)) return [3 /*break*/, 11];
                    faq = faqs_1[_a];
                    return [4 /*yield*/, prisma.fAQ.findFirst({
                            where: { question: faq.question }
                        })];
                case 8:
                    existing = _c.sent();
                    if (!!existing) return [3 /*break*/, 10];
                    return [4 /*yield*/, prisma.fAQ.create({
                            data: faq,
                        })];
                case 9:
                    _c.sent();
                    _c.label = 10;
                case 10:
                    _a++;
                    return [3 /*break*/, 7];
                case 11:
                    console.log('✅ FAQs created');
                    settings = [
                        { key: 'company_name', value: 'Pulse Tronic', description: 'Nome da empresa' },
                        { key: 'company_phone', value: '(XX) XXXXX-XXXX', description: 'Telefone principal' },
                        { key: 'company_email', value: 'contato@pulsetronic.com.br', description: 'Email de contato' },
                        { key: 'company_address', value: 'Rua Example, 123 - Bairro\nCidade - Estado, CEP', description: 'Endereço completo' },
                        { key: 'company_whatsapp', value: '+5511999999999', description: 'WhatsApp' },
                        { key: 'working_hours', value: 'Segunda a Sexta: 8h às 18h\nSábado: 8h às 13h', description: 'Horário de funcionamento' },
                        { key: 'instagram_url', value: 'https://instagram.com/pulsetronic', description: 'Instagram' },
                        { key: 'facebook_url', value: 'https://facebook.com/pulsetronic', description: 'Facebook' },
                    ];
                    _b = 0, settings_1 = settings;
                    _c.label = 12;
                case 12:
                    if (!(_b < settings_1.length)) return [3 /*break*/, 15];
                    setting = settings_1[_b];
                    return [4 /*yield*/, prisma.settings.upsert({
                            where: { key: setting.key },
                            update: {},
                            create: setting,
                        })];
                case 13:
                    _c.sent();
                    _c.label = 14;
                case 14:
                    _b++;
                    return [3 /*break*/, 12];
                case 15:
                    console.log('✅ Settings created');
                    console.log('🎉 Seed completed successfully!');
                    console.log('');
                    console.log('📝 Default Admin Credentials:');
                    console.log('   Email: admin@pulsetronic.com.br');
                    console.log('   Password: admin123');
                    console.log('   ⚠️  CHANGE THIS PASSWORD IN PRODUCTION!');
                    return [2 /*return*/];
            }
        });
    });
}
main()
    .catch(function (e) {
    console.error('❌ Error during seed:', e);
    process.exit(1);
})
    .finally(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.$disconnect()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
