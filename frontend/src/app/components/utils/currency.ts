// utils/currency.ts

/**
 * Formatea un número como pesos argentinos
 * Ej: 45000 -> 45.000$
 */
export function formatARS(amount: number): string {
  return `${new Intl.NumberFormat("es-AR").format(amount)}$`;
}

/**
 * Función genérica para cualquier moneda
 * Ej: formatCurrency(45000, 'en-US', 'USD') -> $45,000.00
 */
export function formatCurrency(amount: number, locale: string, currency: string): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(amount);
}