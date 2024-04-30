/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
            {
                source: '/api/:route',
                destination: (process.env.API_URL ?? 'http://127.0.0.1:5052') + '/:route',
            },
        ]
    },
    env: {
        api: process.env.API_URL ?? 'http://127.0.0.1:5052',
    },
    // Docker configuration
    output: "standalone",
}

module.exports = nextConfig
