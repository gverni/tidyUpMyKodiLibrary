# tidyUpMyKodiLibrary

Utility to tidy up kodi video library storage folder: 
* Find movies on the root folder and copy them in a subfolder for each movie (implementing ...)
* Find movie that have not been indexed in Kodi (e.g. not added to kodi movie library) (not implemented yet)
* Make all folder with the same naming convention (i.e. "< movie title > (< year >)") (not implemented yet) 


At the end of the above operations, the library is cleaned and re-scanned (implmenting) 


Currently is command line only. 

# Configuration 
Currently configuration is done changing the source code: 
* HOST: name / ip of kodi server '
* PORT: rpc tcp port (usually 9090). To enable that use the instructions here: http://kodi.wiki/view/Advancedsettings.xml#.3Cjsonrpc.3E 
* localFolderBase: local folder that contains movies files (it can be a mounted folder, e.g. '/Volumes/sdb3/Movies/'
* kodiFolderBase: root of the folder that contains movies files as seen from kodi (e.g. 'nfs://192.168.0.1/tmp/mnt/sdb3/Download/')

# Usage
 `node tinyUpMyMoviesFolder.js`
