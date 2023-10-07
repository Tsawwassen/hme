# HME
Create tools to be used at HME 

# Tools
Tools area create on a need by case (Bottom up design), and might evenetually evolve into a full Warehouse Management System (WMS).

# Functions
## Inventory Helper
Improve the process for counting inventory
* Input
  - Expected values (Windward or Windward API).
  - Actual values (External file or created inside the app).
* Output
  - File/Report comparing the two files. Report will show items that were missed, over counted, and under counted.

###  Versions 
* V1 - The two input files will be a CSV file.
* V2 - The expected file will be uploaded, and the physical count will be created inside the app.
* V3 - The expected file will be pulled from Windward (API), and the physical count will be created inside the app.

## Stale Order Helper
Improve the process for checking stale orders
* Input
  - List of current orders on the shelf
  - List of orders from last stale order check
* Output
  - Report organized by sale rep showing orders that are currently on the shelf, highlighting orders that were on the previous weeks report

# Journal
## 09/03/2023
- After casually working on the app on weekends for a couple weeks, I have data from two differnet files being read, and the information from those files moving up to the 'parent' Inventory Component, allowing the data to be passed to a different component.
- All this time I have been organizing the code for that the expected file it always first, and then the actual file is second.
- Today after writing code to pass a setter function down the Upload Component and making sure I put it in the correct order, I realized I should have organized it in alphabetical order... (ie 'A'ctual first and 'E'xpected second)
## 09/04/2023
- V1 plan of action is done
- Two files are getting parsed, file data is getting merged, and merged data is rendered on a table
## 09/16/2023
- V2 plan of action is done
- Scanned data is captured, and formated, given file is formated (done in V1), and a report is generated comparing the scanned data and the uploaded file.
- Supper happy how well I was organizing my components and function to be re-used. Once I formatted the scanned data, I easily sent it to my Report component and it worked as expected.
- I think this was the first time that planning ahead really payed off.
- The FileReaderHelper class could use a new name as it is also handeling formatting the scanned data to be passed to the report component, but it is organized and the process flows down to it and back up very clean.
## 09/23/2023
- Weekly thoughts / plan for today
- - The FileReaderHelper class should be called 'ReportMapper'  - DONE
- - - At first it only handled parsing / formatting the given files, but when V2 was finished, it also formatted the scanned input for it to be used in the report. Changing it's name to this would make the function of the helper class more clear. - DONE
- - When the tab is changed (v1, v2, or v3) set the view back to upload, clear the expected and actual arrays. Currently when you change tabs after a report is on screen, the report is still visible. - DONE
- - Get backend database. fetch data, map scanned input, show report - DONE
- Post notes
- - To make changes when the Tab is changed, make a function call to the onSelect Tabs props function - DONE
- - rename FileReaderHelper to ReportMapper helper. - DONE
## 09/24/2023
- All versions of the inventory app are done.
## 09/29/2023
- Cleaned up the file reading functions to work asyncronously.
- Cleaned up testing code (test buttons), old console logs, and old function calls (ie function calls that were copied into v3 from v2, but never used in v3)



# Long Term goals
- Update for the inventory data is formatted to be something like [... {part_number: , count:{ expected: , actual: , difference: }}...]
- - The way it is currently getting created does not have the part_number key, which means I need to hard code the report table headers. 
- - Better design is to have the keys used as headers
- Learn more about the serverless MonogoDB
- - Did not expect MongoDB to be running in the cloud, but I got it working for what I need it to do.
- Learn more about Async problems
- - Had troubles with accessing data that was outside fetch blocks, or data inside the fetch block getting used outside
- - Did get it working with trial and error, but not totally sure how it's working
