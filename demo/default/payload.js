var axios = require('axios')
const host = "https://pipe.bitdb.network"
var datapay = require('datapay')
axios.post(host + "/bitpipe", {
  data: [ "0x6d02", "hello from datapay" ]
}).then(function(response) {
  console.log("response = ", response)
}).catch(function(e) {
  console.log("Error = ", e)
})
