# Pretty Pretty Good (Privacy)

Use `pretty-pgp.js` to pretty-print an OpenPGP key.  The script will scan the DOM and re-render any ASCII armored OpenPGP keys it finds.  In particular, if the key contains an _image attribute_ then the body of the key will be colored such as to render the image as ASCII art.

[Pretty pretty good!](https://www.youtube.com/watch?v=O_05qJTeNNI)

![Example screenshot](example.jpg)

```html
<script src="pretty-pgp.js"></script>
<div class="pretty-pgp-key">
-----BEGIN PGP PUBLIC KEY BLOCK-----
Version: GnuPG v1.4.12 (GNU/Linux)
...
-----END PGP PUBLIC KEY BLOCK-----
</div>
```

With thanks to the following:

* [OpenGPG message RFC](https://tools.ietf.org/html/rfc4880)
* [Parsing OpenPGP key packets](https://github.com/dryruby/openpgp.rb)
* [github.com/emn178's sha1.js implementation](https://github.com/emn178/js-sha1/blob/master/src/sha1.js)
* [Implementing pack() and unpack() in Javascript](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)
