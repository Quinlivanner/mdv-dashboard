// next.config.ts
import type {NextConfig} from "next";

const nextConfig: NextConfig = {
    // 取消eslint 检查
    eslint: {
        ignoreDuringBuilds: true,
    },
    // 取消路径别名检查
    typescript: {
        ignoreBuildErrors: true,
    },
    reactStrictMode: false,
};

export default nextConfig;