var axios = require('axios')
const host = "https://bitpipe.bitdb.network"
var datapay = require('datapay')
const txs = [{
  data: [ "0x6d02", "hello from datapay" ]
}, {
  data: [ "0x6d0c", "some", "thing" ]
}, {
  data: [ "0x6d02", "world from datapay" ]
}, {
  data: [ "0x6d02", "bye from datapay" ]
}];
var run = function (tx) {
  axios.post(host + "/bitpipe", tx)
  .then(function(response) {
    console.log("response = ", response.data)
  })
  .catch(function(e) {
    console.log("Error = ", e)
  })
};
(async function() {
  for(let i = 0; i<txs.length; i++) {
    await run(txs[i])
  }
})()
