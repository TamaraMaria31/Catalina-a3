/**
 * Foto com topo em arco, o motivo visual da marca.
 * `ring` desenha um contorno fino em arco um pouco afastado da foto.
 * O tamanho vem do pai (largura) e da proporção (`ratio`).
 */
export default function ArchImage({ src, alt, ring = false, priority = false, ratio = "aspect-[3/4]", className = "" }) {
  return (
    <div className={`relative ${className}`}>
      {ring && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -inset-2.5 rounded-t-full border border-catalina-leaf/70"
        />
      )}
      <div className={`relative overflow-hidden rounded-t-full bg-catalina-sand ${ratio}`}>
        <img
          src={src}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
    </div>
  );
}
