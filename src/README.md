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
This component is used if the user specifies that they are a returning user on a view. When the user specifies that they are a returning user, the `DatasetLoader` displays two input forms: one for the formatting of the previous dataset which calls the `LoadOldDataset()` function to reload the formatting when a `.txt` file is uploaded, and one for the new data to load that calls the `LoadNewDataset()` function to parse the new data when a `.xlsx` file is uploaded. Once both files are uploaded, the `ShowCharts()` function displays the visualizations in a `ChartContainer`.

This component is used by the following components:
- `InputSelection.js`

## EnhancedDataInput.js
(description)

This component is used by the following components:
- `InputSelection.js`

## ChartContainer.js
This component refers to the holder for all of the visualizations and recommendations on a view. Once a view is given a configured dataset, a new `ChartContainer` is generated using the `GenerateCharts()` function to create the new visualizations and the `GenerateVisualizations()` function to add the recommendations to the charts generated. In the process of generating charts, the function `CreateProcessFlow()` is called to set up the `GraphvizChart`.

This component is used by the following components:
- `DatasetLoader.js`
- `EnhancedDataInput.js`

## Chart.js
This component refers to the visualizations used in all of the dashboards that are generated using Plotly (in simple terms, all the visualizations that are not the process flow). `Chart`s must be given a `chartType` to choose pie or pillar charts, a `fields` to determine what data is being visualized, an `id` to use for recommendations, and a `source` telling it what view this chart is in. Optional values include `datasetIndex`, which gives the index of which uploaded dataset to use for the visualization (use -3 for a cumulative dataset, -2 for a cumulative visualization without the most recent dataset, and -1 for the most recent dataset), and `noButtons` to set if the chart should not generate recommendation and comparison buttons.

This component is used by the following components:
- `ChartContainer.js`

## GraphvizChart.js
This component takes a dot (which is the raw instructions that Graphviz uses to set up the visualization) and generates a Graphviz chart for the process flow.

This component is used by the following components:
- `ChartContainer.js`

## ExportData.js
This component is the button that is displayed in the patient and staff data views that allows the user to save their currently loaded datasets to a `.txt` file. Upon pressing the button, the `exportData()` function will be used to generate the text file, create a download link, and use the link to bring up the saving prompt.

This component is used by the following components:
- `ChartContainer.js`

## AdditionalDataInput.js
This component is the button to add another dataset on a view if a dataset has already been successfully added. This hides the current visualizations and creates a `DatasetAdder` with the `addDataInput()` function.

This component is used by the following components:
- `ChartContainer.js`

## ComparisonChart.js
This component refers to the visualizations used in the Staff Comparison view. There are three different types of `ComparisonChart`s, which can be chosen by the `fields` value. `ComparisonChart`s with a `fields` value of "taskfocus" require a `focus` value of the task to focus on. `ComparisonChart`s with a `fields` value of "dayfocus" require a `focus` value of the day. `ComparisonChart`s with a `fields` value of "persontask" require a `focus` value of the staff member to focus on and a `subfocus` value of the task to focus on.

This component is used by the following components:
- `ChartContainer.js`

## DatasetAdder.js
This component is created when the user specifies that they have another dataset to load on a view. The `DatasetAdder` displays an input form which calls the `LoadNewDataset()` function to parse the new data when a `.xlsx` file is uploaded and add that to the existing dataset. Once the new data is added, it then calls `ShowCharts()` to create a new `ChartContainer` with updated visualizations.

This component is used by the following components:
- `AdditionalDataInput.js`