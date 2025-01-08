/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  async redirects() {
    return [
      {
        source: '/admin',
        destination: '/admin/product',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
