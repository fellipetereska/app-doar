# DOAR - Plataforma de Doações (Frontend)

Este repositório contém o frontend da plataforma **DOAR**, um sistema que conecta doadores a instituições (ONGs), permitindo o cadastro, gestão e destinação de itens físicos (não alimentares).

## 🔧 Tecnologias

- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Leaflet](https://react-leaflet.js.org/) (mapas interativos)
- [Axios](https://axios-http.com/) (requisições HTTP)
- [React Router Dom](https://reactrouter.com/) (roteamento SPA)
- [Cloudinary](https://cloudinary.com/) (armazenamento de imagens)

## 🚀 Funcionalidades

- Cadastro e login de doadores e instituições
- Cadastro de doações com imagens, categorias e estado do item
- Visualização de mapa com instituições próximas
- Listagem e histórico de doações
- Responsividade e acessibilidade (WCAG 2.1)

## 📁 Estrutura de Pastas

src/
├── components/ # Componentes reutilizáveis da interface
├── pages/ # Telas principais vinculadas a rotas
├── services/ # Comunicação com a API (Axios)
├── contexts/ # Contextos globais (ex: AuthContext)
├── hooks/ # Hooks customizados
├── media/ # Imagens e recursos estáticos
├── App.jsx # Componente principal de rotas
└── main.jsx # Ponto de entrada da aplicação

## 🛠️ Como rodar o projeto

# Clonar o repositório
git clone https://github.com/fellipetereska/app-doar.git
cd app-doar

# Instalar dependências
npm install

# Rodar o projeto
npm start



