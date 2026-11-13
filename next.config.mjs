// Configuración de Next.js.
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Permite cargar imágenes optimizadas desde Cloudinary.
    remotePatterns: [{ protocol: "https", hostname: "res.cloudinary.com" }],
  },
};

export default nextConfig;
