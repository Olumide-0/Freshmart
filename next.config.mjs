/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Uploaded product images (admin form). Only our Cloudinary account.
    remotePatterns: [{ protocol: "https", hostname: "res.cloudinary.com", pathname: "/mfhz2rws/**" }],
  },
};

export default nextConfig;
