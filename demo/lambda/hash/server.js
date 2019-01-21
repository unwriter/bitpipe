const crypto = require('crypto');
const sha256 = (x) => crypto.createHash('sha256').update(x, 'utf8').digest('hex');
var bitpipe = require('../../../index')
bitpipe.start({
  lambda: function(req, payload, pipe) {
    // createa sha256 hash of the original data
    payload.data[1] = sha256(payload.data[1])
    pipe(null, payload)
  }
})
