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
    const data = dashboardData; // assumes global variable set when initDashboard is called

    const groupedData = Array.from(
        d3.rollup(data, v => d3.mean(v, d => d.exam_score), d => d.part_time_job),
        ([jobStatus, avgScore]) => ({ jobStatus, avgScore })
    );

    const margin = { top: 20, right: 30, bottom: 40, left: 50 };
    const width = 400;
    const height = 300;

    const x = d3.scaleBand()
        .domain(groupedData.map(d => d.jobStatus))
        .range([margin.left, width - margin.right])
        .padding(0.2);

    const y = d3.scaleLinear()
        .domain([0, d3.max(groupedData, d => d.avgScore)])
        .nice()
        .range([height - margin.bottom, margin.top]);

    // Axes
    svg.append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x));

    svg.append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y));

    // Bars
    svg.selectAll(".bar")
        .data(groupedData)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d.jobStatus))
        .attr("y", d => y(d.avgScore))
        .attr("width", x.bandwidth())
        .attr("height", d => y(0) - y(d.avgScore))
        .attr("fill", "#4682b4");

    // Labels
    svg.selectAll(".label")
        .data(groupedData)
        .enter()
        .append("text")
        .attr("x", d => x(d.jobStatus) + x.bandwidth() / 2)
        .attr("y", d => y(d.avgScore) - 5)
        .attr("text-anchor", "middle")
        .style("font-size", "11px")
        .text(d => d.avgScore.toFixed(1));
}

    

}

function createChart2(){

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
