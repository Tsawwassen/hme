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
