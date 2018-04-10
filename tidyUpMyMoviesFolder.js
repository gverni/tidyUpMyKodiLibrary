const fetch = require('node-fetch')
const net = require('net')
const fs = require('fs')

// XBMC RPC connection info
const HOST = 'osmc'
const PORT = '9090'

// MySql connection info
const MYSQLSERVER = '192.168.0.1'
const MYSQLPORT = '3306'
const MYSQLUSER = 'kodi'
const MYSQLPASS = 'xbmc'

const CONNECTION = 'mysql' //  'mysql or 'kodi' (RPC)

const filesBaseFolder = '/Volumes/sdb3/Download/'
const kodiFolderBase = 'nfs://192.168.0.1/tmp/mnt/sdb3/Download/'

var tcpDataBuffer = ''

function logger (severity, logMessage) {
  if (severity < 3) {
    console.log(logMessage)
  } else if (severity === 3) {
    console.log('(' + logMessage + ')')
  }
}

async function searchMovie (title) {
  var titleFound = ''
  var searchTitle = title.split('.').join(' ')
  
  while (!titleFound || searchTitle.lenght !== 0) {
    await fetch('http://www.theimdbapi.org/api/find/movie?title=' + searchTitle)
    .then(res => res.json())
    .then(resJson => {
      titleFound = resJson.title
      return Promise.resolve()
    })
    .catch(() => {
      searchTitle = searchTitle.splice
      console.log('Not found. Seraching for ' + searchTitle)
      
    })
  }
}

function getFilesInFolder (folderName) {
  var everything = fs.readdirSync(folderName)
  var onlyFiles = everything.filter(function (element) {
    return !element.startsWith('.') & fs.statSync(folderName + element).isFile()
  })
  return onlyFiles
}

var onlyFiles = getFilesInFolder(filesBaseFolder)

logger(1, '--== File(s) not in a folder ==--')
logger(1, onlyFiles)
