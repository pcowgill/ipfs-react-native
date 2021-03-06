delete global.URL;
delete global.URLSearchParams;
import {polyfillGlobal} from 'react-native/Libraries/Utilities/PolyfillFunctions';

polyfillGlobal('URLSearchParams', () => require('whatwg-url').URLSearchParams);
polyfillGlobal('URL', () => require('whatwg-url').URL);

import './shim';
const FileReader = global.FileReader;

FileReader.prototype.readAsArrayBuffer = function(blob) {
  if (this.readyState === this.LOADING) {
    throw new Error('InvalidStateError');
  }
  this._setReadyState(this.LOADING);
  this._result = null;
  this._error = null;
  const fr = new FileReader();
  fr.onloadend = () => {
    const content = atob(
      fr.result.substr('data:application/octet-stream;base64,'.length),
    );
    const buffer = new ArrayBuffer(content.length);
    const view = new Uint8Array(buffer);
    view.set(Array.from(content).map(c => c.charCodeAt(0)));
    this._result = buffer;
    this._setReadyState(this.DONE);
  };
  fr.readAsDataURL(blob);
};

// from: https://stackoverflow.com/questions/42829838/react-native-atob-btoa-not-working-without-remote-js-debugging
const chars =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
const atob = (input = '') => {
  let str = input.replace(/[=]+$/, '');
  let output = '';

  if (str.length % 4 == 1) {
    throw new Error(
      "'atob' failed: The string to be decoded is not correctly encoded.",
    );
  }
  for (
    let bc = 0, bs = 0, buffer, i = 0;
    (buffer = str.charAt(i++));
    ~buffer && ((bs = bc % 4 ? bs * 64 + buffer : buffer), bc++ % 4)
      ? (output += String.fromCharCode(255 & (bs >> ((-2 * bc) & 6))))
      : 0
  ) {
    buffer = chars.indexOf(buffer);
  }

  return output;
};

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);

const ipfsClient = require('ipfs-http-client');
const ipfs = ipfsClient('http://0.0.0.0:5002');

const test = async () => {
  console.log('yo');
  const first = require('it-first');
  const all = require('it-all');
  const concat = require('it-concat');
  // console.log(await ipfs.version());
  try {
    const int = await ipfs.add(Buffer.from('hello native'));
    console.log('TCL: test -> int', int);

    // const out = await ipfs.cat(
    //   'QmPChd2hVbrJ6bfo3WBcTW4iZnpHm8TEzWkLHmLpXhF68A',
    // );
    // console.log('TCL: test -> out', out.toString());
  } catch (error) {
    console.log(error);
  }
};

test();
