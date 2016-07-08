const KAT = require('../lib/mp-kat-scraper.js')
const kat = new KAT()

/* TODO: proper tests */

kat.search({
  query: 'Game of Thrones',
  language: 'en',
  sort_by: 'seeds',
  order: 'desc',
  category: 'tv'
})
.then((result) => {
  console.log(result)
})
.catch((err) => {
  console.error(err)
})
