// utils/date.js
//
// Description:
// Contains the utilities to parse date, albeit a
// very simple and limited one

const DateUtil = {
  format: d3.timeFormat('%Y-%m-%d'),
  parse: d3.timeParse('%Y-%m-%d')
}
