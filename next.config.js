/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Handle pdf-parse issues by ignoring problematic files
      config.resolve.alias = {
        ...config.resolve.alias,
        'canvas': false,
        'jsdom': false
      };
      
      // Add fallbacks for Node.js modules
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
        stream: false,
        util: false,
        buffer: false,
        assert: false,
        url: false,
        zlib: false
      };
    }
    
    // Ignore pdf-parse test files completely
    config.module = config.module || {};
    config.module.rules = config.module.rules || [];
    config.module.rules.push({
      test: /pdf-parse/,
      use: {
        loader: 'string-replace-loader',
        options: {
          search: /require\(['"]\.\/test\/.*?['"]\)/g,
          replace: 'null'
        }
      }
    });
    
    return config;
  },
  images: {
    domains: ['localhost'],
    unoptimized: true
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  swcMinify: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
    ]
  },
}

module.exports = nextConfig