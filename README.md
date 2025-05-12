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

# Journal - Inventory Helper
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


# Journal - Stale Order Helper
## 10/7/2023 to 10/21/2023
- Didnt notice that journal notes have not been updated since the stale order function was implemented (hence the long date above).
- copied the same code for reading csv file that the inventory helper uses, might clean this up later.
- GET call was working fine. able to copy the same routing as the inventory API calls
- POST AND PUT had many issues
- - the consistant error I would get is a CORS req/res error
- - Searched the error on Google and got a lot of different things to try. the resolution was to add a CORS package and set options
- - The current CORS settings are probably not ideal/ secure, need to learn more about CORS / Node+Express / React / MongoDB Atlas security
- When making git commits on large amounts of changes, do the following steps to make commit message to specific changes and not the file as a whole. The old way would add a message to the whole file and not updated block by updated block. Since getting the CORS working took much more work then I expected, I felt adding commit messages to each block of code thats updated would be a better way or organizing my git. When doing small and frequent commits, the old way would be effective. 
- - Have code and terminal side by side
- - split the terminal panel to have two terminals. top one should be big enough to see large chunks of git diff, bottom one just one or two lines for typing 'git commit -m' commands
- - type 'git diff' on a file, and ctrl+click the @@ lines to jump to that change in the code
- - on the selected code window (?) click the + in the top right to stage that code for commit
- - type 'git commit -m' command in the lower window to add a message to that update
- - If you want to commit multiple updates on one message, stage multiple updates then input the message
- - To get to another section of code to stage, either do another diff and click the @@ or click the coloured block (located right of line number. colours means GREEN is new line, BLUE is updated line, RED is deleted line)

# Journal - Executable
## 10/28/2023
- Starting to try the local executable. Using Tyler Pott video as a guide ( https://www.youtube.com/watch?v=TkAiVKfWtjI )
- - New node package that will be used - Electron, https://github.com/electron/electron-packager
1. npm install --save-dev electron-packager
- First Note : I think I need to add a file that opens a window (using the electron package) and then create the exe from that new file
- - I hope that I can more or less point to the react client (might be client/public/index.html, client/src/index.js, client/src/App.js, or something different ).
## 11/04/2023
- Ended up using Electron-Forge (https://www.electronforge.io/)
- The React App needs to be running for the Electron window to load the app
- Was able to make an executable, but feels janky
- The executable portion is 'functioning' (I use that word lightly) in the exeTest branch
## Final note
- Yes it is possible to make an executable file that will run the React app, but...
- - You still need to have the React App running on the web
- - Its janky to set up. The best steps I found was using the electron-forge package
- - Would need to play with it more to really understand what it is doing
- - one of the electron-forge scripts changed my npm scripts so that it would only run the app in electron (ie won't open the app in the browser). Might have this wrong
- - Would need to clean up the npm scripts to make electron scripts and react scrips both be functional

# Journal - Labels
## 11/04/2023
- Starting label printer function
- Labels will be 3"x2" and will have demo number, barcode of the demo number, serial number, make(?), model(?), size(?)
## 11/05/2023
- Imported the shelf label component into the HME project
- Had to do minor changes on how the component is mounted, but it wasn't too bad
- Also added the @page->margin to SCSS file so that the user does not need to change the margin when printing
## 11/11/2023
- Cleaned up the Shelf Label component by moving the file parsing code into a FileReader helper function
- Updated label options to specify batch or single
- Start inventory label
- - 3"x2" label
- - Include Serial number, Asset number (demo/rental), Make, Model
- - Asset number will be a barcode
- - Use the @media / @print CSS for print render (ie: page break after, forcing margin)
- - Create single label with input from form
- - Create batch labels with input from CSV
- Single label function is done
- MOVED : Label layout needs work
- DONE : Make a clear button - DONE
- DONE : batch upload - DONE
- DONE : Check that the one label per page when printing is working - DONE
## 11/12/2023
- Do TODOs from yesterday
- Make single label form have bootstrap styles
- Batch upload is working
- One label prints per page
- Cleaned up the single label input form

# Journal - Inventory Helper
## 12/02/2023
- NOTE Going back to inventory helper
- DONE Receive an export from WW. Doesn't really do what i want it to do, but going to work on getting it to work with the current functions
- - ie, take the WW model, and map it to the model that i need to work with for showing inventory report
- - DONE Note - WW export is not what needs to be used for inventory
- DONE Changed file parsing to use PapaParser package
- - Makes handling files with commas, quotes, and empty lines much easier.
- - Tested label functions, since they use the same file parsing code, and they work as expected

# Journal - QoL Updates
- MOVED - Most of the app functions are done, would like to do some cleaning up
- - DONE - Clear all NPM updates if possible
- - * Looking into the NPM audit errors, seems like most of them can be ignored (https://overreacted.io/npm-audit-broken-by-design/)
- - MOVED Add button to download template files for labels
- - DONE - Remove spaces on barcode field. The barcode was not getting displayed when testing at work, but it seems to convert the spaces to a barcode here. Not sure why, but i added code to remove spaces
- - DONE - Have ReportMapperHelper use FileReaderHelper
- - * Might need to more the FileReader code into FileReaderHelper, but the ReportMapperHelper and ShelfLabel code use the FileReader variable different.
- - MOVED Have upload files accept excel files ?
- - DONE - Add Jumbotron (?) to views so that they don't go to the edge of the window
- - * Jombotron version of React-Bootstrap is a 'Container' component
## 12/03/2023
- Below QoL changes were moved to 01/13/2023
- Updating QoL list of items that still need to be done
- - Have upload files accept excel files
- - Have button to download template files
- - Error handeling
- - Inventory Label (get input from others, see what data can be exported from WW and uploaded directly into the app)
- - Clean up code (comments, spacing, console logs(?))

## Label Printer - 12/14/2023
- Got the label printer.
- First prints looked fine, but need to work on filling the label
- When printing, the app will print one extra label at the end (for single and batch label)
- - Need to figure out why its doing that
- Labels are printing fine
- - Needed to adjust the CSS height and add some margin to get the label set correctly
- - Needed minor printer config changes. See 'Label Printer Preferences' to know what settings were needed. NOTE : need to test if the settings are true at work.
- Next step: Get input on what information we want on the label

## Azure Deployment - 01/06/2024
- Plan is to try using Azure to reploy the app
- Needed to use 'Static Web App' when creating a resource
- Linked my Git repo to the Azure resource
- Needed to tell it to use the 'client' folder since the repo has client and server
- The Azure app would update when i pushed to my git repo
- Was able to get the app working, but it did not like the React Router (ie if i went to the '/labels' url, it would receive error 404)
- Needed to add a staticwebapp.config.json file inside the public folder, and it worked as expected. Source below
- - https://medium.com/@elnoor/react-client-side-routing-in-azure-static-web-app-299c8ba96fb8

## Weekend Plan - 01/13/2024
- Updating QoL list of items that still need to be done
- - MOVED - Have upload files accept excel (low)
- - MOVED -Have button to download template files(high)
- - MOVED -Error handeling (high)
- - MOVED -Clean up code (comments, spacing, console logs(?))
- Inventory Label Information
- - Tentatively done. info is getting displayed
- - Need final desicion
- - Should also get the tool working with a WW export
- Now that I have a good WW export, get the inventory tool working with the export
- - DONE - When i tried my test file, the results were getting undefined
- - - Just tested with the WW export, and the file parsed as expected? need to try on production
- - DONE - Need to fix the export file since the report table is updated
- Remove 'Not Yet Implemented' tools
- - DONE - Stale Order
- - DONE - V3 of inventory helper (i will keep v1 cause it's just two upload files)
- DONE - Make a production branch and have azure watch that branch for updates
- - Figure I should split my working branch and what is getting hosted/used 
- - DONE Note - Used a branch called 'development' so that I don't need to change the Azure configuration. 
- - Once the app is ready to push to production, merge to main (using steps below) and push. Keep development branch active as a working branch

## Port weekend notes - 01/14/2024
- App is working with WW export
- Export of report is working
- - The report mapper does not work correctly if a cell has double quotes
- - ToDo notes at the function.
- Going to merge with main and push to Azure. Notes to follow after committing gits
- - Merge worked perfectly!!

## 01/28/2024
- DONE - Have an updated WW export, need to get inventory function working with it
- DONE - Need to clean up my test data folder
- DONE - inventory export report function isn't working for cells with special characters. Need to use Papa.unparse (I think)
- DONE - Need to handle rows that have a serial number but don't have a unit number.
- - WORKED - Plan is to loop the array and if the row does not have a unit number but does have a serial number, then copy the serial number to the unit number column
- - Doing a quick look of the expected array, checking if unit number is empty, and if it is move the serial number over worked perfectly
- - Only issue is the WW data (note below)
- Create a download template function for shelf labels
- - Need to check if the upload function uses Papa.parse so that it handles special characters
- WW Export Issues
- - The 'OddExportResults' file contains all the 'odd' report results. 
- - There is some line items where it has a demo number in the SN field, but nothing in the UnitNo field, so when I do the empty Unit check it moves it over and then groups it with the other record (ie make the expected qty > 1)
- - There is a '.R-SEA-MISC' record. Not sure what that one is
- - The K2 items have the same Unit Number, but unique serial numbers. The app is grouping them together on the UnitNomber since they are the same, so the duplicate serial numbers get lost

## 02/03/2024
- DONE - Upload file Error Handeling (inventory, shelf labels, inventory labels) (Former QoL Todo)
- - Show message when upload file is not selected
- - Show message when upload file is not a CSV 
- Template File (Former QoL Todo)
- - Shelf Labels
- - Inventory Labels
### Post Notes
- MOVED TO QoL - Should move the error component to a helper component class
- - Code is mostly the same when used, but bulky and not nice to look at
- - Also, would like the alery to appear at the top of the screen above all components. Currently it apears in line and pushes other components down
- MOVED TO QoL - Template files

## 02/19/2024
- DONE - Need to get V1 of inventory helper working with current WW export and report output
- - Decided to get this working for the event of power going out on the computer since the app won't remember what was previously scanned
- - - Possible solution is to use cookies?
- PENDING - Test printing a label with the logo on it
- - Created png and jpg of the same image to use for testing
- - Just testing to see if it is possible and how it looks on the label
- - Created testLabel flag when mounting the InventoryLabel component that will return a basic label area for testing
- - Created two labels. one with PNG and the other with JPG to see if one or the other works better on the label
- - Pushed to azure, will test at work to see what file works best. Go with smaller file size if image quality is the same. Also might want to scale the picture vs scaling during render
- DONE - Template files

## 03/09/2024
- DONE - Labels CAN be printed with picture
- - Keeping the layout of current label as is. 
- - Going to get a final decision with other stake holders at a future date.
- DONE - Shelf picutre layout needs to have a button hidden
- - Also check if forcing the layout to be landscape and margins can be set in CSS code
- - - Adding the 'size: landscape;' tag does force the page to be landscape, but the content of the page get centered and do not fill the page. Not sure why, need to look into it more
- DONE - Update NPM to stop the azure errors?
- - Updated NPM (10.4 to 10.5)
- - If I want to upgrade node, it seems like i need to uninstall the old version, then install a 3rd party (trusted) app to upgrade it.
- Learn about test scripts?
- - Need to learn something new, and I think the automatic testing would be a good spot to start.

## 03/17/2024
- Received a new WW export file
- - Some of the columns have changed. The parsing function was already keeping all columns it finds, so I just needed to change the ReportTable component to display those new columns
- - I just commented out what is not exports anymore and added the new column to be rendered
- - Only issue i can see down the road is the scanned file parsing function only has the old columns. Don't think it could be an issue for the current app, but it might be an issue down the road.
- Also received a Parts Count WW export that has serialized and non-serialized, but it doesn't show the serial numbers of the serialized items.
- - Looking at the two files, I think I can combine the two so make a data model that has an array of inventory items, and a flag if it is serialized or not, and save the serial number if it is serialized.
- - Wrote a note in the testData folder for a future version (1.5? 3?) that would use this logic

## 03/20/2024 - EMERGENCY CODEING
- The files I was given for the serialized items did not have acurate data
- Financing also wanted the category on the export file for their task
- I was trying to solve the problem by adding the Unit file data (serialized) to the PC file (only has quantities of serialized and non-serialized. but has the category)
- I realize now that I need to add the PC data to the Unit data to get the category, and then add whats left from PC
- The rest of the process I think will just flow as expected.
- - I will need to add the category number to the report.
- POST COMMENT
- - Was able to merge the two files and render that data sorted by category
- - Realized this morning that I need to sort by category THEN inventory Part AND THEN Serial Number. 
- - Got that working...
- - The export didn't have the columns in the correct order.
- - - Used the columns option with Papa.uparse to allow the file to have the columns in the expected order.

## 03/22/2024 - EMERGENCY CODEING
- The app doesnt parse the scanned file with unit file correctly.
- - Think I have a solution
- - My test data was too big and didn't notice. Really need to use automated testing...
- Created a 'small' test file that should cover the basics of what the file needs to handle
- Received upload files for count day. 
- - I have also created a test scanned file. The file should scan everything once. 
- - - The 'difference' column should always be expected - 1 

## 03/29/2024 - Post Count Updates
- The app isn't counting the scanned items corectly (I think)
- - My theory is that in the loop comparing the scanned actual values is skipping list items because the logic is removing the current item
- - - ie. the scanned loop is at index i. if scanned[i] is in the actual array, it updates the quantity of actual and then removed scanned[i] from scanned, but the loop index is still at i so on the next iteration i will increase, and skip the new value at scanned[i]
- Need to check that the physical and unit file have the correct quantity to confirm my logic of 'linking' the two files are correct
- - Expected quantity is 3583 (i think)
- - After checking the physical and unit file for a couple hours, I think the app is parsing and combining the two files as expected
- - - Issue is the data i'm working with
- - - There is some serialized items in the unit file that are not in the phyiscal file (causing numbers to be off)
- - - There is some items that were serialized at one point, but are not serialized anymore in the physical file
- - - The app is parsing the file as expected (ie the app will display the corect number of lines or quantities), but when combining they get a little off.
- - - Maybe only use items that I know are serialized? or just get an acurate unit file so I'm working with acurate data.
- Need to trim values in the scanFile before comparing the two arrays (i think)
- Once the above updates have happend, compare the count from the app with the count in the variance report to see how acurate it is

## 03/30/2024 - Post Count Updates Post coding (post post?)
- The app was reading all files corectly
- Part of the problem was how the expected and actual files were getting compared
- - My theory of the forEach loop skipping items beacue the array was getting split was correct, but I think since that function was getting called in the setState function, it was gettin ran more then once.
- - This was causing the loop to skip items, but enter the loop more then once and count and skip values again
- - SOLUTION
- - - Moved the function coparing expected and actual out of the setState function call, and pre-count actual before comparing with expected
- - - The code also looks cleaner :D

## 09/21/2024 - Post September Count + feedback
- September count went ok
- - Unit file had more data then expected. I think i know what needs to be removed. Going to do weekly unit checks with Brian to make sure I have that issue sorted
- - Once I have confirmed what rows need to be removed (ie unit is on a rental, sold) this can be automated.
- DONE - Serial numbers get converted to Exponential function
- - Plan is to add '`' to the start of serial numbers that are only numbers before exporting to excel
- - FOLLOW UP - Check with Brian
- Exported report
- - Some part numbers change order when put into the pivot table
- - Brian doesn't need the export to be in excel
- - Solution: play with the pivot table options to make it work (custom sort) OR scrap the excel idea
- - - Benefit of the excel version is you can easily see what items need to be counted a second time / looked for
- - - Would need to look for some form of PDF table 'printer friendly' package. The code sorts the part numbers as Brian wants it, but when I print the table its not paper friendly and SN leak into other columns 
- - - Going to make a different view of the data (maybe a button?) with a nested table for serialized items or see if the flat file works for Brian. The pivot table soting issue might be able to be solved with a custom sort, but the web app version of excel doesnt seem to do it, or it doesnt function the way i think it should function
- Need to ask
- - Currently I manually remove lines that don't have a category (ie not counted on this count) Should I remove those lines? would still need to keep the extra items that get scanned for reviewing 'extra items' tha are scanned

## 09/28/2024 - Get Order working
- DONE - Get the report order to be the same as the input file
- - Plan is to add an 'order number' when the physical count sheet is parsed, and then sort by that number, then the serial numbers
- - - Parse the physical count file
- - - Sort by category
- - - Add line #
- - - Before showing and exporting the report, sory by Line # -> SN (need to test)
- - Got the report to show in the correct order. 
- - - Need to check with Brian why the excel file was in decending category order and the pdf was in ascending order.
- DONE - Check that my logic for removing lines from the unit file is correct
- - Things to remove are : 
- - - Remove lines that are on rental (Rental Stage)
- - - - Only keep lines with "Available" and "Non-Rental Part"
- - - Remove sold items (Stock Status)
- - - - Only keep lines with "In Stock" and "Special Orders Reveived"
- - - Remove lines where the "Serial Number" and "Invetory Part" are the same
- - - - FSG440 is a non-serialized part, but was serialized at one point. looks like legacy data
- - - - This logic also removed the ".R-SEA-MISC"

## 09/29/2024
- Manually checked the report export and the actual count sheet. Order is good. noticed a couple units and parts that need to be updated.
- - Unit Issues
- - - D-00017. duplicate. both on count sheet. different part numbers. WW needs to be fixed
- - - D-02240. duplicate. only one on count sheet, but two in unit file (same p#, SN/UN issue). I think adding a '.' at the end of the unit number of the line that was sold will fix this issue.
- - - HME-03009. duplicate. only one on count sheet, but two in unit file (different p#, SN/UN issue). I think adding a '.' at the end of the SN of the sold one will fix this issue.
- - - D-02195. duplicate. only one on count sheet, but two in unit file (different p#, SN/UN issue). I think adding a '.' at the end of the SN of the sold one will fix this issue.
- - - D-02016. duplicate. only one on count sheet, but two in unit file (different p#, SN/UN issue). I think adding a '.' at the end of the SN of the sold one will fix this issue.
- - - D-02046. duplicate. only one on count sheet, but two in unit file (different p#, SN/UN issue). I think adding a '.' at the end of the SN of the sold one will fix this issue.
- - - Might be more. those ones stood out when i manuall checked.
- - Part Number issues
- - - Part numbers like "200.12800" get changed to "200.128". Can either update it in WW, or see when the trailing '00' get dropped and handle in the app
- - - - Looks like the upload file does have the trailing '00'. Papaparse removing it?
- - - 'R-WC-PED-T' has a blank record. Shows up on the count sheet also.
- DONE - Last thing to do is to remove any 'complete' lines that do not have a category number (still needs to keep the "extra scan" data).

## 10/05/2024
- Fixed all the issues with duplicates by either adding a '.' in WW, or asking purchasing to remove items.
- Added the same number logic to check the part number for only number values (fixing the 200.12800 issue)
- - This also made all part numbers show up as text in excelt (making them all left align)
- High Priority ToDos
- - DONE - Remove the V1 and V2 inventory tool
- - - Only show V4
- - DONE - Make the V4 inventory export directly (ie don't show the parsed table component)
- - Create a 4x1 label that shows just a barcode
- - - This label will be tested in North Van to see if those labels work better.
- - Create a single shelf label option
- - Change to headers of the 'Inventory Batch' template
- - - Might need to change the 'Inventory Single' to map correctly with the label component

## 10/06/2024
- Todays goal, get label things worked out.
- - DONE - Create a 4x1 label that shows just a barcode
- - - This label will be tested in North Van to see if those labels work better.
- - DONE - Create a single shelf label option
- - DONE - Change to headers of the 'Inventory Batch' template
- - - Might need to change the 'Inventory Single' to map correctly with the label component
- Post Coding Notes
- - changing the shelf label components to have batch and single version was fairly easy
- - - Used the InventoryLabel component as a 'template' on how to handle between batch and single, then rendering the labels once input is received.
- - - Shelf label was rendering a new component file for the labels, but the newer labels have a class inside one file to handle displaying the label
- - - The logic is basically the same with the one file or two file for rendering the labels
- - - I do like the one file method because its easier to handle the clear button. Going to leave it as is now, but could look into updating it.
- - Changing input labels for Inventory Batch
- - - Just needed to change the JSON object key, form control IDs, and template file headers.

## 10/07/2024
- Need to update the NV labels

## 11/19/2024
- found a bug with the scss file
- - i only imported the scss files for the componenets that use them.
- - issue was the 3x2 labels and 4x1 labels both used the same div id, which had different heights
- - Looking online, i might be organizing my files wrong. Short term solution was to change the div id to be more specific, and it fixed the issue. 

## 05/11/2025
- Implemented a Scanning Book 'label' type
- - Might have issues with the other scss files causing conflict
- - Biggest issue was the container padding pushing the table off the page
- - If any other label types have issues, this would be my first thing to check



## QoL ToDos
- Have upload files accept excel (low)
- Clean up code (comments, spacing, console logs(?))
- Create url so that you can auto load a label type
- - able to use localhost:3000/labels?type="1" and still load the page
- - maybe use 'componentDidMount' and check the url to set the state.selectedLabelType\
- - Update would be made in the Labels.js component
- Should move the error component to a helper component class
- - Code is mostly the same when used, but bulky and not nice to look at
- - Also, would like the alery to appear at the top of the screen above all components. Currently it apears in line and pushes other components down
- You can pass boolean values to component props by putting them in {}
- - ex : <Inventory batch:{true} /> and then use it as a boolean value in the parent component
- Force the print page to be landscape for shelf labels
- - You can use the 'size: landscape;' inside @page, but it changes the layout of the table. Not sure what is causing it
- Figure out how to use automated testing...


## Printer Preferences
- Stock : 3x2
- Orientation - 0 (Portrait)
- Exposed Linear Width
- - Left : 1.0
- - Right : 1.0


# Long Term goals
- Update for the inventory data is formatted to be something like [... {part_number: , count:{ expected: , actual: , difference: }}...]
- - The way it is currently getting created does not have the part_number key, which means I need to hard code the report table headers. 
- - Better design is to have the keys used as headers
- Learn more about the serverless MonogoDB
- - Did not expect MongoDB to be running in the cloud, but I got it working for what I need it to do.
- Learn more about Async problems
- - Had troubles with accessing data that was outside fetch blocks, or data inside the fetch block getting used outside
- - Did get it working with trial and error, but not totally sure how it's working


# Git Remote Branch Cheat sheet
## creating a new remote branch
1. create a new branch ( git checkout -b {newBranchName} )
2. Point head to new branch ( git push -u origin HEAD )
3. Update code while on the new branch and add/commit/push as usual
4. When ready to merge with main, change to main branch ( git checkout main )( git merge {newBranchName} )
5. Make a commit to recorde when the merge took place ( git commit -m "Merging main with branch {newBranchName}" )
6. Push to main ( git push )
- If the branch is not needed after this point, you can delete it here ( git branch -d {newBranchName} )
- If the branch is kept, main gets updated, and then the branch gets used later; change to the branch, and pull from origin/main ( git checkout {newBranchName} ) ( git pull origin main )
- - Do commit and push to mark updating branch to main ( git commit -m ... ) ( git push )
- - Go back to step 4 to merge with main
