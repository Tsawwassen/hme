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

# Versions 
* V1 - The two input files will be a CSV file.
* V2 - The expected file will be uploaded, and the physical count will be created inside the app.
* V3 - The expected file will be pulled from Windward (API), and the physical count will be created inside the app.

# Journal
## 09/03/2023
- After casually working on the app on weekends for a couple weeks, I have data from two differnet files being read, and the information from those files moving up to the 'parent' Inventory Component, allowing the data to be passed to a different component.
- All this time I have been organizing the code for that the expected file it always first, and then the actual file is second.
- Today after writing code to pass a setter function down the Upload Component and making sure I put it in the correct order, I realized I should have organized it in alphabetical order... (ie 'A'ctual first and 'E'xpected second)

