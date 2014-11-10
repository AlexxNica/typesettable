/*!
SVG Typewriter 0.0.1 (https://github.com/endrjuskr/svg-typewriter)
Copyright 2014 Palantir Technologies
Licensed under MIT (https://github.com/endrjuskr/svg-typewriter/blob/master/LICENSE)

          ************************************************
          **          Looking for readable source?      **
          **    Check out the .ts (typescript) file!    **
          ************************************************

*/

///<reference path="../reference.ts" />
var SVGTypewriter;
(function (SVGTypewriter) {
    (function (Utils) {
        (function (Methods) {
            /**
             * Check if two arrays are equal by strict equality.
             */
            function arrayEq(a, b) {
                // Technically, null and undefined are arrays too
                if (a == null || b == null) {
                    return a === b;
                }
                if (a.length !== b.length) {
                    return false;
                }
                for (var i = 0; i < a.length; i++) {
                    if (a[i] !== b[i]) {
                        return false;
                    }
                }
                return true;
            }
            Methods.arrayEq = arrayEq;
            /**
             * @param {any} a Object to check against b for equality.
             * @param {any} b Object to check against a for equality.
             *
             * @returns {boolean} whether or not two objects share the same keys, and
             *          values associated with those keys. Values will be compared
             *          with ===.
             */
            function objEq(a, b) {
                if (a == null || b == null) {
                    return a === b;
                }
                var keysA = Object.keys(a).sort();
                var keysB = Object.keys(b).sort();
                var valuesA = keysA.map(function (k) { return a[k]; });
                var valuesB = keysB.map(function (k) { return b[k]; });
                return arrayEq(keysA, keysB) && arrayEq(valuesA, valuesB);
            }
            Methods.objEq = objEq;
            function isNotEmptyString(str) {
                return str && str.trim() !== "";
            }
            Methods.isNotEmptyString = isNotEmptyString;
        })(Utils.Methods || (Utils.Methods = {}));
        var Methods = Utils.Methods;
    })(SVGTypewriter.Utils || (SVGTypewriter.Utils = {}));
    var Utils = SVGTypewriter.Utils;
})(SVGTypewriter || (SVGTypewriter = {}));

var SVGTypewriter;
(function (SVGTypewriter) {
    (function (Utils) {
        (function (DOM) {
            function transform(s, x, y) {
                var xform = d3.transform(s.attr("transform"));
                if (x == null) {
                    return xform.translate;
                }
                else {
                    y = (y == null) ? 0 : y;
                    xform.translate[0] = x;
                    xform.translate[1] = y;
                    s.attr("transform", xform.toString());
                    return s;
                }
            }
            DOM.transform = transform;
            function getBBox(element) {
                var bbox;
                try {
                    bbox = element.node().getBBox();
                }
                catch (err) {
                    bbox = {
                        x: 0,
                        y: 0,
                        width: 0,
                        height: 0
                    };
                }
                return bbox;
            }
            DOM.getBBox = getBBox;
        })(Utils.DOM || (Utils.DOM = {}));
        var DOM = Utils.DOM;
    })(SVGTypewriter.Utils || (SVGTypewriter.Utils = {}));
    var Utils = SVGTypewriter.Utils;
})(SVGTypewriter || (SVGTypewriter = {}));

///<reference path="../reference.ts" />
var SVGTypewriter;
(function (SVGTypewriter) {
    (function (Utils) {
        var Cache = (function () {
            /**
             * @constructor
             *
             * @param {string} compute The function whose results will be cached.
             * @param {(v: T, w: T) => boolean} [valueEq]
             *        Used to determine if the value of canonicalKey has changed.
             *        If omitted, defaults to === comparision.
             */
            function Cache(compute, valueEq) {
                if (valueEq === void 0) { valueEq = function (v, w) { return v === w; }; }
                this.cache = d3.map();
                this.compute = compute;
                this.valueEq = valueEq;
            }
            /**
             * Attempt to look up k in the cache, computing the result if it isn't
             * found.
             *
             * @param {string} k The key to look up in the cache.
             * @return {T} The value associated with k; the result of compute(k).
             */
            Cache.prototype.get = function (k) {
                if (!this.cache.has(k)) {
                    this.cache.set(k, this.compute(k));
                }
                return this.cache.get(k);
            };
            /**
             * Reset the cache empty.
             *
             * @return {Cache<T>} The calling Cache.
             */
            Cache.prototype.clear = function () {
                this.cache = d3.map();
                return this;
            };
            return Cache;
        })();
        Utils.Cache = Cache;
    })(SVGTypewriter.Utils || (SVGTypewriter.Utils = {}));
    var Utils = SVGTypewriter.Utils;
})(SVGTypewriter || (SVGTypewriter = {}));

///<reference path="../reference.ts" />
var SVGTypewriter;
(function (SVGTypewriter) {
    (function (Utils) {
        var Tokenizer = (function () {
            function Tokenizer() {
                this.WordDividerRegExp = new RegExp("\\W");
                this.WhitespaceRegExp = new RegExp("\\s");
            }
            Tokenizer.prototype.tokenize = function (line) {
                var _this = this;
                return line.split("").reduce(function (tokens, c) { return tokens.slice(0, -1).concat(_this.shouldCreateNewToken(tokens[tokens.length - 1], c)); }, [""]);
            };
            Tokenizer.prototype.shouldCreateNewToken = function (token, newCharacter) {
                if (!token) {
                    return [newCharacter];
                }
                var lastCharacter = token[token.length - 1];
                if (this.WhitespaceRegExp.test(lastCharacter) && this.WhitespaceRegExp.test(newCharacter)) {
                    return [token + newCharacter];
                }
                else if (this.WhitespaceRegExp.test(lastCharacter) || this.WhitespaceRegExp.test(newCharacter)) {
                    return [token, newCharacter];
                }
                else if (!(this.WordDividerRegExp.test(lastCharacter) || this.WordDividerRegExp.test(newCharacter))) {
                    return [token + newCharacter];
                }
                else if (lastCharacter === newCharacter) {
                    return [token + newCharacter];
                }
                else {
                    return [token, newCharacter];
                }
            };
            return Tokenizer;
        })();
        Utils.Tokenizer = Tokenizer;
    })(SVGTypewriter.Utils || (SVGTypewriter.Utils = {}));
    var Utils = SVGTypewriter.Utils;
})(SVGTypewriter || (SVGTypewriter = {}));

///<reference path="reference.ts" />
var SVGTypewriter;
(function (SVGTypewriter) {
    (function (Converters) {
        function ident() {
            return function (s) { return s; };
        }
        Converters.ident = ident;
        /**
         * @return {Parser} A converter that will treat all
         * sequences of consecutive whitespace as a single " ".
         */
        function combineWhitespace(con) {
            return function (s) { return con(s.replace(/\s+/g, " ")); };
        }
        Converters.combineWhitespace = combineWhitespace;
    })(SVGTypewriter.Converters || (SVGTypewriter.Converters = {}));
    var Converters = SVGTypewriter.Converters;
})(SVGTypewriter || (SVGTypewriter = {}));

///<reference path="reference.ts" />
var SVGTypewriter;
(function (SVGTypewriter) {
    (function (Wrappers) {
        var Wrapper = (function () {
            function Wrapper() {
                this.maxLines(Infinity);
                this.textTrimming("ellipsis");
                this.allowBreakingWords(true);
                this._tokenizer = new SVGTypewriter.Utils.Tokenizer();
                this._breakingCharacter = "-";
            }
            Wrapper.prototype.maxLines = function (noLines) {
                if (noLines == null) {
                    return this._maxLines;
                }
                else {
                    this._maxLines = noLines;
                    return this;
                }
            };
            Wrapper.prototype.textTrimming = function (option) {
                if (option == null) {
                    return this._textTrimming;
                }
                else {
                    if (option !== "ellipsis" && option !== "none") {
                        throw new Error(option + " - unsupported text trimming option.");
                    }
                    this._textTrimming = option;
                    return this;
                }
            };
            Wrapper.prototype.allowBreakingWords = function (allow) {
                if (allow == null) {
                    return this._allowBreakingWords;
                }
                else {
                    this._allowBreakingWords = allow;
                    return this;
                }
            };
            Wrapper.prototype.wrap = function (text, measurer, width, height) {
                var _this = this;
                if (height === void 0) { height = Infinity; }
                var initialWrappingResult = {
                    originalText: text,
                    wrappedText: "",
                    noLines: 0,
                    noBrokeWords: 0,
                    truncatedText: ""
                };
                var state = {
                    wrapping: initialWrappingResult,
                    currentLine: "",
                    availableWidth: width,
                    availableLines: Math.min(height / measurer.measure().height, this._maxLines),
                    canFitText: true
                };
                var lines = text.split("\n");
                return lines.map(function (line, i) { return i !== lines.length - 1 ? line + "\n" : line; }).reduce(function (state, line) { return _this.breakLineToFitWidth(state, line, measurer); }, state).wrapping;
            };
            Wrapper.prototype.breakLineToFitWidth = function (state, line, measurer) {
                var _this = this;
                var tokens = this._tokenizer.tokenize(line);
                state = tokens.reduce(function (state, token) { return state.canFitText ? _this.wrapNextToken(token, state, measurer) : _this.truncateNextToken(token, state); }, state);
                state.wrapping.wrappedText += state.currentLine;
                state.wrapping.noLines += +(state.currentLine !== "");
                state.currentLine = "";
                return state;
            };
            Wrapper.prototype.truncateNextToken = function (token, state) {
                state.wrapping.truncatedText += token;
                return state;
            };
            Wrapper.prototype.canFitToken = function (token, width, measurer) {
                var _this = this;
                var possibleBreaks = this._allowBreakingWords ? token.split("").map(function (c, i) { return (i !== token.length - 1) ? c + _this._breakingCharacter : c; }) : [token];
                return possibleBreaks.every(function (c) { return measurer.measure(c).width <= width; });
            };
            Wrapper.prototype.addEllipsis = function (line, width, measurer) {
                var truncatedLine = line.trim();
                var lineWidth = measurer.measure(truncatedLine).width;
                var ellipsesWidth = measurer.measure("...").width;
                if (width <= ellipsesWidth) {
                    var periodWidth = measurer.measure(".").width;
                    var numPeriodsThatFit = Math.floor(width / periodWidth);
                    return "...".substr(0, numPeriodsThatFit);
                }
                while (lineWidth + ellipsesWidth > width) {
                    truncatedLine = truncatedLine.substr(0, truncatedLine.length - 1).trim();
                    lineWidth = measurer.measure(truncatedLine).width;
                }
                return truncatedLine + "...";
            };
            Wrapper.prototype.wrapNextToken = function (token, state, measurer) {
                if (state.availableLines === 0 || !this.canFitToken(token, state.availableWidth, measurer)) {
                    state.canFitText = false;
                    state.wrapping.truncatedText += token;
                }
                else {
                    var remainingToken = token;
                    var noLines = 0;
                    while (remainingToken) {
                        var result = this.breakTokenToFitInWidth(remainingToken, state.currentLine, state.availableWidth, measurer);
                        state.currentLine = result.line;
                        remainingToken = result.remainingToken;
                        if (remainingToken != null) {
                            state.wrapping.noBrokeWords += +result.breakWord;
                            ++state.wrapping.noLines;
                            --state.availableLines;
                            if (state.availableLines === 0) {
                                state.wrapping.wrappedText += this.addEllipsis(state.currentLine, state.availableWidth, measurer);
                                state.currentLine = "";
                                state.wrapping.truncatedText += remainingToken;
                                return state;
                            }
                            else {
                                state.wrapping.wrappedText += state.currentLine + "\n";
                                state.currentLine = "";
                            }
                        }
                    }
                }
                return state;
            };
            /**
             * Breaks single token to fit current line.
             * If token contains only whitespaces then they will not be populated to next line.
             */
            Wrapper.prototype.breakTokenToFitInWidth = function (token, line, availableWidth, measurer) {
                if (measurer.measure(line + token).width <= availableWidth) {
                    return {
                        remainingToken: null,
                        line: line + token,
                        breakWord: false
                    };
                }
                if (token.trim() === "") {
                    return {
                        remainingToken: "",
                        line: line,
                        breakWord: false
                    };
                }
                if (!this._allowBreakingWords) {
                    return {
                        remainingToken: token,
                        line: line,
                        breakWord: false
                    };
                }
                var fitTokenLength = 0;
                while (fitTokenLength < token.length) {
                    if (measurer.measure(line + token.substring(0, fitTokenLength + 1) + this._breakingCharacter).width <= availableWidth) {
                        ++fitTokenLength;
                    }
                    else {
                        break;
                    }
                }
                var suffix = "";
                if (fitTokenLength > 0) {
                    suffix = "-";
                }
                return {
                    remainingToken: token.substring(fitTokenLength),
                    line: line + token.substring(0, fitTokenLength) + suffix,
                    breakWord: fitTokenLength > 0
                };
            };
            return Wrapper;
        })();
        Wrappers.Wrapper = Wrapper;
    })(SVGTypewriter.Wrappers || (SVGTypewriter.Wrappers = {}));
    var Wrappers = SVGTypewriter.Wrappers;
})(SVGTypewriter || (SVGTypewriter = {}));

///<reference path="reference.ts" />
var SVGTypewriter;
(function (SVGTypewriter) {
    (function (Writers) {
        var Writer = (function () {
            function Writer(measurer, wrapper) {
                this.measurer(measurer);
                this.wrapper(wrapper);
            }
            Writer.prototype.measurer = function (newMeasurer) {
                if (newMeasurer == null) {
                    return this._measurer;
                }
                else {
                    this._measurer = newMeasurer;
                    return this;
                }
            };
            Writer.prototype.wrapper = function (newWrapper) {
                if (newWrapper == null) {
                    return this._wrapper;
                }
                else {
                    this._wrapper = newWrapper;
                    return this;
                }
            };
            Writer.prototype.writeLine = function (line, g, align) {
                if (align === void 0) { align = "left"; }
                var textEl = g.append("text");
                textEl.text(line);
                var anchor = Writer.AnchorConverter[align];
                textEl.attr("text-anchor", anchor);
            };
            Writer.prototype.write = function (text, width, height, options) {
                var _this = this;
                var wrappedText = this._wrapper.wrap(text, this._measurer, width).wrappedText;
                var innerG = options.selection.append("g").classed("writeText-inner-g", true);
                var lines = wrappedText.split("\n");
                var h = this._measurer.measure().height;
                lines.forEach(function (line, i) {
                    var selection = innerG.append("g");
                    SVGTypewriter.Utils.DOM.transform(selection, 0, (i + 1) * h);
                    _this.writeLine(line, selection);
                });
            };
            Writer.AnchorConverter = {
                left: "start",
                center: "middle",
                right: "end"
            };
            return Writer;
        })();
        Writers.Writer = Writer;
    })(SVGTypewriter.Writers || (SVGTypewriter.Writers = {}));
    var Writers = SVGTypewriter.Writers;
})(SVGTypewriter || (SVGTypewriter = {}));

///<reference path="../reference.ts" />
var SVGTypewriter;
(function (SVGTypewriter) {
    (function (Measurers) {
        ;
        var AbstractMeasurer = (function () {
            function AbstractMeasurer(area, className) {
                this.textMeasurer = this.getTextMeasurer(area, className);
            }
            AbstractMeasurer.prototype.checkSelectionIsText = function (d) {
                return d[0][0].tagName === "text";
            };
            AbstractMeasurer.prototype.getTextMeasurer = function (area, className) {
                var _this = this;
                if (!this.checkSelectionIsText(area)) {
                    var textElement = area.append("text");
                    if (className) {
                        textElement.classed(className, true);
                    }
                    textElement.remove();
                    return function (text) {
                        area.node().appendChild(textElement.node());
                        var areaDimension = _this.measureBBox(textElement, text);
                        textElement.remove();
                        return areaDimension;
                    };
                }
                else {
                    var defaultText = area.text();
                    return function (text) {
                        var areaDimension = _this.measureBBox(area, text);
                        area.text(defaultText);
                        return areaDimension;
                    };
                }
            };
            AbstractMeasurer.prototype.measureBBox = function (d, text) {
                d.text(text);
                var bb = SVGTypewriter.Utils.DOM.getBBox(d);
                return { width: bb.width, height: bb.height };
            };
            AbstractMeasurer.prototype.measure = function (text) {
                if (text === void 0) { text = AbstractMeasurer.HEIGHT_TEXT; }
                return this.textMeasurer(text);
            };
            AbstractMeasurer.HEIGHT_TEXT = "bqpdl";
            return AbstractMeasurer;
        })();
        Measurers.AbstractMeasurer = AbstractMeasurer;
    })(SVGTypewriter.Measurers || (SVGTypewriter.Measurers = {}));
    var Measurers = SVGTypewriter.Measurers;
})(SVGTypewriter || (SVGTypewriter = {}));

///<reference path="../reference.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var SVGTypewriter;
(function (SVGTypewriter) {
    (function (Measurers) {
        var Measurer = (function (_super) {
            __extends(Measurer, _super);
            function Measurer() {
                _super.apply(this, arguments);
            }
            Measurer.prototype._addGuards = function (text) {
                return Measurer.NotWhitespaceCharacter + text + Measurer.NotWhitespaceCharacter;
            };
            Measurer.prototype.getNotWhitespaceCharacterWidth = function () {
                if (this.nonWhitespaceCharacterWidth == null) {
                    this.nonWhitespaceCharacterWidth = _super.prototype.measure.call(this, Measurer.NotWhitespaceCharacter).width;
                }
                return this.nonWhitespaceCharacterWidth;
            };
            Measurer.prototype._measureLine = function (line) {
                var measuredLine = this._addGuards(line);
                var measuredLineDimensions = _super.prototype.measure.call(this, measuredLine);
                measuredLineDimensions.width -= 2 * this.getNotWhitespaceCharacterWidth();
                return measuredLineDimensions;
            };
            Measurer.prototype.measure = function (text) {
                var _this = this;
                if (text == null || text === "") {
                    return { width: 0, height: 0 };
                }
                var linesDimensions = text.split("\n").map(function (line) { return _this._measureLine(line); });
                return {
                    width: d3.max(linesDimensions, function (dim) { return dim.width; }),
                    height: d3.sum(linesDimensions, function (dim) { return dim.height; })
                };
            };
            Measurer.NotWhitespaceCharacter = "a";
            return Measurer;
        })(Measurers.AbstractMeasurer);
        Measurers.Measurer = Measurer;
    })(SVGTypewriter.Measurers || (SVGTypewriter.Measurers = {}));
    var Measurers = SVGTypewriter.Measurers;
})(SVGTypewriter || (SVGTypewriter = {}));

///<reference path="../reference.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var SVGTypewriter;
(function (SVGTypewriter) {
    (function (Measurers) {
        var CharacterMeasurer = (function (_super) {
            __extends(CharacterMeasurer, _super);
            function CharacterMeasurer() {
                _super.apply(this, arguments);
            }
            CharacterMeasurer.prototype._measureCharacter = function (c) {
                return _super.prototype.measure.call(this, c);
            };
            CharacterMeasurer.prototype._measureLine = function (line) {
                var _this = this;
                var charactersDimensions = line.split("").map(function (c) { return _this._measureCharacter(c); });
                return {
                    width: d3.sum(charactersDimensions, function (dim) { return dim.width; }),
                    height: d3.max(charactersDimensions, function (dim) { return dim.height; })
                };
            };
            return CharacterMeasurer;
        })(Measurers.Measurer);
        Measurers.CharacterMeasurer = CharacterMeasurer;
    })(SVGTypewriter.Measurers || (SVGTypewriter.Measurers = {}));
    var Measurers = SVGTypewriter.Measurers;
})(SVGTypewriter || (SVGTypewriter = {}));

///<reference path="../reference.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var SVGTypewriter;
(function (SVGTypewriter) {
    (function (Measurers) {
        var CacheCharacterMeasurer = (function (_super) {
            __extends(CacheCharacterMeasurer, _super);
            function CacheCharacterMeasurer(area) {
                _super.call(this, area);
                this.cache = new SVGTypewriter.Utils.Cache(_super.prototype._measureCharacter, SVGTypewriter.Utils.Methods.objEq);
            }
            CacheCharacterMeasurer.prototype._measureCharacter = function (c) {
                return this.cache.get(c);
            };
            return CacheCharacterMeasurer;
        })(Measurers.CharacterMeasurer);
        Measurers.CacheCharacterMeasurer = CacheCharacterMeasurer;
    })(SVGTypewriter.Measurers || (SVGTypewriter.Measurers = {}));
    var Measurers = SVGTypewriter.Measurers;
})(SVGTypewriter || (SVGTypewriter = {}));
