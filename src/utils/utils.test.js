import { describe, expect, it } from "vitest";
import { daysUntil, formatPrice, slugify } from "./format";
import { calcShipping, computeTotals, findCoupon } from "./pricing";
import { formatCep, isValidCep, isValidEmail, isValidFullName } from "./validators";

describe("format", () => {
  it("formata preço em reais", () => {
    expect(formatPrice(3899.9).replace(/\s/g, " ")).toBe("R$ 3.899,90");
  });

  it("gera slug sem acentos nem símbolos", () => {
    expect(slugify("Ana & Pedro")).toBe("ana-pedro");
    expect(slugify("José Álvaro")).toBe("jose-alvaro");
  });

  it("usa o valor padrão quando o slug fica vazio", () => {
    expect(slugify("!!!")).toBe("meu-casamento");
  });

  it("conta dias até uma data e nunca retorna negativo", () => {
    const now = new Date("2026-10-01T00:00:00Z");
    expect(daysUntil("2026-10-11T00:00:00Z", now)).toBe(10);
    expect(daysUntil("2026-09-01T00:00:00Z", now)).toBe(0);
    expect(daysUntil(null, now)).toBeNull();
  });
});

describe("pricing", () => {
  it("reconhece cupons sem diferenciar maiúsculas", () => {
    expect(findCoupon("catalina10")).toEqual({ code: "CATALINA10", discount: 0.1 });
    expect(findCoupon(" noiva15 ")).toEqual({ code: "NOIVA15", discount: 0.15 });
    expect(findCoupon("INVALIDO")).toBeNull();
  });

  it("cobra frete abaixo de R$ 499 e dá frete grátis a partir dele", () => {
    expect(calcShipping(498.99)).toBe(29.9);
    expect(calcShipping(499)).toBe(0);
  });

  it("calcula subtotal, desconto, frete e total", () => {
    const items = [
      { price: 300, quantity: 1 },
      { price: 100, quantity: 2 },
    ];
    const totals = computeTotals(items, findCoupon("CATALINA10"));
    expect(totals.subtotal).toBe(500);
    expect(totals.discount).toBe(50);
    expect(totals.shipping).toBe(0);
    expect(totals.total).toBe(450);
    expect(totals.itemCount).toBe(3);
  });

  it("não cobra frete em carrinho vazio", () => {
    expect(computeTotals([]).total).toBe(0);
  });
});

describe("validators", () => {
  it("aplica a máscara de CEP", () => {
    expect(formatCep("01310100")).toBe("01310-100");
    expect(formatCep("01310-1009999")).toBe("01310-100");
  });

  it("valida CEP, e-mail e nome completo", () => {
    expect(isValidCep("01310-100")).toBe(true);
    expect(isValidCep("1234")).toBe(false);
    expect(isValidEmail("ana@email.com")).toBe(true);
    expect(isValidEmail("ana@email")).toBe(false);
    expect(isValidFullName("Ana Souza")).toBe(true);
    expect(isValidFullName("Ana")).toBe(false);
  });
});
