d3.csv("virat_kohli_ipl_hist.csv").then(function(data) {
        console.log(data);
        console.log("Last Data Point: ", data[data.length - 1]);

        // Set up the SVG canvas dimensions
        var margin = { top: 20, right: 20, bottom: 70, left: 50 }, // Increased bottom margin for x-axis labels
            width = 600 - margin.left - margin.right,
            height = 400 - margin.top - margin.bottom;

        // Append the SVG canvas to the body of the page
        var svg = d3.select("body")
            .append("svg")
            .attr("width", 800 + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // Convert Year and Runs to numbers
        data.forEach(function(d) {
            d.Year = +d.Year;
            d.Runs = +d.Runs;
        });

        // Check for NaN values
        if (data.some(d => isNaN(d.Year) || isNaN(d.Runs))) {
            console.error("Invalid data. Check for NaN values in the dataset.");
            return;
        }

        // Scale the range of the data
        var xScale = d3.scaleLinear().range([0, width]);
        var yScale = d3.scaleLinear().range([height, 0]);

        // Set the x-axis domain explicitly from 2008 to 2023
        xScale.domain([2008, 2023]);
        yScale.domain([0, d3.max(data, function(d) { return d.Runs; })]);

        // Define the line
        var valueline = d3.line()
            .x(function(d) { return xScale(d.Year); })
            .y(function(d) { return yScale(d.Runs); });

        // Add the valueline path with styling
        svg.append("path")
            .data([data])
            .attr("class", "line")
            .attr("d", valueline)
            .attr("stroke", "steelblue")  // Line color
            .attr("stroke-width", 2)      // Line width
            .attr("fill", "none");        // No fill

        // Add the scatterplot with text boxes on hover
        svg.selectAll("dot")
            .data(data)
            .enter().append("g")
            .attr("class", "dot-group")
            .on("mouseover", function(d) {
                // Show text box on hover
                d3.select(this)
                    .append("text")
                    .attr("class", "hover-text")
                    .attr("x", xScale(d.Year) + 10)
                    .attr("y", yScale(d.Runs) - 10)
                    .text("Year: " + d.Year +", Runs: " + d.Runs);
            })
            .on("mouseout", function() {
                // Remove text box on mouseout
                d3.select(this)
                    .select(".hover-text")
                    .remove();
            })
            .on("click", function(d) {
                // Display bar chart for the clicked year
                d3.selectAll("svg").remove(); // Remove existing SVG elements
                navigateToBarChart(d.Year,"V Kohli");
            })

            .append("circle")
            .attr("r", 5)
            .attr("cx", function(d) { return xScale(d.Year); })
            .attr("cy", function(d) { return yScale(d.Runs); });

        // Add the X Axis with label
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(xScale))
            .append("text")
            .attr("x", width / 2)
            .attr("y", 40)
            .attr("dy", "0.71em")
            .style("text-anchor", "middle")
            .text("Year");

        // Add the Y Axis with label
        svg.append("g")
            .call(d3.axisLeft(yScale))
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", -40)
            .attr("dy", "0.71em")
            .style("text-anchor", "end")
            .text("Runs");

        // Add a tooltip div
        // var tooltip = d3.select("body")
        //     .append("div")
        //     .attr("class", "tooltip")
        //     .style("opacity", 0);
            // Function to navigate to bar chart script
            // On click of a data point
// as needed
/// Function to navigate to the bar chart script
function navigateToBarChart(selectedYear, selectedPlayer) {
    // Dynamically create a script element
    var script = document.createElement('script');
    script.src = 'bar_chart.js'; // Replace with the correct path to your bar chart script

    // Set up a callback function to be executed when the script is loaded
    script.onload = function () {
        // Initialize or call a function from the loaded script, passing the selectedYear and selectedPlayer
        initBarChart(selectedYear, selectedPlayer);
    };

    // Append the script element to the head of the document
    document.head.appendChild(script);
}

// Function to initialize the bar chart with the selected year


// Now you can use selectedYear and selectedPlayer in your logic
//navigateToBarChart(selectedYear, selectedPlayer);


    });