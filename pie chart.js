var playerNationalities = {};
d3.csv("Unique_Players_2022.csv", function(error, playersData) {
    playersData.forEach(function(d) {
        playerNationalities[d.playerName] = d.nationality;
    });
});
// Set up the SVG canvas dimensions for pie chart
var margin = { top: 20, right: 20, bottom: 70, left: 50 },
    width = 600 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom,
    radius = Math.min(width, height) / 2;

// Append the SVG canvas to the body of the page
var svg = d3.select("body")
    .append("svg")
    .attr("width", 800 + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + (width / 2 + margin.left) + "," + (height / 2 + margin.top) + ")");

// Load data from JSON file
d3.json("virat_kohli_2022_runs.json").then(function (data) {
    console.log(data);

    // Filter out players with total runs less than or equal to 0
    var filteredData = Object.entries(data).filter(player => player[1].runs > 0);

    // Create a pie chart
    var pie = d3.pie()
        .value(function (d) { return d[1].runs; });

    var path = d3.arc()
        .outerRadius(radius - 10)
        .innerRadius(0);

    var arcs = svg.selectAll(".arc")
        .data(pie(filteredData))
        .enter().append("g")
        .attr("class", "arc");

    arcs.append("path")
        .attr("d", path)
        .attr("fill", function (d) { return getColor(d.data[0]); }) // Use a function to determine colors based on player name
        .on("mouseover", function (d) {
            // Show tooltip on hover
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html("Player: " + d.data[0] + "<br/>Runs: " + d.data[1].runs)
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function () {
            // Hide tooltip on mouseout
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });
});

// Function to get color based on player nationality
function getColor(playerName) {
    if (playerNationalities[playerName] === 'India') {
        return "blue"; // Color for Indian players
    } else {
        return "green"; // Color for other players
    }
}

// Add a tooltip div
var tooltip = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);
