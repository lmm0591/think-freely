const fs = require('fs')
const path = require('path')
const dir = path.join(__filename, '../../.cache')


if(!fs.existsSync(dir)){
  fs.mkdirSync(dir)
}
