# Manhattan Project Kickass scraper

## Install
### Unix and OS/X
- Fork or download this repository.
- `cd` to the project's location
- run `npm install`

## Running in development
- run `npm start`
- run `npm run start`

## Running in production
- run `npm run build`


## Usage
``` js
const KAT = require('mp-kat-scraper')
const kat = new KAT()

const search = kat.search({
  query: 'Game of Thrones',
  language: 'en',
  sort_by: 'seeds',
  order: 'desc',
  category: 'tv'
})

search.then((result) => console.log(result))
search.catch((error) => console.log(error))
```
