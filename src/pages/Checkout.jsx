import { useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, CreditCard, FileText, QrCode } from "lucide-react";
import { useCart } from "../context/CartContext";
import Button from "../components/ui/Button";
import usePageTitle from "../hooks/usePageTitle";
import { formatPrice } from "../utils/format";
import { formatCep, isValidCep, isValidEmail, isValidFullName } from "../utils/validators";

const PAYMENT_METHODS = [
  { id: "pix", label: "Pix", icon: QrCode, hint: "Aprovação imediata" },
  { id: "cartao", label: "Cartão de crédito", icon: CreditCard, hint: "Em até 10x sem juros" },
  { id: "boleto", label: "Boleto", icon: FileText, hint: "Compensação em até 2 dias úteis" },
];

const FIELDS = [
  { name: "nome", label: "Nome completo", autoComplete: "name", wide: true },
  { name: "email", label: "E-mail", type: "email", autoComplete: "email", wide: true },
  { name: "cep", label: "CEP", autoComplete: "postal-code", inputMode: "numeric", maxLength: 9 },
  { name: "cidade", label: "Cidade", autoComplete: "address-level2" },
  { name: "endereco", label: "Endereço completo", autoComplete: "street-address", wide: true },
];

function validate(form) {
  const errors = {};
  if (!isValidFullName(form.nome)) errors.nome = "Digite nome e sobrenome.";
  if (!isValidEmail(form.email)) errors.email = "Digite um e-mail válido.";
  if (!isValidCep(form.cep)) errors.cep = "O CEP tem 8 números.";
  if (!form.cidade.trim()) errors.cidade = "Informe a cidade.";
  if (form.endereco.trim().length < 5) errors.endereco = "Informe rua, número e bairro.";
  return errors;
}

export default function Checkout() {
  usePageTitle("Finalizar compra");
  const { items, subtotal, discount, shipping, total, clearCart } = useCart();
  const [step, setStep] = useState("form"); // form | confirmed
  const [payment, setPayment] = useState("pix");
  const [form, setForm] = useState({ nome: "", email: "", cep: "", endereco: "", cidade: "" });
  const [errors, setErrors] = useState({});
  const [orderId] = useState(() => Math.floor(100000 + Math.random() * 900000));

  if (items.length === 0 && step === "form") {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-5 text-center">
        <p className="mb-4 text-[18px]">Seu carrinho está vazio.</p>
        <Link to="/produtos" className="text-catalina-sage underline">
          Explorar produtos
        </Link>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: name === "cep" ? formatCep(value) : value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    setStep("confirmed");
    clearCart();
  };

  if (step === "confirmed") {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center bg-catalina-cream px-5 text-center">
        <CheckCircle2 size={48} strokeWidth={1.4} className="mb-4 text-catalina-sage" />
        <h1 className="mb-2 text-[34px]">Pedido confirmado</h1>
        <p className="mb-1 text-[14px] text-catalina-muted">
          Número do pedido: <strong>#{orderId}</strong>
        </p>
        <p className="mb-8 max-w-md text-[14px] text-catalina-muted">
          Enviamos os detalhes para {form.email}. Você pode acompanhar o status na sua conta.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button to="/minha-conta">Ver meus pedidos</Button>
          <Button to="/" variant="outline">
            Voltar à home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-catalina-cream">
      <div className="mx-auto max-w-6xl px-5 py-10">
        <h1 className="mb-8 text-[36px]">Finalizar compra</h1>
        <form onSubmit={handleSubmit} noValidate className="grid gap-10 lg:grid-cols-[1fr_340px]">
          <div className="flex flex-col gap-8">
            <section>
              <h2 className="mb-4 text-[26px]">Dados de entrega</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {FIELDS.map((field) => (
                  <div key={field.name} className={field.wide ? "sm:col-span-2" : ""}>
                    <label htmlFor={field.name} className="mb-1.5 block text-[13px] text-catalina-muted">
                      {field.label}
                    </label>
                    <input
                      id={field.name}
                      name={field.name}
                      type={field.type || "text"}
                      value={form[field.name]}
                      onChange={handleChange}
                      autoComplete={field.autoComplete}
                      inputMode={field.inputMode}
                      maxLength={field.maxLength}
                      aria-invalid={Boolean(errors[field.name])}
                      aria-describedby={errors[field.name] ? `${field.name}-erro` : undefined}
                      className={`w-full rounded-xl border bg-white px-4 py-3 text-[14px] outline-none focus:border-catalina-green ${
                        errors[field.name] ? "border-[#B23A3A]" : "border-catalina-border"
                      }`}
                    />
                    {errors[field.name] && (
                      <p id={`${field.name}-erro`} className="mt-1.5 text-[12px] text-[#B23A3A]">
                        {errors[field.name]}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>

            <fieldset>
              <legend className="mb-4 text-[26px] font-display">Forma de pagamento</legend>
              <div className="flex flex-col gap-3">
                {PAYMENT_METHODS.map((m) => (
                  <label
                    key={m.id}
                    className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition-colors ${
                      payment === m.id ? "border-catalina-green bg-catalina-sand" : "border-catalina-border bg-white"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={payment === m.id}
                      onChange={() => setPayment(m.id)}
                      className="accent-[#4A5636]"
                    />
                    <m.icon size={18} className="text-catalina-sage" aria-hidden="true" />
                    <div>
                      <p className="text-[14px]">{m.label}</p>
                      <p className="text-[12px] text-catalina-muted">{m.hint}</p>
                    </div>
                  </label>
                ))}
              </div>
            </fieldset>
          </div>

          <aside className="h-fit rounded-2xl border border-catalina-sand bg-white p-6">
            <h2 className="mb-4 text-[24px]">Resumo</h2>
            <div className="mb-4 flex max-h-56 flex-col gap-2 overflow-y-auto">
              {items.map((item) => (
                <div key={item.key} className="flex justify-between gap-3 text-[13px] text-catalina-text/80">
                  <span>
                    {item.name} × {item.quantity}
                  </span>
                  <span className="flex-shrink-0">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-2 border-t border-catalina-sand pt-4 text-[14px] text-catalina-text/80">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-catalina-sage">
                  <span>Desconto</span>
                  <span>−{formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Frete</span>
                <span>{shipping === 0 ? "Grátis" : formatPrice(shipping)}</span>
              </div>
            </div>
            <div className="mb-6 mt-4 flex justify-between border-t border-catalina-sand pt-4 text-[18px]">
              <span>Total</span>
              <span className="text-catalina-sage">{formatPrice(total)}</span>
            </div>
            <Button type="submit" className="w-full">
              Confirmar pedido
            </Button>
          </aside>
        </form>
      </div>
    </div>
  );
}
