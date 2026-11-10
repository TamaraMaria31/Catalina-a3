import { useEffect, useState } from "react";
import { Flower2 } from "lucide-react";
import { fetchImageUrl } from "../../services/imageService";

/**
 * Preenche o container pai (precisa de position: relative e overflow-hidden).
 * Ordem: foto local (src) → foto do Pexels (query) → ícone de flor sobre degradê.
 */
export default function ProductImage({ src, query, alt = "" }) {
  const [remote, setRemote] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    setRemote(null);
    setLoaded(false);
    if (!src && query) {
      fetchImageUrl(query).then((result) => {
        if (active) setRemote(result);
      });
    }
    return () => {
      active = false;
    };
  }, [src, query]);

  const url = src || remote;

  if (url) {
    return (
      <img
        src={url}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
      />
    );
  }

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-catalina-sand to-catalina-sand2">
      <Flower2 size={36} strokeWidth={1.25} className="text-catalina-sage opacity-50" />
    </div>
  );
}
