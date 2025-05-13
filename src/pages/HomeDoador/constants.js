export const companies = [
  {
    id: 1,
    name: "Empresa Solidária",
    lat: -23.2927,
    lng: -51.1732,
    image: "../../media/images.png",
    description: "Empresa comprometida com causas sociais e ambientais, aceitando doações de alimentos, roupas e materiais escolares.",
    donationInfo: {
      hours: "Segunda a Sexta, das 9h às 17h",
      address: "Rua Principal, 123 - Centro",
      items: [
        "Alimentos não perecíveis",
        "Roupas em bom estado",
        "Materiais escolares",
        "Produtos de higiene",
      ],
    },
    contact: {
      email: "contato@empresasolidaria.com",
      phone: "(43) 1234-5678",
    },
    categories: [
      "Alimentos",
      "Roupas e Calçados",
      "Produtos de Higiene e Limpeza",
    ],
  },
  // ... outras empresas ...
];

export const donationCategories = {
  Alimentos: {
    subcategories: ["Cestas básicas"],
  },
  "Roupas e Calçados": {
    subcategories: ["Roupas Infantis", "Roupas Adultas", "Calçados"],
  },
};