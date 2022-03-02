# Michael Merritt
# Spring 2022

# Functions for generating charts written by Josh Mayanja, Spring 2021

from flask import Flask, request
import pandas as pd
import statistics
import plotly.express as px
import numpy as np
import chart_studio.plotly as py
import plotly.graph_objects as go

app = Flask(__name__)

@app.route("/")
def hello():
    return "Hello World!"

# dataset1 should be patient_data.xlsx and dataset2 should be staff_data.xlsx
@app.route('/data/', methods=['POST'])
def gen_all(dataset1, dataset2):
    gen_pie_charts(dataset1)
    gen_pillar_charts(dataset1)
    gen_phase2_pie_charts(dataset2)
    gen_phase2_pillar_charts(dataset2)

if __name__ == "__main__":
    app.run()

# in the previous file, dataset was 'mock_data.xlsx'
def gen_pillar_charts(dataset):
    # Read In Data
    ##data_prompt = input('Please enter the name of the data file to be used : ')
    ##data = pd.read_excel(data_prompt)
    data = pd.read_excel(dataset)

    # Create all lists needed
    rooms = list(data.columns[1:])
    means = []
    std = []
    ranges = []
    action4_means = []
    means_percent = []
    extra = []

    # Create html files for each graph
    pillar_file = open('pillar_chart.html', 'w')
    action1_file = open('stacked_means_mins.html', 'w')
    action2_file = open('stacked_means_percent.html', 'w')
    action3_file = open('highest_room.html', 'w')
    action4_file = open('stacked_optimal_time.html', 'w')

    # Loop to fill mean and standard deviation lists
    index2 = 0
    while index2 < len(rooms):
        means.append(round(statistics.mean(data[str(rooms[index2])]), 2))
        std.append(round(statistics.stdev(data[str(rooms[index2])]), 2))
        ranges.append(round(max(data[str(rooms[index2])]) - min(data[str(rooms[index2])]), 2))

        index2 = index2 + 1

    # Creates pillar chart layout
    pillar_layout = go.Layout(
        title='Patient Times by Room',
        yaxis=dict(title='Time (mins)'),
        xaxis=dict(title='Room')
    )

    # Creates pillar chart
    pillar_chart = go.Figure(layout=pillar_layout)
    pillar_chart.add_trace(trace=go.Bar(name='Mean', x=rooms, y=means))
    pillar_chart.add_trace(trace=go.Bar(name='Standard Dev.', x=rooms, y=std))
    pillar_chart.add_trace(trace=go.Bar(name='Range', x=rooms, y=ranges))

    # Caption for pillar chart
    pillar_chart_text = 'Now, we will look at the average, standard deviation, range, maximum and minimum for each location. \nWe will also look closer at the location with the highest percentage from above.'

    # Logic for actionable dataframe/3rd actionable graph
    max_mean = 0
    for mean in means:

        mean_denom = sum(means)
        mean_percent = round(mean / mean_denom, 4)
        means_percent.append(mean_percent)
        action4_means.append(mean)
        extra.append(' ')

        if max_mean < mean:
            max_mean = means.index(mean)

    max_mean = max_mean - 1
    mm_min = round(min(data[(rooms[max_mean])]), 2)
    action4_means[max_mean] = mm_min

    # Captions for actionable graphs 1 and 2
    action1_text = 'Below you see a pillar chart. This first pillar chart will show the average overall time. \nThe bar will be broken to show how much time is spend in each location within the entire average time.'
    action2_text = 'Now after seeing that, we will look at the average total time as a percent. \nThe location with the largest percentage will be our first focus point. '

    # Creates dictionary with data for actionable items
    d = {'Room': rooms, 'Mean (mins)': means, 'Mean (%)': means_percent, 'Standard Dev.': std, 'Range': ranges,
         ' ': extra}
    adf = pd.DataFrame(data=d)

    # Creates first actionable graph
    action1 = px.bar(adf, x=' ', y='Mean (mins)', color='Room', hover_data=['Room', 'Mean (mins)'],
                     labels={'Mean': 'Time (mins)'}, title='Mean Times by Room (mins)', width=300)

    # Creates second actionable graph
    action2 = px.bar(adf, x=' ', y='Mean (%)', color='Room', hover_data=['Room', 'Mean (%)'],
                     labels={'Mean': 'Time (%)'}, title='Mean Times by Room (%)', width=300)
    action2.layout.yaxis.tickformat = 'p'

    # Creates layout for third actionable graph
    action3_layout = go.Layout(
        title='Patient Times for {}'.format(adf['Room'][max_mean]),
        yaxis=dict(title='Time (mins)'),
        xaxis=dict(title='Room')
    )

    # Creates data frame with data for third actionable graph
    d2 = {'Room': [adf['Room'][max_mean]], 'Mean': [adf['Mean (mins)'][max_mean]],
          'Standard Dev.': [adf['Standard Dev.'][max_mean]],
          'Range': [adf['Range'][max_mean]]}
    action3_df = pd.DataFrame(data=d2)

    # Creates third actionable graph
    action3 = go.Figure(layout=action3_layout)
    action3.add_trace(trace=go.Bar(name='Mean', x=action3_df['Room'], y=action3_df['Mean']))
    action3.add_trace(trace=go.Bar(name='Standard Dev.', x=action3_df['Room'], y=action3_df['Standard Dev.']))
    action3.add_trace(trace=go.Bar(name='Range', x=action3_df['Room'], y=action3_df['Range']))

    d3 = {'Room': rooms, 'Mean (mins)': action4_means, ' ': extra}
    bdf = pd.DataFrame(data=d3)

    # Creates fourth actionable graph
    action4 = px.bar(bdf, x=' ', y='Mean (mins)', color='Room', hover_data=['Room', 'Mean (mins)'],
                     labels={'Mean': 'Time (mins)'}, title='Updated Mean Times by Room', width=300)

    # Captions for fourth actionable items
    action4a_text = 'For this data, the minimum time is {} minutes and the maximum time is {} minutes. Standardization will allow us \nto standardize the minimum. Each provider can now use this new standard. Theoretically making the average time equal \nto the minimum, in return making the overall lead time to decrease.'.format(
        adf['Mean (mins)'][max_mean], bdf['Mean (mins)'][max_mean])
    action4b_text = 'The figure above shows the current mean times with the optimal {} time. This theoretical number can be achieved \nby performing kaizen events.'.format(
        rooms[max_mean])

    # Writes graphs into their files
    pillar_file.write(pillar_chart_text)
    pillar_chart.write_html('pillar_chart.html')
    action1_file.write(action1_text)
    action1.write_html('stacked_means_mins.html')
    action2_file.write(action2_text)
    action2.write_html('stacked_means_percent.html')
    action3.write_html('highest_room.html')
    action4_file.write(action4a_text)
    action4.write_html('stacked_optimal_time.html')
    action4_file.write(action4b_text)

    # Prints first actionable item
    print(action1_text)
    action1.show()

    # Prints second actionable item
    print(action2_text)
    action2.show()

    # Prints pillar chart/third actionable item
    print(pillar_chart_text)
    pillar_chart.show()
    action3.show()

    # Prints fourth actionable item
    print(action4a_text)
    action4.show()
    print(action4b_text)


# in the previous file, dataset was 'mock_data.xlsx'
def gen_pie_charts(dataset):
    # Read In Data
    ##data_prompt = input('Please enter the name of the data file to be used : ')
    ##data = pd.read_excel(data_prompt)
    data = pd.read_excel(dataset)

    # Create all lists needed
    rooms = list(data.columns[1:])
    means = []
    waits = []
    mean_waits = []
    waits_percent = []
    cares = []

    pie_file = open('pie_chart.html', 'w')
    action_pie_file = open('pie_chart_actionable.html', 'w')

    # Iterate through to fill wait list and care list
    for room in rooms:

        if 'Wait' in room:
            waits.append(room)

        else:
            cares.append(room)

    # Logic to compute total wait times and care times
    wait_sum = 0
    care_sum = 0

    # Fills wait times list
    for wait in waits:
        x = round(statistics.mean(data[str(wait)]), 2)
        mean_waits.append(x)
        wait_sum = wait_sum + x

    # Fills wait times as percent list
    for x in mean_waits:
        waits_percent.append(round((x / wait_sum) * 100, 2))

    # Fills care time list
    for care in cares:
        y = round(statistics.mean(data[str(care)]), 2)
        care_sum = care_sum + y

    # Creates Pie Chart
    pie_chart = go.Figure(data=[go.Pie(
        labels=['Wait Time', 'Care Time'],
        values=[wait_sum, care_sum],
        text=['Mean Wait Time', 'Mean Care Time'],
        hovertemplate="%{label}: <br>Mean Total Time (mins): %{value}",
    )])

    pie_chart.update_traces(marker=dict(colors=['red', 'blue']))

    # Actionable idea : change wait time color (red, yellow, green), based on percent of total time

    # Creates data frame for actionable item
    d4 = {'Room': waits, 'Mean Time (mins)': mean_waits, 'Mean (%)': waits_percent}
    pie_df = pd.DataFrame(data=d4)

    # Creats actionable item
    action_pie = px.pie(pie_df, values='Mean Time (mins)', names='Room', title='Total Wait Time by Room',
                        hover_data=['Mean Time (mins)'], color_discrete_sequence=px.colors.qualitative.D3)
    action_pie.update_traces(textinfo='percent + label')

    pie_chart.write_html('pie_chart.html')
    action_pie.write_html('pie_chart_actionable.html')

    # Prints Pie Chart
    pie_chart.show()

    # Prints actionable item
    action_pie.show()


# in the previous file, dataset was 'data_2.xlsx'
def gen_phase2_pillar_charts(dataset):
    data2 = pd.read_excel(dataset)

    # Create Rooms Visited List
    activities = data2.columns[1:]

    # Create list of room means, standard deviations, ranges
    staff_means = []
    staff_action4_means = []
    staff_std = []
    staff_ranges = []
    staff_means_percent = []
    extra = []

    # Create html files for each graph
    staff_pillar_file = open('staff_pillar_chart.html', 'w')
    staff_action1_file = open('staff_stacked_means_mins.html', 'w')
    staff_action2_file = open('staff_stacked_means_percent.html', 'w')
    staff_action3_file = open('staff_highest_room.html', 'w')
    staff_action4_file = open('staff_stacked_optimal_time.html', 'w')

    # Loop to fill mean and standard deviation lists
    index = 0
    while index < len(activities):
        staff_means.append(round(statistics.mean(data2[str(activities[index])]), 2))
        staff_std.append(round(statistics.stdev(data2[str(activities[index])]), 2))
        staff_ranges.append(round(max(data2[str(activities[index])]) - min(data2[str(activities[index])]), 2))

        index = index + 1

    # Creates pillar chart layout
    staff_pillar_layout = go.Layout(
        title='Staff Times per Activity',
        yaxis=dict(title='Time (mins)'),
        xaxis=dict(title='Activity')
    )

    # Creates pillar chart
    staff_pillar_chart = go.Figure(layout=staff_pillar_layout)
    staff_pillar_chart.add_trace(trace=go.Bar(name='Mean', x=activities, y=staff_means))
    staff_pillar_chart.add_trace(trace=go.Bar(name='Standard Dev.', x=activities, y=staff_std))
    staff_pillar_chart.add_trace(trace=go.Bar(name='Range', x=activities, y=staff_ranges))

    # Logic for actionable dataframe/3rd actionable graph
    smax_mean = 0
    for smean in staff_means:

        smean_denom = sum(staff_means)
        smean_percent = round(smean / smean_denom, 4)
        staff_means_percent.append(smean_percent)
        staff_action4_means.append(smean)
        extra.append(' ')

        if smax_mean < smean:
            smax_mean = staff_means.index(smean)

    smax_mean = smax_mean - 1
    smm_min = round(min(data2[(activities[smax_mean])]), 2)
    staff_action4_means[smax_mean] = smm_min

    # Creates dictionary with data for actionable items
    sd = {'Activity': activities, 'Mean (mins)': staff_means, 'Mean (%)': staff_means_percent,
          'Standard Dev.': staff_std,
          'Range': staff_ranges, ' ': extra}
    sdf = pd.DataFrame(data=sd)

    # Creates first actionable graph
    staff_action1 = px.bar(sdf, x=' ', y='Mean (mins)', color='Activity', hover_data=['Activity', 'Mean (mins)'],
                           labels={'Mean': 'Time (mins)'}, title='Mean Times by Activity (mins)', width=300)

    # Creates second actionable graph
    staff_action2 = px.bar(sdf, x=' ', y='Mean (%)', color='Activity', hover_data=['Activity', 'Mean (%)'],
                           labels={'Mean': 'Time (%)'}, title='Mean Times by Activity (%)', width=300)
    staff_action2.layout.yaxis.tickformat = 'p'

    # Creates layout for third actionable graph
    staff_action3_layout = go.Layout(
        title='Staff Times for {}'.format(sdf['Activity'][smax_mean]),
        yaxis=dict(title='Time (mins)'),
        xaxis=dict(title='Activity')
    )

    # Creates data frame with data for third actionable graph
    sd2 = {'Activity': [sdf['Activity'][smax_mean]], 'Mean': [sdf['Mean (mins)'][smax_mean]],
           'Standard Dev.': [sdf['Standard Dev.'][smax_mean]], 'Range': [sdf['Range'][smax_mean]]}
    staff_action3_df = pd.DataFrame(data=sd2)

    # Creates third actionable graph
    staff_action3 = go.Figure(layout=staff_action3_layout)
    staff_action3.add_trace(trace=go.Bar(name='Mean', x=staff_action3_df['Activity'], y=staff_action3_df['Mean']))
    staff_action3.add_trace(
        trace=go.Bar(name='Standard Dev.', x=staff_action3_df['Activity'], y=staff_action3_df['Standard Dev.']))
    staff_action3.add_trace(trace=go.Bar(name='Range', x=staff_action3_df['Activity'], y=staff_action3_df['Range']))

    sd3 = {'Activity': activities, 'Mean (mins)': staff_action4_means, ' ': extra}
    sbdf = pd.DataFrame(data=sd3)

    # Creates fourth actionable graph
    staff_action4 = px.bar(sbdf, x=' ', y='Mean (mins)', color='Activity', hover_data=['Activity', 'Mean (mins)'],
                           labels={'Mean': 'Time (mins)'}, title='Updated Mean Times by Activity', width=300)

    # Writes graphs into their files
    staff_pillar_chart.write_html('staff_pillar_chart.html')
    staff_action1.write_html('staff_stacked_means_mins.html')
    staff_action2.write_html('staff_stacked_means_percent.html')
    staff_action3.write_html('staff_highest_room.html')
    staff_action4.write_html('staff_stacked_optimal_time.html')

    # Prints first actionable item
    staff_action1.show()

    # Prints second actionable item
    staff_action2.show()

    # Prints pillar chart/third actionable item
    staff_pillar_chart.show()
    staff_action3.show()

    # Prints fourth actionable item
    staff_action4.show()

# in the previous file, dataset was 'data_2.xlsx'
def gen_phase2_pie_charts(dataset):
    # Create Rooms Visited List
    data2 = pd.read_excel(dataset)
    activities = data2.columns[1:]

    # Create lists for wait times and care times
    waits2 = []
    mean_waits2 = []
    waits_percent2 = []
    cares2 = []

    staff_pie_file = open('staff_pie_chart.html', 'w')
    staff_action_pie_file = open('staff_pie_chart_actionable.html', 'w')

    # Iterate through to fill wait list and care list
    for activity in activities:

        if 'Wait' in activity:
            waits2.append(activity)

        else:
            cares2.append(activity)

    # Logic to compute total wait times and care times
    wait_sum2 = 0
    care_sum2 = 0

    # Fills wait times list
    for wait in waits2:
        x = round(statistics.mean(data2[str(wait)]), 2)
        mean_waits2.append(x)
        wait_sum2 = wait_sum2 + x

    # Fills wait times as percent list
    for x in mean_waits2:
        waits_percent2.append(round((x / wait_sum2) * 100, 2))

    # Fills care time list
    for care in cares2:
        y = round(statistics.mean(data2[str(care)]), 2)
        care_sum2 = care_sum2 + y

    # Creates Pie Chart
    staff_pie_chart = go.Figure(data=[go.Pie(
        labels=['Wait Time', 'Patient Time'],
        values=[wait_sum2, care_sum2],
        text=['Mean Wait Time', 'Mean Patient Time'],
        hovertemplate="%{label}: <br>Mean Total Time (mins): %{value}",
    )])

    staff_pie_chart.update_traces(marker=dict(colors=['red', 'blue']))

    # Creates data frame for actionable item
    sd4 = {'Activity': waits2, 'Mean Time (mins)': mean_waits2, 'Mean (%)': waits_percent2}
    spie_df = pd.DataFrame(data=sd4)

    # Creats actionable item
    staff_action_pie = px.pie(spie_df, values='Mean Time (mins)', names='Activity',
                              title='Total Wait Time per Location',
                              hover_data=['Mean Time (mins)'], color_discrete_sequence=px.colors.qualitative.D3)
    staff_action_pie.update_traces(textinfo='percent + label')

    staff_pie_chart.write_html('staff_pie_chart.html')
    staff_action_pie.write_html('staff_pie_chart_actionable.html')

    # Prints Pie Chart
    staff_pie_chart.show()

    # Prints actionable item
    staff_action_pie.show()




