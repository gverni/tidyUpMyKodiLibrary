const cheerio = require('cheerio')
const fetch = require('node-fetch')
var found = false 

const urlTypeTv = 'tv'
const urlTypeTvEpisode = 'ep'
const urlTypeMovie = 'ft'

var queryType = urlTypeMovie
var queryTitle = 'The Edge of Seventeen 2016 720p WEB-DL 999MB ShAaNiG mkv'
//var queryTitle = encodeURI('The Edge of Seventeen 2016')

// var searchUrl = `http://www.imdb.com/find?q=${queryTitle}&ttype=${queryType}&s=tt`
//console.log('Fetching ' + urlTemplate)
while (!found && queryTitle.length > 0) {
    console.log('Searching ' + queryTitle)
    let searchUrl = encodeURI(`http://www.imdb.com/find?q=${queryTitle}&ttype=${queryType}&s=tt`)
    await fetch(searchUrl)
    .then(response => response.text())
    .then(responseHtml => {
      const $ = cheerio.load(responseHtml)
      //console.log($.html())
      if ($('.findResult')) {
          found = true 
          console.log($('.findResult').html())
      }
    })
    queryTitle = queryTitle.split(' ').slice(0, -1).join(' ')
}
