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
let chart1, chart2, chart3, chart4;
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


    createChart1();
    createChart2();
    createChart3();
    createChart4();
}
function createChart1() {
    const svg = chart1;
    const data = dashboardData;

    const groupedData = Array.from(
        d3.rollup(data, v => d3.mean(v, d => d.exam_score), d => +d.mental_health_rating),
        ([rating, avgScore]) => ({ rating: rating.toString(), avgScore })
    ).sort((a, b) => d3.ascending(+a.rating, +b.rating));

    const margin = { top: 30, right: 30, bottom: 40, left: 50 };
    const width = 400;
    const height = 300;

    const x = d3.scaleBand()
        .domain(groupedData.map(d => d.rating))
        .range([margin.left, width - margin.right])
        .padding(0.2);

    const y = d3.scaleLinear()
        .domain([0, d3.max(groupedData, d => d.avgScore)])
        .nice()
        .range([height - margin.bottom, margin.top]);

    // Axes
    svg.append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x).tickFormat(d => `Rating ${d}`));

    svg.append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y));

    // Bars
    svg.selectAll(".bar")
        .data(groupedData)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d.rating))
        .attr("y", d => y(d.avgScore))
        .attr("width", x.bandwidth())
        .attr("height", d => y(0) - y(d.avgScore))
        .attr("fill", "#4caf50");

    // Labels
    svg.selectAll(".label")
        .data(groupedData)
        .enter()
        .append("text")
        .attr("x", d => x(d.rating) + x.bandwidth() / 2)
        .attr("y", d => y(d.avgScore) - 5)
        .attr("text-anchor", "middle")
        .style("font-size", "11px")
        .text(d => d.avgScore.toFixed(1));
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


function createChart3(){

}

function createChart4(){

}

// clear files if changes (dataset) occur
function clearDashboard() {

    chart1.selectAll("*").remove();
    chart2.selectAll("*").remove();
    chart3.selectAll("*").remove();
    chart4.selectAll("*").remove();
}
