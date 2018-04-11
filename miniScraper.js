const cheerio = require('cheerio')
const fetch = require('node-fetch')

function scrapeTitle (stringToScrape) {
  var results = /<a.*?>(.*?)<\/a>\s(.*?)\s/.exec(stringToScrape)
  return results[1] + ' ' + results[2]
}

async function searchTitleFromString (stringTitle) {
  const urlTypeTv = 'tv'
  const urlTypeTvEpisode = 'ep'
  const urlTypeMovie = 'ft'

  var queryType = urlTypeMovie
  var queryTitle = stringTitle.replace(/[^a-zA-z0-9]/g,' ')
  var result = ''
  while (!result && queryTitle.length > 0) {
    console.log('Searching ' + queryTitle)
    let searchUrl = encodeURI(`http://www.imdb.com/find?q=${queryTitle}&ttype=${queryType}&s=tt`)
    await fetch(searchUrl)
      .then(response => response.text())
      .then(responseHtml => {
        const $ = cheerio.load(responseHtml)
        if ($('.findResult').length) {
          result = $('.findResult .result_text').html()
        }
      })
    queryTitle = queryTitle.split(' ').slice(0, -1).join(' ')
  }
  return result ? Promise.resolve(result) : Promise.reject('No result found')
}

searchTitleFromString('The.Edge.of.Seventeen.2016.720p.WEB-DL.999MB.ShAaNiG.mkv')
  .then(result => {
    console.log('Found ' + scrapeTitle(result))
  })
  .catch((err) => {
    console.log('Error: ' + err)
  })
