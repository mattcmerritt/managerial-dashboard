# Code Summary

The following React components are used to build this application:

## App.js
(description)

This component is not used by any other components, as it is the base.

## InputSelection.js
(description)

This component is used by the following components:
- `App.js`

## Navbar.js
(description)

This component is used by the following components:
- `App.js`

## DatasetLoader.js
(description)

This component is used by the following components:
- `InputSelection.js`

## EnhancedDataInput.js
(description)

This component is used by the following components:
- `InputSelection.js`

## ChartContainer.js
(description)

This component is used by the following components:
- `DatasetLoader.js`
- `EnhancedDataInput.js`

## Chart.js
This component refers to the visualizations used in all of the dashboards that are generated using Plotly (in simple terms, all the visualizations that are not the process flow). Charts must be given a `chartType` to choose pie or pillar charts, a `fields` to determine what data is being visualized, an `id` to use for recommendations, and a `source` telling it what view this chart is in. Optional values include `datasetIndex`, which gives the index of which uploaded dataset to use for the visualization (use -3 for a cumulative dataset, -2 for a cumulative visualization without the most recent dataset, and -1 for the most recent dataset), and `noButtons` to set if the chart should not generate recommendation and comparison buttons.

This component is used by the following components:
- `ChartContainer.js`

## GraphvizChart.js
(description)

This component is used by the following components:
- `ChartContainer.js`

## ExportData.js
This component is the button that is displayed in the patient and staff data views that allows the user to save their currently loaded datasets to a `.txt` file. Upon pressing the button, the `exportData()` function will be used to generate the text file, create a download link, and use the link to bring up the saving prompt.

This component is used by the following components:
- `ChartContainer.js`

## AdditionalDataInput.js
(description)

This component is used by the following components:
- `ChartContainer.js`

## ComparisonChart.js
This component refers to the visualizations used in the Staff Comparison view. There are three different types of ComparisonCharts, which can be chosen by the `fields` value. ComparisonCharts with a `fields` value of "taskfocus" require a `focus` value of the task to focus on. ComparisonCharts with a `fields` value of "dayfocus" require a `focus` value of the day. ComparisonCharts with a `fields` value of "persontask" require a `focus` value of the staff member to focus on and a `subfocus` value of the task to focus on.

This component is used by the following components:
- `ChartContainer.js`

## DatasetAdder.js
(description)

This component is used by the following components:
- `AdditionalDataInput.js`