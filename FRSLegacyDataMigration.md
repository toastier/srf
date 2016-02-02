# Migrating of Legacy FRS Data

## 1. Export from Legacy Access Database
#### Get the data from the existing FRS Access database. Exporting it to XML will put it in a format that can be transformed into JSON that can then be imported into the new application’s Mongo database.

* Obtain a copy of the current access database file FCT.accdb
	* tbl_CampusVisits

## 2. Convert Legacy XML Files to JSON
#### Run a script that iterates through the XML files and outputs one aggregate JSON file of the legacy data.

> /config/migration/public

> node /config/migration/public/fctxml2json.js

> /config/migration/public/xml2json.json

## 3. Import Legacy JSON to FRS Application Database
	* Data originally from tbl_CandidateInformation

* Positions:
	* Data originally from tbl_positions

* Openings:
	* Data originally from tbl_positions

* Applications:
	* Data originally from 	tbl_Comments, tbl_eval, tbl_RefComments, bl_CampusVisits, tblCandEval_Nov2010, tblNotes, tblQualEval

		> mongo faculty-recruitment-system-dev importLegacyApplications.js