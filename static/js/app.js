// URL for fetching data
const dataURL = 'https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json';

// Function to fetch data from URL
async function fetchData() {
    const response = await fetch(dataURL);
    const data = await response.json();
    return data;
}

// Function to create bar chart
function createBarChart(sample) {
    console.log(`Creating bar chart for sample: ${sample}`);
    fetchData().then(data => {
        const sampleData = data.samples.find(s => s.id === sample);
        const otuIds = sampleData.otu_ids.slice(0, 10).reverse().map(id => `OTU ${id}`);
        const trace1 = {
            x: sampleData.sample_values.slice(0, 10).reverse(),
            y: otuIds,
            type: 'bar',
            text: sampleData.otu_labels.slice(0, 10).reverse(),
            orientation: 'h'
        };
        const layout = {
            title: 'Top 10 OTUs Present'
        };
        Plotly.newPlot('bar', [trace1], layout);
    });
}

// Function to create bubble chart
function createBubbleChart(sample) {
    console.log(`Creating bubble chart for sample: ${sample}`);
    fetchData().then(data => {
        const sampleData = data.samples.find(s => s.id === sample);
        const trace2 = {
            x: sampleData.otu_ids,
            y: sampleData.sample_values,
            text: sampleData.otu_labels,
            mode: 'markers',
            marker: {
                size: sampleData.sample_values,
                color: sampleData.otu_ids,
                colorscale: 'Earth'
            }
        };
        const layout = {
            title: 'Bacteria per Sample',
            hovermode: 'closest',
            xaxis: { title: 'OTU ID' }
        };
        Plotly.newPlot('bubble', [trace2], layout);
    });
}

// Function to display metadata
function displayMetadata(sample) {
    console.log(`Displaying metadata for sample: ${sample}`);
    fetchData().then(data => {
        const metadata = data.metadata.find(meta => meta.id == sample);
        const demo = d3.select('#sample-metadata');
        demo.html('');
        Object.entries(metadata).forEach(([key, value]) => {
            demo.append('h6').text(`${key}: ${value}`);
        });
    });
}

// Function to handle option change
function optionChanged(sample) {
    console.log(`Option changed, new value: ${sample}`);
    createBarChart(sample);
    createBubbleChart(sample);
    displayMetadata(sample);
}

// Initialize the dashboard
async function init() {
    // Get a handle to the drop down menu
    const selector = d3.select('#selDataset');
    
    // Fetch data and populate the drop down menu
    const data = await fetchData();
    const sampleNames = data.names;
    sampleNames.forEach(sample => {
        selector.append('option').text(sample).property('value', sample);
    });

    // Read the current sample in the drop down menu and display charts
    const initialSample = selector.property('value');
    console.log(`Initial sample: ${initialSample}`);
    createBarChart(initialSample);
    createBubbleChart(initialSample);
    displayMetadata(initialSample);
}

// Call the init function to initialize the dashboard
init();
