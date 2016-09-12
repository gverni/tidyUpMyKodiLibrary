
const request = require('request')
const net = require ('net')
const fs = require('fs')

const HOST = 'osmc'
const PORT = '9090'
const localFolderBase = '/Volumes/sdb3/Download/'
const kodiFolderBase = 'nfs://192.168.0.1/tmp/mnt/sdb3/Download/'

var tcpDataBuffer = ''

var stringJsonGetMoviesList = '{"jsonrpc": "2.0", "method": "VideoLibrary.GetMovies", "params": { "properties" : ["file", "year"]}, "id": "GetMoviesList"}'
var stringJsonCleanLibrary = '{"jsonrpc": "2.0", "method": "VideoLibrary.Clean"}, "id": "libMovies"}'
var stringJsonScanLibrary = '{"jsonrpc": "2.0", "method": "VideoLibrary.Scan"}, "id": "libMovies"}'

function logger (severity, logMessage) {
	console.log(logMessage)
}

var kodiEvent = new (require('events').EventEmitter);

var kodiRPCClient = new net.Socket();
kodiRPCClient.connect(9090, HOST, function() {
    logger(3,'CONNECTED to ' + HOST + ':' + PORT);
})

kodiRPCClient.on('error', function(data) {
	logger(1,"Connection error")
	// TODO: Abort everything
})

kodiRPCClient.on('data', function(data) {
	tcpDataBuffer += data
	try {
		var response = JSON.parse(tcpDataBuffer)
		if (response['method'] === undefined) { // This is an event notification
			logger(3, "Emitting " + response['method'])
			kodiEvent.emit(response['method'], response)
		} else { // This is a response to a previous command
			logger(3, "Emitting " + response['id'])
			kodiEvent.emit(response['id'], response)
		}
	} catch (error) {
		// We are using try-catch to check when we received a whole JSON response
		// There's no need to set action for the catch branch. We simply keep waiting for data
	}
});

kodiRPCClient.on('end', function() {
	// Hanlde closure of TCP socket
})

function getMoviesList(resolve, reject) {

	logger(3, "getMoviesList: Fetching movies list");

	kodiEvent.on('GetMoviesList', function(moviesList) {
		resolve(moviesList['result']['movies'])
		kodiEvent.removeListener('VideoLibrary.GetMovies')
	})

	kodiEvent.on('error', function(moviesList) {
		// Handle error
		kodiEvent.removeListener('error')
	})

	kodiRPCClient.write(stringJsonGetMoviesList)

}

var everything = fs.readdirSync(localFolderBase)
var onlyFiles = everything.filter( function (element) {
	return !element.startsWith('.') & fs.statSync(localFolderBase + element).isFile()
})

var promiseMoviesList = new Promise (function (resolve, reject) {
	getMoviesList(resolve, reject)
})

promiseMoviesList.then(
  function(moviesList) {
		var movieListFiltered = moviesList.filter(function (movie) {
			logger(3,movie['file'].replace(kodiFolderBase,''))
			return (onlyFiles.indexOf(movie['file'].replace(kodiFolderBase,''))!==-1)
		})
		movieListFiltered.map(function (movie) {
			//fs.mkdirSync(kodiFolderBase + '/' + movie['label'] + ' (' + movie['year'] + ')')
			//fs.renameSync(movie['file'], localFolderBase +  movie['label'] + ' (' + movie['year'] + ')/' + movie['file'].replace(kodiFolderBase,''))
			//Clean & rebuild library
			logger(1, localFolderBase +  movie['label'] + ' (' + movie['year'] + ')/' + movie['file'].replace(kodiFolderBase,''))

			/*kodiEvent.on('VideoLibrary.OnCleanFinished', function(response) {
				kodiRPCClient.write(stringJsonScanLibrary)
				kodiEvent.removeListener('VideoLibrary.GetMovies')
			})

			kodiEvent.on('VideoLibrary.OnScanFinished', function(response) {
			})

			kodiRPCClient.write(stringJsonCleanLibrary)*/
		})
  })
  .catch(
    function(reason) {
      logger(1, 'Handle rejected promise ('+reason+') here.');
		})

logger(1,onlyFiles)
