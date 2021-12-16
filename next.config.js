/** @type {import('next').NextConfig} */

const withFonts = require('next-fonts');
const withImages = require('next-images');
const withPlugins = require('next-compose-plugins');
const withGraphql = require('next-plugin-mini-graphql');
const bundleAnalyzer = require('@next/bundle-analyzer');



const nextConfig = {
  // Do not show the X-Powered-By header in the responses
  poweredByHeader: false,
  devIndicators: {
    // Do not show intrusive "Pre-rendered page" floating labels
    // at the bottom of the page
    autoPrerender: false
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
}

module.exports = withPlugins([withGraphql, withImages, withFonts], nextConfig);
