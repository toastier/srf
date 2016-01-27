# Migrating of Legacy FRS Data

## 1. Export from Legacy Access Database
#### Get the data from the existing FRS Access database. Exporting it to XML will put it in a format that can be transformed into JSON that can then be imported into the new application’s Mongo database.

* Obtain a copy of the current access database file FCT.accdb
* In a Windows environment with Access 2007 installed, open the file
* For each table, export to XML, using the exact names of the tables.
	* tbl_CampusVisits
	* tbl_CandidateInformation
	* tbl_Comments
	* tbl_eval
	* tbl_positions
	* tbl_RefComments
	* tbl_CampusVisits
	* tblCandEval_Nov2010
	* tblNotes
	* tblQualEval

## 2. Convert Legacy XML Files to JSON
#### Run a script that iterates through the XML files and outputs one aggregate JSON file of the legacy data.

Place xml files in

> /config/migration/public

Run script

> node /config/migration/public/fctxml2json.js

JSON output file will be

> /config/migration/public/xml2json.json

## 3. Import Legacy JSON to FRS Application Database
#### Create a collection in Mongo DB for legacy data
From terminal shell:

> mongoimport -d faculty-recruitment-system-dev -c legacy xml2json.json

#### Generate Mongo collections for each legacy data table
From terminal shell:

> mongo faculty-recruitment-system-dev  /config/migration/public /generateTables.js

#### Copy data from legacy collections to FRS application collections

* Applicants:

> mongo faculty-recruitment-system-dev importLegacyApplicants.js

> mongo faculty-recruitment-system-dev importLegacyPositions.js

> mongo faculty-recruitment-system-dev importLegacyOpenings.js

> mongo faculty-recruitment-system-dev importLegacyApplications.js

To Be Continued...