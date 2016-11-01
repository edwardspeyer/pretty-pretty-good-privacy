(function() {
// pretty-pgp.js -- Pretty Pretty Good (Privacy)
// (c) Edward Speyer, 2016
// sha1 implementation: (c) Copyright 2014-2015, emn178@gmail.com

function sha1(message) {
  var HEX_CHARS = '0123456789abcdef'.split('');
  var EXTRA = [-2147483648, 8388608, 32768, 128];
  var SHIFT = [24, 16, 8, 0];

  var blocks = [];

  var notString = typeof(message) != 'string';
  if(notString && message.constructor == ArrayBuffer) {
    message = new Uint8Array(message);
  }

  var h0, h1, h2, h3, h4, block = 0, code, end = false, t, f,
      i, j, index = 0, start = 0, bytes = 0, length = message.length;

  h0 = 0x67452301;
  h1 = 0xEFCDAB89;
  h2 = 0x98BADCFE;
  h3 = 0x10325476;
  h4 = 0xC3D2E1F0;

  do {
    blocks[0] = block;
    blocks[16] = blocks[1] = blocks[2] = blocks[3] =
    blocks[4] = blocks[5] = blocks[6] = blocks[7] =
    blocks[8] = blocks[9] = blocks[10] = blocks[11] =
    blocks[12] = blocks[13] = blocks[14] = blocks[15] = 0;
    if(notString) {
      for (i = start;index < length && i < 64; ++index) {
        blocks[i >> 2] |= message[index] << SHIFT[i++ & 3];
      }
    } else {
      for (i = start;index < length && i < 64; ++index) {
        code = message.charCodeAt(index);
        if (code < 0x80) {
          blocks[i >> 2] |= code << SHIFT[i++ & 3];
        } else if (code < 0x800) {
          blocks[i >> 2] |= (0xc0 | (code >> 6)) << SHIFT[i++ & 3];
          blocks[i >> 2] |= (0x80 | (code & 0x3f)) << SHIFT[i++ & 3];
        } else if (code < 0xd800 || code >= 0xe000) {
          blocks[i >> 2] |= (0xe0 | (code >> 12)) << SHIFT[i++ & 3];
          blocks[i >> 2] |= (0x80 | ((code >> 6) & 0x3f)) << SHIFT[i++ & 3];
          blocks[i >> 2] |= (0x80 | (code & 0x3f)) << SHIFT[i++ & 3];
        } else {
          code = 0x10000 + (((code & 0x3ff) << 10) | (message.charCodeAt(++index) & 0x3ff));
          blocks[i >> 2] |= (0xf0 | (code >> 18)) << SHIFT[i++ & 3];
          blocks[i >> 2] |= (0x80 | ((code >> 12) & 0x3f)) << SHIFT[i++ & 3];
          blocks[i >> 2] |= (0x80 | ((code >> 6) & 0x3f)) << SHIFT[i++ & 3];
          blocks[i >> 2] |= (0x80 | (code & 0x3f)) << SHIFT[i++ & 3];
        }
      }
    }
    bytes += i - start;
    start = i - 64;
    if(index == length) {
      blocks[i >> 2] |= EXTRA[i & 3];
      ++index;
    }
    block = blocks[16];
    if(index > length && i < 56) {
      blocks[15] = bytes << 3;
      end = true;
    }

    for(j = 16;j < 80;++j) {
      t = blocks[j - 3] ^ blocks[j - 8] ^ blocks[j - 14] ^ blocks[j - 16];
      blocks[j] =  (t << 1) | (t >>> 31);
    }

    var a = h0, b = h1, c = h2, d = h3, e = h4;
    for(j = 0;j < 20;j += 5) {
      f = (b & c) | ((~b) & d);
      t = (a << 5) | (a >>> 27);
      e = t + f + e + 1518500249 + blocks[j] << 0;
      b = (b << 30) | (b >>> 2);

      f = (a & b) | ((~a) & c);
      t = (e << 5) | (e >>> 27);
      d = t + f + d + 1518500249 + blocks[j + 1] << 0;
      a = (a << 30) | (a >>> 2);

      f = (e & a) | ((~e) & b);
      t = (d << 5) | (d >>> 27);
      c = t + f + c + 1518500249 + blocks[j + 2] << 0;
      e = (e << 30) | (e >>> 2);

      f = (d & e) | ((~d) & a);
      t = (c << 5) | (c >>> 27);
      b = t + f + b + 1518500249 + blocks[j + 3] << 0;
      d = (d << 30) | (d >>> 2);

      f = (c & d) | ((~c) & e);
      t = (b << 5) | (b >>> 27);
      a = t + f + a + 1518500249 + blocks[j + 4] << 0;
      c = (c << 30) | (c >>> 2);
    }

    for(;j < 40;j += 5) {
      f = b ^ c ^ d;
      t = (a << 5) | (a >>> 27);
      e = t + f + e + 1859775393 + blocks[j] << 0;
      b = (b << 30) | (b >>> 2);

      f = a ^ b ^ c;
      t = (e << 5) | (e >>> 27);
      d = t + f + d + 1859775393 + blocks[j + 1] << 0;
      a = (a << 30) | (a >>> 2);

      f = e ^ a ^ b;
      t = (d << 5) | (d >>> 27);
      c = t + f + c + 1859775393 + blocks[j + 2] << 0;
      e = (e << 30) | (e >>> 2);

      f = d ^ e ^ a;
      t = (c << 5) | (c >>> 27);
      b = t + f + b + 1859775393 + blocks[j + 3] << 0;
      d = (d << 30) | (d >>> 2);

      f = c ^ d ^ e;
      t = (b << 5) | (b >>> 27);
      a = t + f + a + 1859775393 + blocks[j + 4] << 0;
      c = (c << 30) | (c >>> 2);
    }

    for(;j < 60;j += 5) {
      f = (b & c) | (b & d) | (c & d);
      t = (a << 5) | (a >>> 27);
      e = t + f + e - 1894007588 + blocks[j] << 0;
      b = (b << 30) | (b >>> 2);

      f = (a & b) | (a & c) | (b & c);
      t = (e << 5) | (e >>> 27);
      d = t + f + d - 1894007588 + blocks[j + 1] << 0;
      a = (a << 30) | (a >>> 2);

      f = (e & a) | (e & b) | (a & b);
      t = (d << 5) | (d >>> 27);
      c = t + f + c - 1894007588 + blocks[j + 2] << 0;
      e = (e << 30) | (e >>> 2);

      f = (d & e) | (d & a) | (e & a);
      t = (c << 5) | (c >>> 27);
      b = t + f + b - 1894007588 + blocks[j + 3] << 0;
      d = (d << 30) | (d >>> 2);

      f = (c & d) | (c & e) | (d & e);
      t = (b << 5) | (b >>> 27);
      a = t + f + a - 1894007588 + blocks[j + 4] << 0;
      c = (c << 30) | (c >>> 2);
    }

    for(;j < 80;j += 5) {
      f = b ^ c ^ d;
      t = (a << 5) | (a >>> 27);
      e = t + f + e - 899497514 + blocks[j] << 0;
      b = (b << 30) | (b >>> 2);

      f = a ^ b ^ c;
      t = (e << 5) | (e >>> 27);
      d = t + f + d - 899497514 + blocks[j + 1] << 0;
      a = (a << 30) | (a >>> 2);

      f = e ^ a ^ b;
      t = (d << 5) | (d >>> 27);
      c = t + f + c - 899497514 + blocks[j + 2] << 0;
      e = (e << 30) | (e >>> 2);

      f = d ^ e ^ a;
      t = (c << 5) | (c >>> 27);
      b = t + f + b - 899497514 + blocks[j + 3] << 0;
      d = (d << 30) | (d >>> 2);

      f = c ^ d ^ e;
      t = (b << 5) | (b >>> 27);
      a = t + f + a - 899497514 + blocks[j + 4] << 0;
      c = (c << 30) | (c >>> 2);
    }

    h0 = h0 + a << 0;
    h1 = h1 + b << 0;
    h2 = h2 + c << 0;
    h3 = h3 + d << 0;
    h4 = h4 + e << 0;
  } while(!end);

  return HEX_CHARS[(h0 >> 28) & 0x0F] + HEX_CHARS[(h0 >> 24) & 0x0F] +
         HEX_CHARS[(h0 >> 20) & 0x0F] + HEX_CHARS[(h0 >> 16) & 0x0F] +
         HEX_CHARS[(h0 >> 12) & 0x0F] + HEX_CHARS[(h0 >> 8) & 0x0F] +
         HEX_CHARS[(h0 >> 4) & 0x0F] + HEX_CHARS[h0 & 0x0F] +
         HEX_CHARS[(h1 >> 28) & 0x0F] + HEX_CHARS[(h1 >> 24) & 0x0F] +
         HEX_CHARS[(h1 >> 20) & 0x0F] + HEX_CHARS[(h1 >> 16) & 0x0F] +
         HEX_CHARS[(h1 >> 12) & 0x0F] + HEX_CHARS[(h1 >> 8) & 0x0F] +
         HEX_CHARS[(h1 >> 4) & 0x0F] + HEX_CHARS[h1 & 0x0F] +
         HEX_CHARS[(h2 >> 28) & 0x0F] + HEX_CHARS[(h2 >> 24) & 0x0F] +
         HEX_CHARS[(h2 >> 20) & 0x0F] + HEX_CHARS[(h2 >> 16) & 0x0F] +
         HEX_CHARS[(h2 >> 12) & 0x0F] + HEX_CHARS[(h2 >> 8) & 0x0F] +
         HEX_CHARS[(h2 >> 4) & 0x0F] + HEX_CHARS[h2 & 0x0F] +
         HEX_CHARS[(h3 >> 28) & 0x0F] + HEX_CHARS[(h3 >> 24) & 0x0F] +
         HEX_CHARS[(h3 >> 20) & 0x0F] + HEX_CHARS[(h3 >> 16) & 0x0F] +
         HEX_CHARS[(h3 >> 12) & 0x0F] + HEX_CHARS[(h3 >> 8) & 0x0F] +
         HEX_CHARS[(h3 >> 4) & 0x0F] + HEX_CHARS[h3 & 0x0F] +
         HEX_CHARS[(h4 >> 28) & 0x0F] + HEX_CHARS[(h4 >> 24) & 0x0F] +
         HEX_CHARS[(h4 >> 20) & 0x0F] + HEX_CHARS[(h4 >> 16) & 0x0F] +
         HEX_CHARS[(h4 >> 12) & 0x0F] + HEX_CHARS[(h4 >> 8) & 0x0F] +
         HEX_CHARS[(h4 >> 4) & 0x0F] + HEX_CHARS[h4 & 0x0F];
}


var AsciiArtCanvas = function(characters) {
  var root = document.createElement('div');

  var pixels = [];
  for (var i = 0; i < characters.length; i++) {
    var character = characters[i];
    var pixel = document.createElement('span');
    pixel.innerHTML = character;
    pixels.push(pixel);
    root.appendChild(pixel);
  }

  function getVisibleDimensionsInChars() {
    var width;
    for (var x = 0; x < (pixels.length - 1); x++) {
      var pixel0 = pixels[x + 0]
      var pixel1 = pixels[x + 1];
      var rect0 = pixel0.getBoundingClientRect();
      var rect1 = pixel1.getBoundingClientRect();
      if (rect1.top > rect0.top) {
        width = x + 1;
        break;
      }
    }

    var height = 0;
    var viewportHeight = (
      document.documentElement.clientHeight ||
      window.innerHeight
    );
    for (var n = 0; n < pixels.length; n = n + width) {
      var pixel = pixels[n];
      var rect = pixel.getBoundingClientRect();
      if (rect.bottom > 0 && rect.top < viewportHeight) {
        height++;
      }
    }

    return {width:width, height:height};
  };

  function toCSSColor(ar, scale, offset) {
    var r = Math.floor(offset * 255 + ar[0] * scale);
    var g = Math.floor(offset * 255 + ar[1] * scale);
    var b = Math.floor(offset * 255 + ar[2] * scale);
    return "rgb(" + r + "," + g + "," + b + ")";
  }

  this.drawImage = function(image) {
    var canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;

    var context = canvas.getContext('2d');
    context.drawImage(image, 0, 0, image.width, image.height);

    var rootRectangle = root.getBoundingClientRect();
    var pixelRectangle = pixels[0].getBoundingClientRect();

    var charDimensions = getVisibleDimensionsInChars();
    var screenDimensions = {
      width   : charDimensions.width  * pixelRectangle.width,
      height  : charDimensions.height * pixelRectangle.height,
    };
    
    var screenAspectRatio = screenDimensions.width / screenDimensions.height;
    var imageAspectRatio = image.width / image.height;
    
    var scale;
    if ((imageAspectRatio / screenAspectRatio) < 1) {
      /* +----------+
       * |#--+#--+#-|   Tall and thin
       * ||  ||  || |
       * ||  ||  || |
       * |+--++---+-|
       * +----------+
       */
      scale = image.height / screenDimensions.height;
    } else {
      /* +----------+
       * |#--------+|   Short and wide
       * ||        ||
       * ||        ||
       * |#--------+|
       * ||        ||
       * +----------+
       */
      scale = image.width / screenDimensions.width;
    }

    for (var n = 0; n < pixels.length; n++) {
      var pixel = pixels[n];
      var logicalX = n % charDimensions.width;
      var logicalY = Math.floor(n / charDimensions.width);
      var screenX = logicalX * pixelRectangle.width;
      var screenY = logicalY * pixelRectangle.height;
      var imageX = Math.floor(scale * screenX) % image.width;
      var imageY = Math.floor(scale * screenY) % image.height;
      var imageData = context.getImageData(imageX, imageY, 1, 1).data;
      pixel.style.color = toCSSColor(imageData, 1.0, 0.0);
    }
  };

  this.appendTo = function(element) {
    element.appendChild(root);
  };
};


var Binary = function(bytes) {
  this.fromBase64 = function(base64) {
    // Instance method masquerading as a static method!!
    var data = window.atob(base64);
    var bytes = new Uint8Array(data.length);
    for (var i = 0; i < data.length; i++) {
      bytes[i] = data.charCodeAt(i);
    }
    return new Binary(bytes);
  };

  var position = 0;

  this.read = function(length) {
    var result;
    if (length) {
      var to = position + length;
      result = bytes.subarray(position, to);
      position = to;
    } else {
      result = bytes.subarray(position);
      position = bytes.length;
    }
    return result;
  };

  this.eof = function() {
    return position == bytes.length;
  };

  this.C = function(){ return this.read(1)[0]; };
  this.n = function(){ return (this.C() << 8) | this.C();  };
  this.N = function(){ return (this.n() << 16) | this.n(); };
  
  this.string = function(length) {
    var buf = [];
    while(!this.eof()) {
      var b = this.read(1)[0];
      var c = String.fromCharCode(b);
      buf.push(c);
      if (length && buf.length >= length) {
        break;
      }
    }
    return buf.join('');
  };

  this.mpi = function() {
    var bits = this.n();
    var length = Math.ceil(bits / 8);
    var mpi = this.read(length);
    return mpi;
  };
  
  this.binary = function(length) {
    var sub = this.read(length);
    return new Binary(sub);
  };
};


var PGPKey = function(element) {
  // -----BEGIN...
  // A: b
  // C: d
  // <blank line>
  // <base64 key data>
  // <base64 checksum on last line>
  // -----END...
  var parts = element.innerHTML.trim().split("\n\n");
  var lines = parts[1].split("\n");

  this.header   = parts[0];
  this.body     = lines.slice(0, lines.length - 2).join('');
  this.cksum    = lines[lines.length - 2];
  this.footer   = lines[lines.length - 1];

  var constants = {
    packet: {
      PUBLIC_KEY      :  6,
      USER_ID         : 13,
      USER_ATTRIBUTE  : 17,
    },

    algorithm: {
      RSA : 1,
    },
  };

  this.packets = function(filter) {
    var packets = [];
    var b = new Binary().fromBase64(this.body);
    while (!b.eof()) {
      var tag = b.C();
      var packetLength;
      if ((tag & 0x40) == 0) { // old
        var len = tag & 0x03;
        tag = (tag >> 2) & 0x0F;
        if (len == 0) {
          packetLength = b.C();
        } else if (len == 1) {
          packetLength = b.n();
        } else if (len == 2) {
          packetLength = b.N();
        } else {
          throw "!";
        }
      } else { // new
        tag = tag & 0x1F
        var len = b.C();
        if (len < 192) {
          packetLength = len;
        } else if (len < 224) {
          packetLength = ((len - 192) << 8) + b.C() + 192;
        } else if (len < 255) {
          packetLength = 1 << (len & 0x1F)
        } else {
          packetLength = b.N();
        }
      }
      var packet = {
        tag   : tag,
        data  : b.binary(packetLength)
      };
      if (!filter || (filter == tag)) {
        packets.push(packet);
      }
    }
    return packets;
  };

  this.getUID = function() {
    var p = this.packets(constants.packet.USER_ID)[0];
    if (!p) return;
    var uid = p.data.string();
    return uid;
  };

  this.getKeyID = function() {
    return '0x' + this.getFingerprint().slice(-8);
  };

  this.getFingerprint = function() {
    var p = this.packets(constants.packet.PUBLIC_KEY)[0];
    if (!p) return;
    var bytes = p.data.read();
    var buf = new Uint8Array(bytes.length + 3);
    buf[0] = 0x99
    buf[1] = bytes.length >> 8;
    buf[2] = bytes.length & 0xff;
    for (var i = 0; i < bytes.length; i++) {
      buf[i+3] = bytes[i];
    }
    var digest = sha1(buf);
    return digest.toUpperCase();
  };

  this.getFormattedFingerprint = function() {
    var buf = [];
    var fingerprint = this.getFingerprint();
    for (var i = 0; i < fingerprint.length; i++) {
      if (i > 0) {
        if (i % 20 == 0) {
          buf.push('  ');
        } else if (i % 4 == 0) {
          buf.push(' ');
        }
      }
      buf.push(fingerprint[i]);
    }
    return buf.join('');
  };

  this.loadImage = function(onload) {
    // This has the potential to over-match if FFD9 is in the GPG key:
    //
    //    FFD8..JFIF..<image>..FFD9..<gpg-data>..FFD9
    //    ^--- the jpeg ----------^                 ^
    //    ^--- what we match -----------------------'
    //
    // However the browser JPEG parse seems to be robust enough to cope with
    // random garbage at the end of a valid JPEG image.
    //
    // TODO: use packets!
    //
    var jpeg = atob(this.body).match(/(\xFF\xD8[\s\S]+\xFF\xD9)/);
    if (!jpeg) {
      console.log("no image!");
      return;
    }
    var image = new Image();
    image.onload = function() {
      onload(image);
    };
    image.src = "data:image/jpeg;base64," + window.btoa(jpeg);
  };
};


var PrettyPGPKey = function(pgpKey) {
  var asciiCanvas = new AsciiArtCanvas(pgpKey.body);

  function renderKey(element) {
    element.innerHTML = ''
    element.style.wordBreak = 'break-all';
    element.style.fontFamily = 'monospace';

    var header = document.createElement('div');
    header.style.whiteSpace = 'pre';
    header.innerHTML = pgpKey.header + "\n\n";
    element.appendChild(header);
    
    asciiCanvas.appendTo(element);

    var cksum = document.createElement('div');
    cksum.style.color = '#999';
    cksum.innerHTML = pgpKey.cksum;
    element.appendChild(cksum);

    var footer = document.createElement('div');
    footer.innerHTML = pgpKey.footer;
    element.appendChild(footer);
  }

  function renderImage(element) {
    pgpKey.loadImage(function(loadedImage) {
      asciiCanvas.drawImage(loadedImage);
    });
  }

  function renderInfo(element) {
    var div = document.createElement('div');
    div.style.position = 'fixed';
    div.style.top = '15%';
    div.style.left = '0';
    div.style.padding = '1em';
    div.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    div.style.fontFamily = 'monospace';
    div.style.fontSize = '150%';
    div.style.color = '#ddd';
    div.style.whiteSpace = 'pre';
    
    var raw = [];
    raw.push(pgpKey.getKeyID());
    raw.push(pgpKey.getUID());
    raw.push(pgpKey.getFormattedFingerprint());

    var text = document.createTextNode(raw.join("\n  "));
    div.appendChild(text);

    element.appendChild(div);
  }

  this.appendTo = function(element) {
    renderKey(element);
    renderImage(element);
    renderInfo(element);
  };
};


function main() {
  var elements = document.getElementsByClassName("pretty-pgp-key");
  for (var i = 0; i < elements.length; i++) {
    var element = elements[i];
    var pgpKey = new PGPKey(element);
    var pretty = new PrettyPGPKey(pgpKey);
    pretty.appendTo(element);
  }
}

document.addEventListener("DOMContentLoaded", main);

})();
