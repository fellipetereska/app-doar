import placeholderImage from "../../../media/images.png";
import ong1 from "../../../media/ong1.jpeg";
import ong2 from "../../../media/ong2.jpeg";
import ong3 from "../../../media/ong3.png";
import ong4 from "../../../media/ong4.jpeg";
import ong5 from "../../../media/ong5.png";

const companies = [
  {
    id: 1,
    name: "ONG Esperança de Londrina",
    lat: -23.320523, // Bairro Antares
    lng: -51.135323,

    image: ong1,
    description:
      "Atendemos famílias em situação de vulnerabilidade social com alimentos e roupas.",
    donationInfo: {
      hours: "Segunda a Sexta, das 8h às 17h",
      address: "Rua Maringá, 123 - Centro",
      items: [
        "Cestas básicas",
        "Roupas Adultas",
        "Produtos de Higiene",
        "Móveis",
        "Eletrodomésticos",
        "Calçados",
      ],
    },
    contact: {
      email: "contato@esperancalondrina.org.br",
      phone: "(43) 3321-4567",
    },
    categories: [
      "Alimentos",
      "Roupas e Calçados",
      "Produtos de Higiene e Limpeza",
      "Móveis",
      "Eletrodomésticos",
      "Calçados",
    ],
  },
  {
    id: 2,
    name: "Casa do Bem Londrinense",
    lat: -23.305, // mais perto do Pacaembu
    lng: -51.159,
    image: ong2,
    description:
      "Abrigo para crianças e adolescentes com programas educacionais e de lazer.",
    donationInfo: {
      hours: "Terça a Domingo, das 9h às 18h",
      address: "Avenida Higienópolis, 456 - Higienópolis",
      items: [
        "Brinquedos",
        "Material Escolar",
        "Livros Infantis",
        "Móveis",
        "Eletrodomésticos",
        "Equipamentos Eletrônicos",
      ],
    },
    contact: {
      email: "casadobem@londrina.org.br",
      phone: "(43) 3334-5678",
    },
    categories: [
      "Brinquedos",
      "Livros e Materiais Educacionais",
      "Móveis",
      "Eletrodomésticos",
      "Equipamentos Eletrônicos",
      "Material Escolar",
    ],
  },
  {
    id: 3,
    name: "Lar dos Idosos São Vicente",
    lat: -23.2956,
    lng: -51.1821,
    image: ong3,
    description:
      "Acolhimento para idosos carentes com necessidades de produtos específicos.",
    donationInfo: {
      hours: "Todos os dias, das 7h às 19h",
      address: "Rua Piauí, 789 - Vila Brasil",
      items: [
        "Fraldas Geriátricas",
        "Produtos de Higiene",
        "Cadeiras de Rodas",
        "Móveis",
        "Eletrodomésticos",
        "Roupas",
      ],
    },
    contact: {
      email: "larsaovicente@londrina.org.br",
      phone: "(43) 3345-6789",
    },
    categories: [
      "Produtos de Higiene e Limpeza",
      "Móveis",
      "Eletrodomésticos",
      "Roupas",
      "Equipamentos Médicos",
      "Fraldas Geriátricas",
    ],
  },
  {
    id: 4,
    name: "Projeto Futuro Brilhante",
    lat: -23.289, // para o bairro Ideal
    lng: -51.148,
    image: ong4,
    description:
      "Iniciativa comunitária para educação infantil e capacitação profissional.",
    donationInfo: {
      hours: "Segunda a Sexta, das 13h às 20h",
      address: "Rua Londrina, 101 - Jardim Igapó",
      items: [
        "Computadores Usados",
        "Livros Técnicos",
        "Material de Escritório",
        "Móveis",
        "Eletrodomésticos",
        "Materiais de Informática",
      ],
    },
    contact: {
      email: "futurobrilhante@projeto.org.br",
      phone: "(43) 3356-7890",
    },
    categories: [
      "Livros e Materiais Educacionais",
      "Móveis",
      "Eletrodomésticos",
      "Material de Escritório",
      "Computadores",
      "Materiais de Informática",
    ],
  },
  {
    id: 5,
    name: "Associação Amigos",
    lat: -23.32,
    lng: -51.175,
    image: ong5,
    description:
      "ONG de proteção de que precisa de doações para manter seus abrigos.",
    donationInfo: {
      hours: "Quarta a Domingo, das 10h às 16h",
      address: "Rua dos Bichos, 202 - Zona Norte",
      items: [
        "Rações para Cães e Gatos",
        "Medicamentos Veterinários",
        "Cobertores e Toalhas",
        "Móveis",
        "Eletrodomésticos",
        "Equipamentos Veterinários",
      ],
    },
    contact: {
      email: "amigosdosanimais@londrina.org.br",
      phone: "(43) 3367-8901",
    },
    categories: [
      "Produtos de Higiene e Limpeza",
      "Roupas e Calçados",
      "Móveis",
      "Eletrodomésticos",
      "Equipamentos Veterinários",
      "Cobertores e Toalhas",
    ],
  },
  {
    id: 6,
    name: "Cáritas de Londrina",
    lat: -23.3075,
    lng: -51.1735,
    image: placeholderImage,
    description:
      "Organização religiosa sem fins lucrativos que apoia famílias e comunidades em vulnerabilidade social.",
    donationInfo: {
      hours: "Segunda a Sexta, das 8h às 17h30",
      address: "Rua Dom Bosco, 145 - Jardim Dom Bosco, Londrina - PR",
      items: [
        "Alimentos não perecíveis",
        "Roupas Adultas e Infantis",
        "Cobertores",
        "Produtos de Higiene Pessoal",
        "Material Escolar",
        "Móveis",
      ],
    },
    contact: {
      email: "contato@caritaslondrina.org.br",
      phone: "(43) 3338-7252",
    },
    categories: [
      "Alimentos",
      "Roupas e Calçados",
      "Produtos de Higiene e Limpeza",
      "Material Educacional",
      "Móveis",
      "Cobertores",
    ],
  },
];

export default companies;
