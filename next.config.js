const ContentSecurityPolicy = `
  default-src 'none' ;
  script-src-elem 'self';
  script-src-attr 'self';
  script-src 'self' ${
    process.env.NODE_ENV === "development" ? "'unsafe-eval'" : ''
  };
  connect-src 'self' http://127.0.0.1:8090;
  style-src 'self' ${
    process.env.NODE_ENV === "development" ? "'unsafe-inline'" : ''
  };
  font-src 'self';
  img-src 'self';
`;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  headers: async () => {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: ContentSecurityPolicy.replace(/\s{2,}/g, " ").trim(),
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
