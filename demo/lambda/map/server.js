var bitpipe = require('../../../index')
bitpipe.start({
  lambda: function(req, payload, pipe) {
    // append timestamp
    payload.data[1] += `  [${Date.now()}]`
    pipe(null, payload)
  }
})
