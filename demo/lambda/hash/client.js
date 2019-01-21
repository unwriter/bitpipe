var axios = require('axios')
const host = "https://bitpipe.bitdb.network"
var datapay = require('datapay')
var lorem = `
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce pharetra ex sit amet ligula pulvinar dapibus quis pretium nisi. Nulla tempor eu sapien in tincidunt. Aliquam lacinia vestibulum dui, nec dictum augue elementum eget. Proin tempus suscipit ante, in placerat arcu commodo a. Sed rutrum at nisi eget tempor. Etiam commodo est a convallis blandit. Nullam ut egestas leo.

Nulla pulvinar vestibulum volutpat. Donec elementum pellentesque turpis quis dictum. Duis vel mi feugiat, placerat magna sit amet, aliquam nulla. Proin et nunc malesuada, aliquam lacus at, semper nulla. Duis ultricies ullamcorper tellus quis tempus. Aenean faucibus leo eu lectus dignissim luctus. Donec egestas quam mauris, vitae feugiat purus feugiat in. Donec rutrum tincidunt facilisis. Suspendisse quis commodo ligula. Donec vulputate, erat ut tempus consequat, diam nisi blandit odio, id ornare ipsum quam sit amet leo. Nam varius scelerisque libero, vitae sodales ligula consequat vitae. Aliquam rhoncus nibh in enim vestibulum viverra. Suspendisse id ex sed sem euismod interdum quis non justo. Morbi in eros egestas, faucibus justo non, tempor ligula. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec sodales tortor quis dui aliquam lacinia.

Integer eget luctus ante. Etiam suscipit felis eu tellus sollicitudin, sed convallis leo mattis. Sed dignissim, velit quis scelerisque sollicitudin, dui odio placerat sapien, quis fringilla metus elit eget sapien. Aliquam at lobortis lacus. Sed quis ligula quis ligula pellentesque pharetra vitae ac nibh. Sed rutrum euismod egestas. Mauris non lectus vitae nisl ultricies ornare. Mauris tincidunt quam et lorem vehicula, eu dapibus nisi gravida. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Suspendisse a mi tellus. Praesent pulvinar a felis sit amet ultricies. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Curabitur dictum felis a metus viverra, non mattis orci sodales. Sed luctus sapien nec vestibulum rutrum. Vivamus non quam fermentum, dictum tellus sit amet, luctus dui. Quisque nec erat interdum lectus commodo mattis sit amet at ex.

Phasellus lorem justo, convallis eget hendrerit vitae, consequat a nibh. Sed quis nibh in augue congue dapibus sed vitae lorem. Donec tincidunt egestas odio, ut dapibus ipsum dictum a. Donec ullamcorper sem vitae varius lobortis. Praesent ac posuere diam. Curabitur eu ex vitae ex lacinia consequat. Phasellus magna orci, tristique id pulvinar nec, pellentesque id turpis. Mauris varius erat vitae velit rhoncus, vel sollicitudin ex bibendum. Aliquam varius leo vel augue pellentesque facilisis.

Fusce efficitur varius arcu eu cursus. Mauris ut ultrices velit, interdum ornare ex. Vestibulum tellus dolor, rutrum quis ex sit amet, ornare cursus sapien. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Duis at ante a erat bibendum feugiat et in neque. In luctus turpis nec augue convallis, id tincidunt massa consectetur. Duis molestie lorem est, id dignissim sapien mollis in. Integer vehicula tellus ex. Maecenas in fermentum nunc, id imperdiet risus. Ut molestie, risus interdum congue viverra, diam leo elementum quam, at egestas mi risus et ex. Vivamus ultricies dictum est ut porta. Fusce rutrum urna arcu, in pellentesque lorem egestas in. In hac habitasse platea dictumst. Ut interdum leo id dui pellentesque, in pharetra urna eleifend.
`
var run = function (tx) {
  axios.post(host + "/bitpipe", tx)
  .then(function(response) {
    console.log("response = ", response.data)
  })
  .catch(function(e) {
    console.log("Error = ", e)
  })
};
run({ data: [ "0x6d02", lorem ] })
