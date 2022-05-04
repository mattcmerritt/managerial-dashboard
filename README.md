# Managerial-Dashboard

This project is a React web application that is intended to visualize data collected from hospitals to identify areas for improvement in the patient and staff experiences. The application takes in data from a spreadsheet that indicates how much time a given patient or nurse spends at each step in the process, and generates a process flow diagram as well as a couple of other visualizations with recommendations. Users are able to load different datasets for separate intervals of time, and they are able to view the changes that have occured and receive recommendations on how to improve the patient and staff experiences.

## Functionality
Upon opening the application, the user will see a couple of controls at the top of the screen for changing between the patient and staff data views, as well as buttons to write, load, and save expert recommendations. The user should also be prompted to either load in a new dataset by selecting "First time" or add onto an existing dataset using "Returning user".

Upon selecting first time, the user will be asked to load in their dataset from a spreadsheet and they will need to fill in a couple of details for their dataset. 

First, once they have selected their spreadsheet file, the application should load in each of the columns as a potential step in the patient/staff process. The user will need to select only the steps that are actual steps in the patient/staff process at the hospital, making sure to remove identifiers like IDs.

Second, the user will need to classify each step in the process. They can select between wait, care, travel, and other to indicate how these steps should be grouped. For the patients, the focus is primarily on wait and care, whereas the staff dashboard focus on care and travel.

Third, the user will need to indicate any branches that occur in the process. Automatically, the application will assume that each step leads into the one step that appeared in the column after it. If there are exceptions, you need to add a connection to the to the step and select where the patient/staff member can go to.

Once that has been completed, the application should generate a couple of charts and a process flow diagram, as well as some simple recommendations for each chart. At the top of the dataview, the user will see two options. The first option allowing them to export their data and data settings to a file so that they can add additional data onto it later. The second option allows the user to add a second spreadsheet with additional data for a separate time interval (for example, if data is collected weekly, a second spreadsheet could be loaded). 

If the user choses to load a second dataset, they only have to select the new spreadsheet, and visualizations will be generated for that spreadsheet. If the user would like to see changes over time, they can select compare under a chart to bring up a window that will display the initial data versus the most recent data.

Going back to the initial data loading options, if the user selects returning user, they will be prompted to input the file that was created when they exported their previous data, as well as a new set of data to add onto the previous dataset.

Finally, there is functionality for a separate expert to write custom, detailed recommendations for specific charts on the dashboard. Selecting "Write Expert Recommendations" from the top right will add textboxes below each chart where the associated recommendations can be written. Then, selecting "Save Expert Recommendations" will create a text file which can be sent to a user to load into their dashboard using the button in the top-center of the page.

## Data format
For the staff and patient data views, data must use the following format:
- Spreadsheet format is `.xlsx`
- All data is contained in the main sheet
- The first row contains the name for each field
- Each row below the first represents an individual patient/staff member
- Each step has its own column
- No empty columns are present in the middle of the dataset

For the expert recommendations and exported datasets, these files are generated by the site with the following format:
- File extension is `.txt`
- File contents are a single line
- File contents are formatted in JSON

Example datasets are contained in this repository under the `files` directory. They are named after which view they should be loaded into. Additionally, there is an example of an exported dataset in `patientDataset.txt` file, and there is an example of an expert recommendation file in `Expert_Recommendations.txt`.
