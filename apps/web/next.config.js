/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    '@ai-interviewer/shared',
    '@ai-interviewer/config',
    '@ai-interviewer/interview-engine',
  ],
};

module.exports = nextConfig;
