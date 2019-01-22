// post multiple consecutive messages
var axios = require('axios')
const host = "https://pipe.bitdb.network"
var datapay = require('datapay')
var seed = "#";
var run = async function(space) {
  return axios.post(host + "/bitpipe", {
    data: [ "", space + seed ]
  })
};
(async function() {
  for(i=0; i < 30; i++) {
    let space = "#".repeat(i)
    let response = await run(space).catch(function(e) {
      console.log("Error", e)
    })
    await new Promise(done => setTimeout(done, 2000));
    console.log("response = ", response.data)
  }
})();
