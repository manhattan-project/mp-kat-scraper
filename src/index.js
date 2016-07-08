import request from 'axios'
import bytes from 'bytes'
import cheerio from 'cheerio'
import {languageMap, prms} from './utils'

const defaultOptions = {
  'timeout': 3000
}

const urls = [
  'https://kat.cr/usearch',
  'https://kickassto.co/usearch'
]

class KAT {

  constructor (options = defaultOptions) {
    this.request = request.create({
      ...options,
      baseURL: urls[0]
    })
  }

  search = async (query) => {
    const endpoint = this.queryCreator(query)
    /* requested current time */
    const rT = Date.now()
    const data = (await this.request.get(endpoint)).data
    return this.format(data, query.page, Date.now() - rT)
  }

  queryCreator (query) {
    if (!query) throw Error('Query is required.')
    if (typeof query === 'string') return query
    if (typeof query !== 'object') throw Error('Not a valid Query.')

    let params = typeof query.query === 'string'
      ? query.query
      : ''

    Object.keys(prms).forEach((k) => {
      if (query[k]) params += ` ${prms[k]}:${query[k]}`
    })

    if (query.language && languageMap[query.language])
      params += ` lang_id:${languageMap[query.language]}`

    if (query.page) params += `/${query.page}`
    if (query.sort_by) params += `/?field=${query.sort_by}`
    if (query.order) params += `&order=${query.order}`

    return params
  }

  format (data, page = 1, date) {
    const $ = cheerio.load(data)
    const results = []

    const totalResults = $('table#mainSearchTable.doublecelltable')
      .find('h2')
      .find('span')
      .text()
      .match(/\s+[a-zA-Z]+\s\d+[-]\d+\s[a-zA-Z]+\s(\d+)/)

    const totalPages = $('div.pages.botmarg5px.floatright')
      .children('a.turnoverButton.siteButton.bigButton')
      .last()
      .text()

    $('table.data').find('tr[id]').each(function () {
      const el = $(this)
      const obj = {}

      obj.title = el
        .find('a.cellMainLink')
        .text()

      obj.category = el
        .find('span.font11px.lightgrey.block')
        .find('a[href]')
        .last()
        .text()

      obj.link = el
        .find('a.cellMainLink[href]')
        .attr('href')

      obj.guid = el
        .find('a.cellMainLink[href]')
        .attr('href')

      obj.verified = el
        .find('i.ka.ka16.ka-verify.ka-green')
        .length

      obj.comments = parseInt(el
        .find('a.icommentjs.kaButton.smallButton.rightButton')
        .text())

      obj.magnet = el
        .find('a.icon16[data-nop]')
        .attr('href')

      obj.torrentLink = el
        .find('a.icon16[data-download]')
        .attr('href')

      obj.fileSize = el
        .find('td.center')
        .eq(0)
        .text()

      obj.files = parseInt(el
        .find('td.center')
        .eq(1)
        .text())

      obj.seeds = parseInt(el
        .find('td.center')
        .eq(3)
        .text())

      obj.leechs = parseInt(el
        .find('td.center')
        .eq(4)
        .text())

      obj.pubDate = Number(new Date(el
        .find('td.center')
        .eq(2)
        .attr('title')))

      obj.size = bytes(el
        .find('td.center')
        .eq(0)
        .text())

      results.push(obj)
    })

    return {
      response_time: parseInt(date),
      page: parseInt(page),
      totalResults: parseInt(totalResults[1]),
      totalPages: totalPages || 1,
      results: results
    }
  }

}

/* weird bug with export default... */
module.exports = KAT
