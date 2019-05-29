(function() {
  const width = 960;
  const height = 1220;

  window.onload = async function() {
    // load data
    [streetsGeoJSONData, speedsGeoJSONData] = await Promise.all([
      d3.json("data/street-network.geojson"),
      d3.json("data/seattle-month-box.geojson")
    ]);

    makeMapPlot();
  };

  function makeMapPlot() {
    //remove loading indicator
    d3.select("#loading").style("display", "none");

    // define the projection type we want
    let projection = d3
      .geoMercator()
      .center([-122.35, 47.67])
      .scale(200000);

    // path generator
    let path = d3
      .geoPath() // converts geoJSON to SVG paths
      .projection(projection); // use projection

    // define svg element
    let svg = d3
      .select("body")
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    // define tooltip div
    let tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

    // draw the streets
    svg
      .selectAll("streets")
      .data(streetsGeoJSONData.features)
      .enter()
      .append("path")
      .attr("d", path)
      .style("stroke", "#1e2227")
      .style("stroke-width", 3)
      .style("fill", "none")
      .on("mouseover", data => {
        tooltip
          .html(
            `<b>${data.properties["R_ADRS_FROM"]} ${
              data.properties["ORD_STREET_NAME"]
            }</b><br/>${data.properties["SND_FEACODE"]}`
          )
          .style("opacity", 1)
          .style("display", "flex")
          .style("flex-direction", "column")
          .style("left", d3.event.pageX + 10 + "px")
          .style("top", d3.event.pageY + 10 + "px");
      })
      .on("mouseout", d => {
        tooltip.style("opacity", 0).style("display", "none");
      });

    // draw the speeds
    svg
      .selectAll("speeds")
      .data(speedsGeoJSONData.features)
      .enter()
      .append("path")
      .attr("d", path)
      .style(
        "stroke",
        ({ properties }) =>
          `hsl(40, 100%, ${properties["pct_from_freeflow"] / 2 || 5}%)`
      )
      .style("stroke-width", "1")
      .style("fill", "none")
      .style("pointer-events", "none");
  }
})();
