import * as d3 from "d3";

import { assert } from "chai";

export function generateSVG(width = 400, height = 400): d3.Selection<any> {
  const parent = getSVGParent();
  return parent.append("svg").attr("width", width).attr("height", height).attr("class", "svg");
}

export function getSVGParent(): d3.Selection<any> {
  const mocha = d3.select("#mocha-report");
  if (mocha.node() != null) {
    const suites = mocha.selectAll(".suite");
    const lastSuite = d3.select(suites[0][suites[0].length - 1]);
    return lastSuite.selectAll("ul");
  } else {
    return d3.select("body");
  }
}

const PIXEL_CLOSETO_REQUIREMENT = 2;

export function assertBBoxInclusion(outerEl: d3.Selection<any>, innerEl: d3.Selection<any>) {
  const outerBox = (outerEl.node() as Element).getBoundingClientRect();
  const innerBox = (innerEl.node() as Element).getBoundingClientRect();
  assert.operator(Math.floor(outerBox.left), "<=", Math.ceil(innerBox.left) + PIXEL_CLOSETO_REQUIREMENT,
          "bounding rect left included");
  assert.operator(Math.floor(outerBox.top), "<=", Math.ceil(innerBox.top) + PIXEL_CLOSETO_REQUIREMENT,
          "bounding rect top included");
  assert.operator(Math.ceil(outerBox.right) + PIXEL_CLOSETO_REQUIREMENT, ">=", Math.floor(innerBox.right),
          "bounding rect right included");
  assert.operator(Math.ceil(outerBox.bottom) + PIXEL_CLOSETO_REQUIREMENT, ">=", Math.floor(innerBox.bottom),
          "bounding rect bottom included");
}
