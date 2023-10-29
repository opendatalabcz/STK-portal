/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
            {
                source: '/api/:route',
                destination: 'http://127.0.0.1:5052/:route',
            },
        ]
    },
}

module.exports = nextConfig
