const nextTranslate = require('next-translate')

module.exports = nextTranslate()

module.exports = nextTranslate({
  experimental: {
    scrollRestoration: true
  },
  future: {
        webpack5: false,
      },
})

// module.exports = {
//   future: {
//     webpack5: false,
//   },
//   experimental: {
//     scrollRestoration: true
//   }
// }