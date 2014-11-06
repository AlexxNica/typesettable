///<reference path="reference.ts" />

module SVGTypewriter.Writers {
  export interface WriteOptions {
      selection: D3.Selection;
      xAlign: string;
      yAlign: string;
      textOrientation: string;
    }

  export class Writer {
    private _measurer: Measurers.AbstractMeasurer;
    private _wrapper: Wrappers.Wrapper;

    private static AnchorConverter: {[s: string]: string} = {
      left: "start",
      center: "middle",
      right: "end"
    };

    private static HEIGHT_TEXT = "bqpdl";

    constructor(measurer: Measurers.AbstractMeasurer,
                wrapper: Wrappers.Wrapper) {
      this.measurer(measurer);
      this.wrapper(wrapper);
    }

    public measurer(): Measurers.AbstractMeasurer;
    public measurer(newMeasurer: Measurers.AbstractMeasurer): Writer;
    public measurer(newMeasurer?: any): any {
      if(newMeasurer == null) {
        return this._measurer;
      } else {
        this._measurer = newMeasurer;
        return this;
      }
    }

    public wrapper(): Wrappers.Wrapper;
    public wrapper(newWrapper: Wrappers.Wrapper): Writer;
    public wrapper(newWrapper?: any): any {
      if(newWrapper == null) {
        return this._wrapper;
      } else {
        this._wrapper = newWrapper;
        return this;
      }
    }

    private writeLine(line: string, g: D3.Selection, align = "left") {
      var textEl = g.append("text");
      textEl.text(line);
      var anchor: string = Writer.AnchorConverter[align];
      textEl.attr("text-anchor", anchor);
    }

    public write(text: string, width: number, height: number, options: WriteOptions) {
      var wrappedText = this._wrapper.wrap(text, this._measurer, width, height).wrappedText;
      var innerG = options.selection.append("g").classed("writeText-inner-g", true);
      var lines = wrappedText.split("\n");
      var h = this._measurer.measure(Writer.HEIGHT_TEXT).height;
      lines.forEach((line: string, i: number) => {
        var selection = innerG.append("g");
        Utils.DOM.transform(selection, 0, (i + 1) * h);
        this.writeLine(line, selection);
      });
    }
  }
}
