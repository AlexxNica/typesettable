///<reference path="reference.ts" />

module SVGTypewriter.Writers {
  export interface WriteOptions {
      selection: D3.Selection;
      xAlign: string;
      yAlign: string;
      textRotation: number;
    }

  export class Writer {
    private _measurer: Measurers.AbstractMeasurer;
    private _wrapper: Wrappers.Wrapper;

    private static SupportedRotation = [-90, 0, 180, 90];

    private static AnchorConverter: {[s: string]: string} = {
      left: "start",
      center: "middle",
      right: "end"
    };

    private static XOffsetFactor: {[s: string]: number} = {
      left: 0,
      center: 0.5,
      right: 1
    };

    private static YOffsetFactor: {[s: string]: number} = {
      top: 0,
      center: 0.5,
      bottom: 1
    };

    constructor(measurer: Measurers.AbstractMeasurer,
                wrapper?: Wrappers.Wrapper) {
      this.measurer(measurer);
      if (wrapper) {
        this.wrapper(wrapper);
      }
    }

    public measurer(newMeasurer: Measurers.AbstractMeasurer): Writer {
      this._measurer = newMeasurer;
      return this;
    }

    public wrapper(newWrapper: Wrappers.Wrapper): Writer {
      this._wrapper = newWrapper;
      return this;
    }

    private writeLine(line: string, g: D3.Selection, width: number, xAlign: string, yOffset: number) {
      var textEl = g.append("text");
      textEl.text(line);
      var xOffset = width * Writer.XOffsetFactor[xAlign];
      var anchor: string = Writer.AnchorConverter[xAlign];
      textEl.attr("text-anchor", anchor).classed("text-line", true);
      Utils.DOM.transform(textEl, xOffset, yOffset);
    }

    private writeText(text: string, writingArea: D3.Selection, width: number, height: number, xAlign: string, yAlign: string) {
      var lines = text.split("\n");
      var lineHeight = this._measurer.measure().height;
      var yOffset = Writer.YOffsetFactor[yAlign] * (height - lines.length * lineHeight);
      lines.forEach((line: string, i: number) => {
        this.writeLine(line, writingArea, width, xAlign, (i + 1) * lineHeight + yOffset);
      });
    }

    public write(text: string, width: number, height: number, options: WriteOptions) {
      if (Writer.SupportedRotation.indexOf(options.textRotation) === -1) {
        throw new Error("unsupported rotation - " + options.textRotation);
      }

      var orientHorizontally = Math.abs(Math.abs(options.textRotation) - 90) > 45;
      var primaryDimension = orientHorizontally ? width : height;
      var secondaryDimension = orientHorizontally ? height : width;

      var textArea = options.selection.append("g").classed("textArea", true);
      var wrappedText = this._wrapper ?
                          this._wrapper.wrap(text, this._measurer, primaryDimension, secondaryDimension).wrappedText :
                          text;

      this.writeText(wrappedText,
                     textArea,
                     primaryDimension,
                     secondaryDimension,
                     options.xAlign,
                     options.yAlign
                     );
      var xForm = d3.transform("");
      xForm.rotate = options.textRotation;

      switch (options.textRotation) {
        case 90:
          xForm.translate = [width, 0];
          break;
        case -90:
          xForm.translate = [0, height];
          break;
        case 180:
          xForm.translate = [width, height];
          break;
      }

      textArea.attr("transform", xForm.toString());
    }
  }
}
