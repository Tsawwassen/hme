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
## 10/7/23 to 10/21/23
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
## 10/28/23
- Starting to try the local executable. Using Tyler Pott video as a guide ( https://www.youtube.com/watch?v=TkAiVKfWtjI )
- - New node package that will be used - Electron, https://github.com/electron/electron-packager
1. npm install --save-dev electron-packager
- First Note : I think I need to add a file that opens a window (using the electron package) and then create the exe from that new file
- - I hope that I can more or less point to the react client (might be client/public/index.html, client/src/index.js, client/src/App.js, or something different ).
## 11/04/2023
- Ended up using Electron-Forge (https://www.electronforge.io/)
- The React App needs to be running for the Electron window to load the app
- Was able to make an executable, but feels janky


# Long Term goals
- Update for the inventory data is formatted to be something like [... {part_number: , count:{ expected: , actual: , difference: }}...]
- - The way it is currently getting created does not have the part_number key, which means I need to hard code the report table headers. 
- - Better design is to have the keys used as headers
- Learn more about the serverless MonogoDB
- - Did not expect MongoDB to be running in the cloud, but I got it working for what I need it to do.
- Learn more about Async problems
- - Had troubles with accessing data that was outside fetch blocks, or data inside the fetch block getting used outside
- - Did get it working with trial and error, but not totally sure how it's working

remote branch test

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
