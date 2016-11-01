# Pretty Pretty Good (Privacy)

Scan the DOM for ASCII armored OpenPGP keys and re-render them with ASCII art
user images!  [Pretty pretty good!](https://www.youtube.com/watch?v=O_05qJTeNNI)

~~~~
<script src="pretty-pgp.js"></script>
<div class="pretty-pgp-key">
-----BEGIN PGP PUBLIC KEY BLOCK-----
Version: GnuPG v1.4.12 (GNU/Linux)
...
-----END PGP PUBLIC KEY BLOCK-----
</div>
~~~~

With thanks to the following:

* [OpenGPG message RFC](https://tools.ietf.org/html/rfc4880#section-5.5.1.1)
* [Parsing OpenPGP key packets](https://github.com/dryruby/openpgp.rb)
* [github.com/emn178's sha1.js implementation](https://github.com/emn178/js-sha1/blob/master/src/sha1.js)
* [Implementing pack() and unpack() in Javascript](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)
