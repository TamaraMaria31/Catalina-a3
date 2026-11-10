import { Link } from "react-router-dom";
import { CreditCard, RotateCcw, ShieldCheck, Truck } from "lucide-react";
import Button from "../ui/Button";
import ArchImage from "../ui/ArchImage";

const BENEFITS = [
  { icon: Truck, title: "Frete grátis", detail: "acima de R$ 499" },
  { icon: CreditCard, title: "Até 10x sem juros", detail: "no cartão de crédito" },
  { icon: RotateCcw, title: "Troca em 15 dias", detail: "sem custo" },
  { icon: ShieldCheck, title: "Compra segura", detail: "dados protegidos" },
];

export default function Hero() {
  return (
    <section className="bg-gradient-to-br from-[#F6F5EF] via-catalina-mist to-[#DCE0D0]">
      <div className="mx-auto grid max-w-6xl items-center gap-14 px-5 pb-12 pt-14 md:grid-cols-[1.05fr_1fr] md:pt-20">
        <div>
          <h1 className="text-[46px] leading-[1.02] sm:text-6xl lg:text-7xl">
            Seu casamento, dos sonhos à realidade.
          </h1>
          <p className="mt-6 max-w-md text-[16px] leading-relaxed text-catalina-text/80">
            Vestidos, trajes, flores, decoração e lembrancinhas, com lista de casamento e planejador de
            orçamento. Tudo para o seu grande dia, em um só lugar.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4">
            <Button to="/produtos/vestidos">Ver vestidos de noiva</Button>
            <Link to="/planejador" className="text-[14px] underline underline-offset-4 hover:text-catalina-sage">
              Planejar meu orçamento
            </Link>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[340px] pb-6 md:max-w-[400px]">
          <ArchImage
            src="/images/products/vestido-aurora.webp"
            alt="Noiva de vestido branco em um jardim"
            ratio="aspect-[3/4.1]"
            className="mx-auto w-[82%]"
            ring
            priority
          />
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-5 pb-10">
        <ul className="grid grid-cols-2 gap-x-6 gap-y-5 border-t border-catalina-leaf/70 pt-6 md:grid-cols-4">
          {BENEFITS.map(({ icon: Icon, title, detail }) => (
            <li key={title} className="flex items-center gap-3">
              <Icon size={20} strokeWidth={1.4} className="flex-shrink-0 text-catalina-sage" aria-hidden="true" />
              <div className="leading-tight">
                <p className="text-[14px] font-medium">{title}</p>
                <p className="text-[12px] text-catalina-muted">{detail}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
