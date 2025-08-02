import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  output: 'export',
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lukeponga-dev.github.io',
        port: '',
        pathname: '/**',
      },
    ],
  },
  webpack: (config, { isServer }) => {
    config.resolve.alias = {
        ...config.resolve.alias,
        'handlebars': 'handlebars/dist/handlebars.js',
    };

    if (!isServer) {
      config.resolve.alias['@opentelemetry/exporter-jaeger'] = false;
      config.resolve.alias['@genkit-ai/firebase'] = false;
    }
    
    return config;
  },
};

export default nextConfig;
