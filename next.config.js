/** @type {import('next').NextConfig} */
const withReactSvg = require('next-react-svg')
const path = require('path')

module.exports = withReactSvg({
    webpack5: true,
    include: path.resolve(__dirname, 'public/icons'),
    images: {
        domains: [
            'urbanizacion.s3.amazonaws.com',
            'urbanizacion.s3.sa-east-1.amazonaws.com',
        ],
    },
    async redirects() {
        return [
            {
                source: '/',
                destination: '/login',
                permanent: false,
            },
        ]
    },
    webpack: (config) => {
        config.resolve.fallback = { fs: false }
        config.module.rules.push({
            test: /\.svg$/,
            use: ['@svgr/webpack'],
        })

        return config
    },
})

// /** @type {import('next').NextConfig} */

// const withFonts = require('next-fonts');
// const withImages = require('next-images');
// const withPlugins = require('next-compose-plugins');
// const withGraphql = require('next-plugin-mini-graphql');
// const bundleAnalyzer = require('@next/bundle-analyzer');

// const nextConfig = {
//   // Do not show the X-Powered-By header in the responses
//   poweredByHeader: false,
//   devIndicators: {
//     // Do not show intrusive "Pre-rendered page" floating labels
//     // at the bottom of the page
//     autoPrerender: false
//   },

//   async redirects() {
//     return [
//       {
//         source: '/',
//         destination: '/login',
//         permanent: false,
//       },
//     ]
//   },
// }

// module.exports = withPlugins([withGraphql, withImages, withFonts], nextConfig);
