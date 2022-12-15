// Add svg
d3.select("#plot")
    .append("svg")
    .attr("width", 500)
    .attr("height", 575);

const svg = d3.select("svg");

const top_bound = 100;
const right_edge = 400;
const left_edge = 100;
const mid = (right_edge + left_edge) / 2

// Add header text
svg.append("text")
    .attr("x", left_edge)
    .attr("y", top_bound)
    .attr("text-anchor", "middle")
    .text("Group 1");

svg.append("text")
    .attr("x", mid)
    .attr("y", top_bound)
    .attr("text-anchor", "middle")
    .text("Nutrient");

svg.append("text")
    .attr("x", right_edge)
    .attr("y", top_bound)
    .attr("text-anchor", "middle")
    .text("Group 2");

const dataset = [
    {key: "Sugar"},
    {key: "Protein"},
    {key: "Fiber"},
    {key: "Sodium"},
    {key: "Cholesterol"},
    {key: "Fat"},
    {key: "Carbohydrates"}
];

const text_height = 50

// Add nutrient text
svg.selectAll("text.item").data(dataset).enter().append("text")
    .attr("x", mid)
    .attr("y", (d, i) => top_bound + text_height + i * text_height)
    .attr("text-anchor", "middle")
    .attr("class", "item")
    .attr("id", (d) => d.key)
    .text((d) => d.key);

const max_width = 125

// Create left rectangles
svg.selectAll("rect.left").data(dataset).enter().append("rect")
    .attr("x", left_edge - 60)
    .attr("y", (d, i) => top_bound + text_height - text_height/2 + i * text_height)
    .attr("height", text_height)
    .attr("width", max_width)
    .attr("fill-opacity", "0")
    .attr("stroke-width", 1)
    .attr("stroke", "black")
    .attr("class", "left")
    .attr("id", (d) => "rect" + d.key);

// Add onclick to left rectangles
svg.selectAll("rect.left").on("click", function() {
    var nut = d3.select(this).attr("id").substring(4)
    svg.select("text#" + nut).transition(2000).attr("x", left_edge).attr("class", "group1")
});

// Create right rectangles
svg.selectAll("rect.right").data(dataset).enter().append("rect")
    .attr("x", right_edge - 60)
    .attr("y", (d, i) => top_bound + text_height - text_height/2 + i * text_height)
    .attr("height", text_height)
    .attr("width", max_width)
    .attr("fill-opacity", "0")
    .attr("stroke-width", 1)
    .attr("stroke", "black")
    .attr("class", "right")
    .attr("id", (d) => "rect" + d.key);

// Add onclick to right rectangles
svg.selectAll("rect.right").on("click", function() {
    var nut = d3.select(this).attr("id").substring(4)
    svg.select("text#" + nut).transition(2000).attr("x", right_edge).attr("class", "group2")
});

// Add solution (hidden at start)
svg.append("text")
    .attr("x", mid)
    .attr("y", top_bound + (dataset.length + 1.5) * text_height)
    .attr("text-anchor", "middle")
    .attr("id", "solution")

d3.select("#plot").append("button")
    .text("Verify")
    .style("position", "relative")
    .style("left", -275)
    .on("click", function() {
        if(verify()) {
            d3.select("text#solution")
                .style("fill", "white")
                .text("Correct! Great job!")
                .transition(2000)
                .style("fill", "black")
                
        }
        else {
            d3.select("text#solution")
                .style("fill", "white")
                .text("Wrong. Try again.")
                .transition(2000)
                .style("fill", "black")
        }
    })

function verify() {

    const sol1 = new Set(["Protein", "Sodium", "Fat", "Cholesterol"]);
    const sol2 = new Set(["Carbohydrates", "Sugar", "Fiber"]);

    var g1 = new Set();
    d3.selectAll("text.group1").each(function() {
        g1.add(d3.select(this).text())
    });

    var g2 = new Set();
    d3.selectAll("text.group2").each(function() {
        g2.add(d3.select(this).text())
    })
    
    function c(aSet, bSet){
        return ![...aSet].some(item => !bSet.has(item)) && ![...bSet].some(item => !aSet.has(item))
    }

    return (c(sol1, g1) && c(sol2, g2)) || (c(sol1, g2) && c(sol2, g1))
}

    