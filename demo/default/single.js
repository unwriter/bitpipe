var axios = require('axios')
const host = "https://bitpipe.bitdb.network"
var datapay = require('datapay')
const tx = {
  data: [ "0x6d02", "hello from datapay" ]
};
var run = function (tx) {
  return new Promise(function(resolve, reject) {
    datapay.build(tx, function(err, tx) {
      let s = tx.toString()
      axios.post(host + "/bitpipe", {
        tx: s
      })
      .then(function(response) {
        console.log("response = ", response)
        resolve()
      })
      .catch(function(e) {
        console.log("Error = ", e)
        reject()
      })
    })
  })
};
run(tx)
