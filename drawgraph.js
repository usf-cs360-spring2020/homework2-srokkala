//Sources used for D3 help:
//https://syntagmatic.github.io/parallel-coordinates/
//https://bl.ocks.org/jasondavies/1341281
//https://www.d3-graph-gallery.com/graph/parallel_basic.html
//https://www.d3-graph-gallery.com/graph/parallel_custom.html

// Set the dimensions and margins of the SVG
var margin = {
    top: 20,
    right: 5,
    bottom: 5,
    left: 5
  },
  width = 960 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

// Creating the svg
var svg = d3.select("#parallel")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform",
    "translate(" + margin.left + "," + margin.top + ")");

// Parsing the data from the excel file
  d3.csv("data.csv").then(function(data) {

  // Using 4 columns
  dimensions = d3.keys(data[0]).filter(function(d) {
    return (["k_median", "par_median","par_rank", "k_rank"].includes(d));
  })

  //double checking if we are using the right columns
  console.log(dimensions);

  //Swappings the dimensions so to match the prototype
  [dimensions[0], dimensions[2]] = [dimensions[2], dimensions[0]];

  // Creating the scales for y
  var y = {}
  for (i in dimensions) {
    name = dimensions[i]
    y[name] = d3.scaleLinear()
      .domain(d3.extent(data, function(d) {
        return +d[name];
      }))
      .range([height, 0])
  }

  // Building the x scale
  x = d3.scalePoint()
    .range([0, width])
    .padding(1)
    .domain(dimensions);

  function path(d) {
    return d3.line()(dimensions.map(function(p) {
      return [x(p), y[p](d[p])];
    }));
  }

  //Visualization of the lines
  svg
    .selectAll("line")
    .data(data)
    .enter().append("path")
    .attr("d", path)
    .style("fill", "none")
    .style("stroke", "#bf0733")
    .style("opacity", 0.3)

  // Axis drawing and Labelling
  svg.selectAll("axis")
    .data(dimensions).enter()
    .append("g")
    .attr("transform", function(d) {
      return "translate(" + x(d) + ")";
    })
    .each(function(d) {
      d3.select(this).call(d3.axisLeft().scale(y[d]));
    })
    .append("text")
    .style("text-anchor", "middle")
    .attr("y", -9)
    .text(function(d) {
      switch (d) {
        case "k_rank":
          return "Kids Rank";
        case "par_rank":
          return "Parents Rank";
        case "par_median":
          return "Parents Average Income";
        case "k_median":
          return "Kid Average Income";
        default:
          return d;
      }
    })
    .style("fill", "black")
})
