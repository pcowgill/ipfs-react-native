Note: This code was working with a modified version of `ipfs.cat` from the dep `ipfs-http-client`, which you won't be able to see in this repo.
Once [this PR](https://github.com/ipfs/js-ipfs-http-client/pull/1224) is merged, a modified version of cat in `node_modules` no longer will be necessary for this to serve as a demo repo.

```js
'use strict'

const CID = require('cids')
const { Buffer } = require('buffer')
const configure = require('./lib/configure')
const toIterable = require('./lib/stream-to-iterable')

module.exports = configure(({ ky }) => {
  return async function * cat (path, options) {
    options = options || {}

    const searchParams = new URLSearchParams(options.searchParams)

    if (typeof path === 'string') {
      searchParams.set('arg', path)
    } else {
      searchParams.set('arg', new CID(path).toString())
    }

    if (options.offset) searchParams.set('offset', options.offset)
    if (options.length) searchParams.set('length', options.length)

    const res = await ky.post('cat', {
      timeout: options.timeout,
      signal: options.signal,
      headers: options.headers,
      searchParams
    })

    // New part!!!
    if(!res.body){
      const out = Buffer.from(await res.arrayBuffer())
      console.log(out.toString());
      yield out
      return
    }
    for await (const chunk of toIterable(res.body)) {
      yield Buffer.from(chunk)
    }
  }
})
```
