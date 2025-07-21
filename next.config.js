/** @type {import('next').NextConfig} */
const nextConfig = {
    // Allow connections to FastAPI backend
    async rewrites() {
        return [
            {
                source: '/api/backend/:path*',
                destination: 'http://localhost:8000/:path*',
            },
        ]
    },

    // Environment variables
    env: {
        FASTAPI_URL: process.env.FASTAPI_URL || 'http://localhost:8000',
    },

    // CORS and API configuration
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    {
                        key: 'Access-Control-Allow-Origin',
                        value: '*',
                    },
                    {
                        key: 'Access-Control-Allow-Methods',
                        value: 'GET, POST, PUT, DELETE, OPTIONS',
                    },
                    {
                        key: 'Access-Control-Allow-Headers',
                        value: 'Content-Type, Authorization',
                    },
                ],
            },
        ]
    },
}

module.exports = nextConfig 