/** @type {import('next').NextConfig} */
const nextConfig = {
  // 빌드에서 TS 타입 에러가 있어도 배포가 실패하지 않게 함
  typescript: {
    ignoreBuildErrors: true,
  },
  // ESLint 에러가 있어도 빌드 막지 않게 함
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
