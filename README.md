SVG Typewriter
=========
[![Build Status](https://travis-ci.org/endrjuskr/svg-typewriter.svg?branch=develop)](https://travis-ci.org/endrjuskr/svg-typewriter)

[![Sauce Test Status](https://saucelabs.com/browser-matrix/andrzejskrodzki.svg)](https://saucelabs.com/u/andrzejskrodzki)

Overview
---
**SVG Typewriter** is a library for measuring, manipulating, and writing text on SVG.
The [svg text spec](http://www.w3.org/TR/SVG/text.html#Introduction) indicates that
"SVG performs no automatic line breaking or word wrapping", meaning that developers
normally need to write their own code to accomplish this; **SVG Typewriter** aims
to make this entire process easier.

Features
---
- *Measurers* efficiently measure the size of a piece of text when written to a particular SVG element, taking into account the CSS styles affecting that text.
- *Wrappers* calculate how best to fit text into a given space, based on results from the Measurer.
- *Writers* write text to a given SVG element based on specified options such as alignment, rotation, and animation.

In general, users will primarily interact with *Writers*, although they will need to instantiate *Measurers* based on specific SVG elements so that the library can perform accurate measurement and wrapping. Users can set options on *Wrappers* to control the wrapping behavior.


"Installation"
---
Download [svgtypewriter.js](https://raw.githubusercontent.com/endrjuskr/svg-typewriter/develop/svgtypewriter.js)
and include it via `<script>` tags.

We are working on a Bower package.

Example Usage
---
```Javascript
// Create a Measurer based on the element we want to write into.
// Passing in the intended element allows accurate measurement based
// on the CSS styles that will actually be applied to that element.
measurer = new SVGTypewriter.Measurers.Measurer(svg);

// Creates a Wrapper with default options.
// A wrapper calculates how to break text to fit in a given space and returns
// the wrapped text as strings. Wrappers do not directly write the wrapped text.
wrapper = new SVGTypewriter.Wrappers.Wrapper();

// Create a Writer.
// A Writer uses the supplied Measurer and Wrapper to best decide how to fit
// text in a given space, then writes the wrapped text to a given element.
writer = new SVGTypewriter.Writers.Writer(measurer, wrapper);

// Set write options.
writeOptions = {
  selection: svg,
  xAlign: "left",
  yAlign: "top",
  textRotation: 0
};

// write the text to the element.
writer.write("Hello World!", width, height, writeOptions);
```

See [the docs](http://endrjuskr.github.io/svg-typewriter/docs/) for more detailed examples.


API can be found [here](http://endrjuskr.github.io/svg-typewriter/docs)
