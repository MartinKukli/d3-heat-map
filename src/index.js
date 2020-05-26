import * as d3 from "d3";

const builder = jsonData => {
  const width = 1200;
  const height = 500;
  const yearsList = jsonData.monthlyVariance.map(item => item.year);
  const varianceList = jsonData.monthlyVariance.map(item => {
    const temp = jsonData.baseTemperature + item.variance;
    const tempFix = parseFloat(temp.toFixed(2));
    return tempFix;
  });
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];

  const svg = d3
    .select(".cellsTable")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  const tooltip = d3
    .select(".cellsTable")
    .append("div")
    .attr("id", "tooltip")
    .style("opacity", 0);

  const colors = d3
    .scaleSequential()
    .domain(d3.extent(varianceList))
    .interpolator(d3.interpolateRainbow);

  const xAxisScale = d3
    .scaleLinear()
    .domain(d3.extent(yearsList))
    .range([0, width - 50]);
  const xAxis = d3.axisBottom(xAxisScale).tickFormat(d3.format("d"));
  svg
    .append("g")
    .call(xAxis)
    .attr("id", "x-axis")
    .attr("transform", "translate(60, 480)");

  const yAxisScale = d3
    .scaleBand()
    .domain([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11])
    .range([0, height - 20]);
  const yAxis = d3.axisLeft(yAxisScale).tickFormat((d, i) => months[i]);
  svg
    .append("g")
    .call(yAxis)
    .attr("id", "y-axis")
    .attr("transform", "translate(60, 0)");

  d3.select("svg")
    .selectAll("rect")
    .data(jsonData.monthlyVariance)
    .enter()
    .append("rect")
    .attr("class", "cell")
    .attr("data-year", (d, i) => d.year)
    .attr("data-month", (d, i) => d.month - 1)
    .attr("data-temp", (d, i) => jsonData.baseTemperature + d.variance)
    .attr("x", (d, i) => xAxisScale(d.year))
    .attr("y", (d, i) => yAxisScale(d.month - 1))
    .attr("width", "10px")
    .attr("height", (height - 20) / 12 + "px")
    .style("fill", (d, i) => colors(jsonData.baseTemperature + d.variance))
    .attr("transform", "translate(60, 0)")
    .on("mouseover", (d, i) => {
      tooltip
        .transition()
        .duration(100)
        .style("opacity", 0.9);
      tooltip
        .html(
          `Year: ${d.year} <br> Month: ${months[d.month - 1]} <br> Temp: ${(
            jsonData.baseTemperature + d.variance
          ).toFixed(2)}`
        )
        .attr("data-year", d.year)
        .style("left", `${xAxisScale(d.year) + 20}px`)
        .style("top", `${yAxisScale(d.month - 1) + 150}px`)
        .style("transform", "translateX(60px)");
    })
    .on("mouseout", (d, i) => {
      tooltip
        .transition()
        .duration(100)
        .style("opacity", 0);
    });

  // legend
  const legendScale = d3
    .scaleBand()
    .domain([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14])
    .range([0, 500]);

  const legend = d3
    .select(".cellsTable")
    .append("svg")
    .attr("id", "legend")
    .attr("width", "500px")
    .attr("height", "60px")
    .style("fill", "grey");

  const legendAxis = d3.axisBottom(legendScale);

  legend
    .selectAll("rect")
    .data([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14])
    .enter()
    .append("rect")
    .attr("width", `${500 / 14}px`)
    .attr("height", "50px")
    .attr("x", (d, i) => legendScale(d))
    .style("fill", (d, i) => colors(d));

  legend.append("g").call(legendAxis);
};

d3.json(
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json"
)
  .then(data => builder(data))
  .catch(() => console.error("Something is wrong..."));
