import { Link } from "react-router-dom";

/**
 * Botão em "caixinhas": cada letra vira uma caixa. Ao passar o mouse, as caixas
 * deslizam (umas para cima, outras para baixo) e revelam outra palavra.
 * `label` e `hoverLabel` devem ter o mesmo número de letras.
 */
export default function LetterButton({ to, label, hoverLabel, className = "" }) {
  const letters = Array.from(label);
  const hover = Array.from(hoverLabel || label);

  return (
    <Link
      to={to}
      aria-label={label}
      className={`letter-btn inline-flex overflow-hidden rounded-full shadow-sm ${className}`}
    >
      {letters.map((char, i) => (
        <span
          key={i}
          aria-hidden="true"
          data-hover={hover[i] ?? char}
          data-dir={i % 2 === 0 ? "up" : "down"}
          className="letter-box"
        >
          {char === " " ? " " : char}
        </span>
      ))}
    </Link>
  );
}
