const fs = require('fs')
if(!fs.existsSync('./.cache')){
  fs.mkdirSync('./.cache')
}
