import { Check } from "lucide-react";
import Button from "../ui/Button";
import ArchImage from "../ui/ArchImage";

const POINTS = [
  "Orçamento dividido por categoria, conforme o estilo do casamento",
  "Lista de casamento com link para compartilhar com os convidados",
  "Contagem regressiva e checklist na sua conta",
];

export default function PlannerBand() {
  return (
    <section className="bg-catalina-mist">
      <div className="mx-auto grid max-w-6xl items-center gap-14 px-5 py-20 md:grid-cols-2">
        <div className="relative mx-auto w-full max-w-[420px] pb-6">
          <ArchImage
            src="/images/products/arco-floral-encanto.jpg"
            alt="Cerimônia decorada com um arco de flores amarelas e brancas"
            className="ml-2 w-[80%]"
            ring
          />
          <ArchImage
            src="/images/products/tiara-crystal.jpg"
            alt="Noiva de perfil usando uma tiara de cristais"
            className="absolute bottom-0 right-0 w-[38%]"
            ring
          />
        </div>

        <div>
          <h2 className="text-4xl leading-[1.1] sm:text-5xl">Planeje o casamento no seu ritmo</h2>
          <p className="mt-4 max-w-md text-[16px] leading-relaxed text-catalina-text/80">
            Informe seu orçamento e veja quanto reservar para cada item. Depois, monte a lista de presentes e
            envie o link para os convidados.
          </p>
          <ul className="mt-6 space-y-3">
            {POINTS.map((point) => (
              <li key={point} className="flex items-start gap-3 text-[15px]">
                <Check size={18} strokeWidth={1.6} className="mt-0.5 flex-shrink-0 text-catalina-sage" aria-hidden="true" />
                {point}
              </li>
            ))}
          </ul>
          <div className="mt-9 flex flex-wrap gap-4">
            <Button to="/planejador">Abrir o planejador</Button>
            <Button to="/lista-de-casamento" variant="outline">
              Criar lista de casamento
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
