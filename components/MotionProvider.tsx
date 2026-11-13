"use client";
// Proveedor global de animaciones.
// reducedMotion="user" respeta la preferencia del sistema (prefers-reduced-motion).
import { MotionConfig } from "framer-motion";

export default function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
