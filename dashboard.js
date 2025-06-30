/*
* Data Visualization - Framework
* Copyright (C) University of Passau
*   Faculty of Computer Science and Mathematics
*   Chair of Cognitive sensor systems
* Maintenance:
*   2025, Alexander Gall <alexander.gall@uni-passau.de>
*
* All rights reserved.
*/

// TODO: File for Part 2
// TODO: You can edit this file as you wish - add new methods, variables etc. or change/delete existing ones.

// TODO: use descriptive names for variables
let chart1, chart2, chart3, chart4, chart5, chart6;
let dashboardData = []

function initDashboard(_data) {

    // TODO: Initialize the environment (SVG, etc.) and call the nedded methods
    dashboardData = _data; // store data for use in all createChart functions

    //  SVG container
    chart1 = d3.select("#chart1").append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g");

    //  SVG container
    chart2 = d3.select("#chart2").append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g");


    //  SVG container
    chart3 = d3.select("#chart3").append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g");


    //  SVG container
    chart4 = d3.select("#chart4").append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g");
    
    chart5 = d3.select("#chart5").append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g");
    
    chart6 = d3.select("#chart6").append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g");


    createChart1();
    createChart2();
    createChart3();
    createChart4();
    createChart5();
    createChart6();
}
function createChart1() {
    const svg = chart1;
    const data = dashboardData;

    // Group and compute average exam score per mental health rating
    const groupedData = Array.from(
        d3.rollup(data, v => d3.mean(v, d => d.exam_score), d => +d.mental_health_rating),
        ([rating, avgScore]) => ({ rating: rating.toString(), avgScore })
    ).sort((a, b) => d3.ascending(+a.rating, +b.rating));

    // Use same dimensions as histogram for consistency
    const margin = { top: 30, right: 30, bottom: 50, left: 100 };
    const width = 500;
    const height = 400;

    // X = avg exam score (numeric)
    const x = d3.scaleLinear()
        .domain([0, d3.max(groupedData, d => d.avgScore)])
        .nice()
        .range([margin.left, width - margin.right]);

    // Y = mental health rating (ordinal)
    const y = d3.scaleBand()
        .domain(groupedData.map(d => d.rating))
        .range([margin.top, height - margin.bottom])
        .padding(0.2);

    // Update chart1 dimensions
    d3.select("#chart1 svg")
        .attr("width", width)
        .attr("height", height);

    // Axes
    svg.append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x));

    svg.append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y).tickFormat(d => `Rating ${d}`));

    // Bars (horizontal)
    svg.selectAll(".bar")
        .data(groupedData)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("y", d => y(d.rating))
        .attr("x", margin.left)
        .attr("width", d => x(d.avgScore) - margin.left)
        .attr("height", y.bandwidth())
        .attr("fill", "#4caf50");

    // Labels
    svg.selectAll(".label")
        .data(groupedData)
        .enter()
        .append("text")
        .attr("x", d => x(d.avgScore) + 5)
        .attr("y", d => y(d.rating) + y.bandwidth() / 2 + 4)
        .style("font-size", "11px")
        .text(d => d.avgScore.toFixed(1));
    
    // X-axis label
        svg.append("text")
        .attr("x", (width + margin.left - margin.right) / 2)
        .attr("y", height - 5)
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .text("Exam Score");

    // Y-axis label
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", - (margin.top + (height - margin.top - margin.bottom) / 2))
        .attr("y", 15)
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .text("Mental Health Rating");

}


function createChart2(){
    createHistogram(chart2, dashboardData, d => +d.exam_score, width, height);
}
function createHistogram(svgContainer, data, valueAccessor, width, height) {
    const margin = { top: 30, right: 30, bottom: 50, left: 50 },
          innerWidth = width - margin.left - margin.right,
          innerHeight = height - margin.top - margin.bottom;

    const svg = svgContainer
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const values = data.map(valueAccessor);

    const x = d3.scaleLinear()
        .domain(d3.extent(values))
        .nice()
        .range([0, innerWidth]);

    const bins = d3.bin().domain(x.domain()).thresholds(20)(values);

    const y = d3.scaleLinear()
        .domain([0, d3.max(bins, d => d.length)])
        .nice()
        .range([innerHeight, 0]);

    // X Axis
    svg.append("g")
        .attr("transform", `translate(0,${innerHeight})`)
        .call(d3.axisBottom(x));

    // Y Axis
    svg.append("g")
        .call(d3.axisLeft(y));

    // Bars
    svg.selectAll("rect")
        .data(bins)
        .enter()
        .append("rect")
        .attr("x", d => x(d.x0))
        .attr("y", d => y(d.length))
        .attr("width", d => x(d.x1) - x(d.x0) - 1)
        .attr("height", d => innerHeight - y(d.length))
        .style("fill", "orange");

    // Axis labels
    svg.append("text")
        .attr("x", innerWidth / 2)
        .attr("y", innerHeight + margin.bottom - 5)
        .attr("text-anchor", "middle")
        .text("Exam Score");

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -innerHeight / 2)
        .attr("y", -margin.left + 15)
        .attr("text-anchor", "middle")
        .text("Number of Students");
}


function createChart3() {
    // First bucket study_hours_per_day into categories
    const bucketedData = dashboardData.map(d => {
        let bucket;
        const val = +d.study_hours_per_day;
        if (val < 1) bucket = "Less than 1 hour";
        else if (val < 3) bucket = "1-3 hours";
        else if (val < 5) bucket = "3-5 hours";
        else bucket = "More than 5 hours";
        return {...d, study_hours_bucket: bucket};
    });

    createInteractivePieChart(chart3, bucketedData, width, height, "study_hours_bucket");
}

function createInteractivePieChart(svgContainer, data, width, height, categoryKey) {
    const margin = { top: 40, right: 40, bottom: 40, left: 40 },
          innerWidth = width - margin.left - margin.right,
          innerHeight = height - margin.top - margin.bottom,
          radius = Math.min(innerWidth, innerHeight) / 2;

    svgContainer.selectAll("*").remove();

    svgContainer
        .attr("width", width)
        .attr("height", height);

// add the title at top center
    svgContainer.append("text")
        .attr("class", "chart-title")
        .attr("x", width / 2)
        .attr("y", margin.top / 2)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("font-weight", "bold")
    .   text("Distribution of Students by Study Hours Per Day");

// then create the group for pie chart inside margins
    const svg = svgContainer
        .append("g")
        .attr("transform", `translate(${margin.left + innerWidth / 2},${margin.top + innerHeight / 2})`);


    // Aggregate counts by category
    const aggregatedData = d3.rollup(
        data,
        v => v.length,
        d => d[categoryKey]
    );

    const pie = d3.pie()
        .value(d => d[1])
        .sort(null);

    const arcs = pie(Array.from(aggregatedData));

    const arc = d3.arc()
        .innerRadius(0)
        .outerRadius(radius);

    const arcHover = d3.arc()
        .innerRadius(0)
        .outerRadius(radius + 10); // expand radius on hover

    // Color scale
    const color = d3.scaleOrdinal()
        .domain(Array.from(aggregatedData.keys()))
        .range(d3.schemeSet2);

    // Tooltip div (append to body if not exists)
    let tooltip = d3.select("body").select(".pie-tooltip");
    if (tooltip.empty()) {
        tooltip = d3.select("body")
            .append("div")
            .attr("class", "pie-tooltip")
            .style("position", "absolute")
            .style("background", "rgba(0,0,0,0.7)")
            .style("color", "white")
            .style("padding", "6px 10px")
            .style("border-radius", "4px")
            .style("pointer-events", "none")
            .style("font-size", "12px")
            .style("opacity", 0);
    }

    // Draw slices
    svg.selectAll("path")
        .data(arcs)
        .enter()
        .append("path")
        .attr("d", arc)
        .attr("fill", d => color(d.data[0]))
        .attr("stroke", "white")
        .style("stroke-width", "2px")
        .on("mouseover", function(event, d) {
            d3.select(this)
                .transition()
                .duration(200)
                .attr("d", arcHover)
                .style("cursor", "pointer");

            tooltip
                .style("opacity", 1)
                .html(
                    `<strong>${d.data[0]}</strong><br/>Count: ${d.data[1]}<br/>` +
                    `Percentage: ${(d.data[1] / data.length * 100).toFixed(1)}%`
                );
        })
        .on("mousemove", function(event) {
            tooltip
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", function() {
            d3.select(this)
                .transition()
                .duration(200)
                .attr("d", arc);

            tooltip.style("opacity", 0);
        });

    // Add labels with percentage, only if slice big enough
    svg.selectAll("text")
        .data(arcs)
        .enter()
        .append("text")
        .attr("transform", d => `translate(${arc.centroid(d)})`)
        .attr("text-anchor", "middle")
        .attr("dy", "0.35em")
        .style("font-size", "11px")
        .style("fill", "#333")
        .text(d => {
            const percent = (d.data[1] / data.length) * 100;
            return percent > 5 ? `${d.data[0]} (${percent.toFixed(1)}%)` : "";
        });
}


function createChart4() {
    createParallelCoordinates(chart4, dashboardData, width, height);
}

function createParallelCoordinates(svgContainer, data, width, height) {
    const margin = { top: 60, right: 30, bottom: 50, left: 50 },
          innerWidth = width - margin.left - margin.right,
          innerHeight = height - margin.top - margin.bottom;

    // Clear previous content
    svgContainer.selectAll("*").remove();

    // Setup SVG group with margins
    const svg = svgContainer
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Extract numeric keys (dimensions) from data - exclude non-numeric or categorical if you want
    const dimensions = Object.keys(data[0]).filter(key => {
        return typeof data[0][key] === 'number' || !isNaN(+data[0][key]);
    });

    // Create a scale for each dimension
    const y = {};
    for (const dim of dimensions) {
        y[dim] = d3.scaleLinear()
            .domain(d3.extent(data, d => +d[dim]))
            .range([innerHeight, 0]);
    }

    // X scale for positioning each axis
    const x = d3.scalePoint()
        .range([0, innerWidth])
        .padding(0.5)
        .domain(dimensions);

    // Line generator for each data item
    function path(d) {
        return d3.line()(dimensions.map(dim => [x(dim), y[dim](d[dim])]));
    }

    // Draw background lines (optional, light grey)
    svg.append("g")
        .attr("class", "background")
        .selectAll("path")
        .data(data)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("fill", "none")
        .attr("stroke", "#ddd")
        .attr("stroke-width", 1);

    // Draw foreground lines (main lines)
    svg.append("g")
        .attr("class", "foreground")
        .selectAll("path")
        .data(data)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("fill", "none")
        .attr("stroke", "#40E0D0")
        .attr("stroke-width", 1.5)
        .attr("stroke-opacity", 0.7);

    // Draw axes and labels
    const axis = d3.axisLeft();

    const g = svg.selectAll(".dimension")
        .data(dimensions)
        .enter()
        .append("g")
        .attr("class", "dimension")
        .attr("transform", d => `translate(${x(d)},0)`);

    g.append("g")
        .each(function(d) {
            d3.select(this).call(axis.scale(y[d]));
        });

    g.append("text")
        .attr("y", -20)               // move further up
        .attr("x", 0)                 // center of axis
        .attr("text-anchor", "start") // align left after rotation
        .attr("transform", "rotate(-45)")  // rotate for better fit
        .style("font-size", "12px")
        .style("fill", "black")
        .text(d => d);
}

function createChart5() {
    const svg = chart5;
    const data = dashboardData;

    const variables = [
        'age',
        'study_hours_per_day',
        'social_media_hours',
        'netflix_hours',
        'attendance_percentage',
        'sleep_hours',
        'exercise_frequency',
        'mental_health_rating',
        'exam_score'
      ];
      
    const matrix = [];

    // Compute correlation coefficients
    for (let i = 0; i < variables.length; i++) {
        for (let j = 0; j < variables.length; j++) {
            const x = data.map(d => +d[variables[i]]);
            const y = data.map(d => +d[variables[j]]);
            const corr = d3.corr(x, y);
            if (!isNaN(corr)) {
                matrix.push({ x: variables[i], y: variables[j], value: corr });
            }
        }
    }

    const cellSize = 40;
    const margin = { top: 180, right: 100, bottom: 50, left: 180 }; 
        const width = cellSize * variables.length + margin.left + margin.right;
        const height = cellSize * variables.length + margin.top + margin.bottom;
    

    const x = d3.scaleBand()
        .domain(variables)
        .range([margin.left, width - margin.right])
        .padding(0.05);

    const y = d3.scaleBand()
        .domain(variables)
        .range([margin.top, height - margin.bottom])
        .padding(0.05);

    // FIXED DOMAIN HERE
    const color = d3.scaleSequential()
        .interpolator(d3.interpolateRdBu)
        .domain([-1, 1]); // min to max, NOT reversed

    svg.attr("width", width).attr("height", height);

    // Axes
    svg.append("g")
    .attr("transform", `translate(0,${margin.top})`)
    .call(d3.axisTop(x))
    .selectAll("text")
    .attr("transform", "translate(-10, -10) rotate(-45)")
    .style("text-anchor", "end");


    svg.append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y));

    // Heatmap cells
    svg.selectAll("rect")
        .data(matrix)
        .enter()
        .append("rect")
        .attr("x", d => x(d.x))
        .attr("y", d => y(d.y))
        .attr("width", x.bandwidth())
        .attr("height", y.bandwidth())
        .style("fill", d => color(d.value))
        .style("stroke", "#fff")
        .style("stroke-width", 0.5);

    // Text in each cell
    svg.selectAll("text.cell")
        .data(matrix)
        .enter()
        .append("text")
        .attr("class", "cell")
        .attr("x", d => x(d.x) + x.bandwidth() / 2)
        .attr("y", d => y(d.y) + y.bandwidth() / 2)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .style("fill", d => Math.abs(d.value) > 0.5 ? "white" : "black")
        .style("font-size", "11px")
        .text(d => d.value.toFixed(2));

    // Title
        svg.append("text")
        .attr("x", width / 2)
        .attr("y", margin.top / 2)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .text("Correlation Heatmap"); 
    

}

d3.corr = function(x, y) {
    const n = x.length;
    const meanX = d3.mean(x);
    const meanY = d3.mean(y);
    const cov = d3.sum(x.map((xi, i) => (xi - meanX) * (y[i] - meanY))) / n;
    const stdX = d3.deviation(x);
    const stdY = d3.deviation(y);
    return cov / (stdX * stdY);
};

// clear files if changes (dataset) occur
function clearDashboard() {

    chart1.selectAll("*").remove();
    chart2.selectAll("*").remove();
    chart3.selectAll("*").remove();
    chart4.selectAll("*").remove();
}
