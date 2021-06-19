const nextTranslate = require('next-translate');

// module.exports = nextTranslate();

module.exports = nextTranslate({
  experimental: {
    scrollRestoration: true
  },
  future: {
    webpack5: false
  },
  images: {
    domains: ['restaurantdem.com']
  },
  eslint: {
    ignoreDuringBuilds: true
  }
})