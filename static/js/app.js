// function for the demographic info
function demoInfo(dataName)
{
    //console.log(dataName);

    // use d3.json in order to retrieve the metadata
    d3.json("samples.json").then((data) => {
        let metadata = data.metadata;
        //console.log(metadata)

        // filter based on the value of the sample
        let result = metadata.filter(dataNameResult => dataNameResult.id == dataName);
        
        // get the first item from the array
        let resultData = result[0];
        //console.log(resultData)

        // clear the metadata
        d3.select("#sample-metadata").html("");

        // get the value key pairs
        Object.entries(resultData).forEach(([key, value])=>{
            // add to the demo info section
            d3.select("#sample-metadata")
                .append("h5").text(`${key}: ${value}`)
        });
    })
}
// function for the bar chart
function barChart(dataName)
{
    let data = d3.json("samples.json");
    //console.log(data);
    
    d3.json("samples.json").then((data) => {
        let samples = data.samples;
        //console.log(samples)

        // filter based on the value of the sample
        let result = samples.filter(dataNameResult => dataNameResult.id == dataName);
        
        // get the first item from the array
        let resultData = result[0];
        //console.log(resultData)

        // get the otu_ids, labels, and sample values
        let otu_ids = resultData.otu_ids;
        let otu_labels = resultData.otu_labels;
        let sampleValues = resultData.sample_values

        // build the bar chart
        // get the elements for the trace
        let yTicks = otu_ids.slice(0,10).map(id => `OTU ${id}`);
        let xValues = sampleValues.slice(0,10);
        let textLabels = otu_labels.slice(0,10);

        // reverse the data, so that it is in descending order
        yTicks.reverse();
        xValues.reverse();
        textLabels.reverse();

        // set up trace for the bar chart
        let barTrace = {
            x: xValues,
            y: yTicks,
            text: textLabels,
            type: "bar",
            orientation: "h"
        };
        let barData = [barTrace]; // save the data as an array of the trace

        // set the title for the bubble chart
        let layout = {
            title: "Top 10 OTUs"
        }

        // create the bar chart with the data from the samples json
        Plotly.newPlot("bar", barData, layout);

        
    })
}

// function for the bubble chart
function bubbleChart(dataName)
{
    let data = d3.json("samples.json");
    //console.log(data);
    
    d3.json("samples.json").then((data) => {
        let samples = data.samples;
        //console.log(samples)

        // filter based on the value of the sample
        let result = samples.filter(dataNameResult => dataNameResult.id == dataName);
        
        // get the first item from the array
        let resultData = result[0];
        //console.log(resultData)

        // get the otu_ids, labels, and sample values
        let otu_ids = resultData.otu_ids;
        let otu_labels = resultData.otu_labels;
        let sampleValues = resultData.sample_values;

        

        // set up trace for the bubble chart
        let bubbleTrace = {
            x: otu_ids,
            y: sampleValues,
            text: otu_labels,
            mode: 'markers',
            marker: {
                color: otu_ids,
                size: sampleValues
            }
        };
        let bubbleData = [bubbleTrace]; // save the data as an array of the trace

        //set the title for the bubble chart
        let layout =
        {
            title: "Bacteria Cultures Per Sample"
        };

        // create the bubble chart with the data from the samples json
        Plotly.newPlot("bubble", bubbleData, layout);

        
    })
}

// initial function
function init()
{
    // load the data from the samples file
    let data = d3.json("samples.json");
    //console.log(data);

    // access the dropdown selector
    var select = d3.select("#selDataset");

    // use d3.json in order to retrieve the data
    d3.json("samples.json").then((data) => {
        let dataNames = data.names; // made an array of the names
        //console.log(dataNames);

        // use forEach to create options in the dropdown
        dataNames.forEach((dataName) => {
            select.append("option")
                .text(dataName)
                .property("value", dataName);
        })
        // when initialized, pass in the info for the first sample
        let firstSample = dataNames[0];

        // call the function to build the metadata
        demoInfo(firstSample);

        // call the function to build the bar chart
        barChart(firstSample);

        // call the function to build the bubble chart
        bubbleChart(firstSample);
    });

    
}

// function to handle dropdown change
function optionChanged(item)
{
    // update the demo info
    demoInfo(item);
    // update the bar chart
    barChart(item);
    // update the bubble chart
    bubbleChart(item);
}

// call the init function
init();