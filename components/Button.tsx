// Botón reutilizable con las variantes de la marca.
import { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  // primary = terracota (acción principal); outline = borde carbón; dark = fondo carbón.
  variant?: "primary" | "outline" | "dark";
};

// Clases comunes a todas las variantes.
const base =
  "inline-flex items-center justify-center px-6 py-3 text-sm font-medium uppercase tracking-widest transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50";

// Clases propias de cada variante.
const variants = {
  primary: "bg-terracotta text-cream hover:bg-terracotta-dark",
  outline: "border border-charcoal text-charcoal hover:bg-charcoal hover:text-cream",
  dark: "bg-charcoal text-cream hover:bg-charcoal-soft",
};

export default function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  // Combina base + variante + clases extra recibidas por props.
  return <button className={`${base} ${variants[variant]} ${className}`} {...props} />;
}
