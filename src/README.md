# Code Summary

The following React components are used to build this application:

## ExportData.js
This component is the button that is displayed in the patient and staff data views that allows the user to save their currently loaded datasets to a `.txt` file. Upon pressing the button, the `exportData()` function will be used to generate the text file, create a download link, and use the link to bring up the saving prompt.

This component is used by the following components:
- `ChartContainer.js`