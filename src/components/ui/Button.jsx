import { Link } from "react-router-dom";

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-[14px] font-medium transition-colors disabled:opacity-60";

const VARIANTS = {
  // Fundo claro
  primary: "bg-catalina-green text-white hover:bg-catalina-greenDark",
  outline: "border border-catalina-green text-catalina-green hover:bg-catalina-green hover:text-white",
  // Fundo escuro (verde-floresta)
  leaf: "bg-catalina-leaf text-catalina-forest hover:bg-catalina-leafHover",
  outlineLight: "border border-catalina-leaf/70 text-catalina-onDark hover:bg-catalina-leaf hover:text-catalina-forest",
};

/** Botão do site. Com a prop `to` vira um link do React Router; sem ela, um <button>. */
export default function Button({ to, variant = "primary", className = "", children, ...props }) {
  const classes = `${BASE} ${VARIANTS[variant]} ${className}`;
  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {children}
      </Link>
    );
  }
  return (
    <button type="button" className={classes} {...props}>
      {children}
    </button>
  );
}
