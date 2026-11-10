/** Identidade visual da Catalina Marriage: verde-floresta, verde-oliva, sálvia e tons de areia. */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        catalina: {
          forest: "#172312", // seções escuras e rodapé
          forestSoft: "#22331B", // cartões sobre o verde-floresta
          green: "#4A5636", // botões principais
          greenDark: "#3D4A2C",
          sage: "#5C6B47", // links e destaques sobre fundo claro
          leaf: "#A9B58E", // botões e detalhes sobre fundo escuro
          leafHover: "#BAC4A2",
          cream: "#FAF8F3", // fundo principal
          mist: "#EEEFE7", // seções claras alternadas
          sand: "#EFEAE1",
          sand2: "#E3DCCC",
          gold: "#B8935A",
          text: "#302B29",
          muted: "#7D786C",
          border: "#C9C2AE",
          onDark: "#E9E4D6", // texto sobre verde-floresta
          onDarkMuted: "#B7BDA5",
        },
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', "Georgia", "serif"],
        sans: ['"DM Sans"', "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
      },
    },
  },
  plugins: [],
};
