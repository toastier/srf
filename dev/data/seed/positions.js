/**
 * Created by toastie on 7/27/15.
 */


var positionList =  [
        {
            "PositionID": "12",
            "Position": "Statistician II",
            "PositionDetails": "Second statistician position",
            "PostDate": "2008-08-28T00:00:00",
            "CloseDate": "2009-05-20T00:00:00"
        },
        {
            "PositionID": "13",
            "Position": "Statistician I",
            "PostDate": "2007-09-25T00:00:00",
            "CloseDate": "2008-04-17T00:00:00"
        },
        {
            "PositionID": "14",
            "Position": "Unspecified",
            "PostDate": "2007-03-01T00:00:00",
            "CloseDate": "2009-03-25T00:00:00"
        },
        {
            "PositionID": "16",
            "Position": "Dir, Acad Sim/Tech",
            "PostDate": "2008-04-01T00:00:00",
            "CloseDate": "2010-03-29T00:00:00"
        },
        {
            "PositionID": "17",
            "Position": "Translational Institute Director",
            "PositionDetails": "Per CLG in search committee mtg of 12/8, ok to remove this posting.",
            "PostDate": "2007-03-01T00:00:00",
            "CloseDate": "2009-12-14T00:00:00"
        },
        {
            "PositionID": "18",
            "Position": "Unspecified",
            "PostDate": "2008-07-01T00:00:00"
        },
        {
            "PositionID": "26",
            "Position": "Informatics",
            "PositionDetails": "Approved FY 09-10 faculty recruitment",
            "PostDate": "2009-03-25T00:00:00",
            "CloseDate": "2010-07-21T00:00:00",
            "documentLink": "Informatics faculty position announc updated 122109.doc"
        },
        {
            "PositionID": "27",
            "Position": "CRM",
            "PostDate": "2007-10-01T00:00:00",
            "CloseDate": "2008-08-04T00:00:00"
        },
        {
            "PositionID": "29",
            "Position": "Pediatrics .5",
            "PositionDetails": "Approved FY 09-10 faculty recruitment; DTS advised DB no need for additional peds faculty; CLG approved position being taken down from website",
            "PostDate": "2009-03-25T00:00:00",
            "CloseDate": "2010-03-11T00:00:00"
        },
        {
            "PositionID": "30",
            "Position": "ABSN Expansion",
            "PositionDetails": "Approved FY 09-10 faculty recruitment (includes adult health, geriatrics, mat/child, womens health, peds, community health.  6/08/10:  Position specialty updated:  adult health and geriatrics, maternal-newborn, and psychiatric; 10/10 per CLG peds added",
            "PostDate": "2009-03-25T00:00:00",
            "documentLink": "ABSN Expan Pos Announc updated 022010.doc"
        },
        {
            "PositionID": "31",
            "Position": "Researcher II (onc, cv, neuro)",
            "PositionDetails": "Approved FY09-10 faculty recruitment; onc, CV neuro removed from annoucement May 2011",
            "PostDate": "2009-03-25T00:00:00",
            "CloseDate": "2011-05-01T00:00:00",
            "documentLink": "Researcher onc cv neuro updated 122109.doc"
        },
        {
            "PositionID": "32",
            "Position": "Nurse Researcher/International Program Developer",
            "PostDate": "2009-05-13T00:00:00",
            "CloseDate": "2010-10-12T00:00:00",
            "documentLink": "OGACHI Nse Res (cg) updated 122109.doc"
        },
        {
            "PositionID": "33",
            "Position": "AC PNP/Specialty Director",
            "PostDate": "2009-11-23T00:00:00",
            "CloseDate": "2010-05-11T00:00:00",
            "documentLink": "Acute Care Peds FacultyPosition Announc updated 121909Final.doc"
        },
        {
            "PositionID": "34",
            "Position": "Health Services Research",
            "PostDate": "2010-01-08T00:00:00",
            "CloseDate": "2010-05-15T00:00:00",
            "documentLink": "HSR faculty announce draft v3 010810.doc"
        },
        {
            "PositionID": "35",
            "Position": "Informatics II",
            "PostDate": "2010-07-22T00:00:00",
            "documentLink": "Informatics II pos annouc CLG edits 072210.doc"
        },
        {
            "PositionID": "36",
            "Position": "FNP",
            "PositionDetails": "recruiting for two FNP positions; changed position announcement to one FNP position 2/2/11; position updated 072211; 10/17/11 position updated to include FNP and ANP position; June 2016 the recruitment was closed (no one hired)",
            "PostDate": "2010-07-01T00:00:00",
            "CloseDate": "2016-06-29T00:00:00",
            "documentLink": "FNP Pos Announc Final 070111.4.072210.doc"
        },
        {
            "PositionID": "37",
            "Position": "AACNP",
            "PostDate": "2010-07-01T00:00:00",
            "CloseDate": "2011-03-28T00:00:00",
            "documentLink": "AACNP Pos Announc 072210.doc"
        },
        {
            "PositionID": "38",
            "Position": "EBP IM",
            "PositionDetails": "Per CLG email of 5/27/11 - DTS and BTS agree no longer need EBP/IS position; postion pulled.",
            "PostDate": "2010-07-01T00:00:00",
            "CloseDate": "2011-05-27T00:00:00",
            "documentLink": "EBP IM Pos Announ CLG edits 072210.doc"
        },
        {
            "PositionID": "39",
            "Position": "Statistician III",
            "PostDate": "2010-10-11T00:00:00",
            "CloseDate": "2011-07-21T00:00:00",
            "documentLink": "Statistician III pos announc final 100410.doc"
        },
        {
            "PositionID": "40",
            "Position": "NAP Asst Director",
            "PostDate": "2011-04-06T00:00:00",
            "CloseDate": "2016-06-05T00:00:00",
            "documentLink": "NAP AD pos announc Final 071511.2.040611.doc"
        },
        {
            "PositionID": "41",
            "Position": "Researcher",
            "PositionDetails": "revised by CLG:  CV, onc, neuro specialties removed from announcement",
            "PostDate": "2011-05-10T00:00:00",
            "CloseDate": "2011-07-21T00:00:00"
        },
        {
            "PositionID": "42",
            "Position": "ABSN CH CLOSED",
            "PositionDetails": "CLG approved postion being posted as result of faculty resignation",
            "PostDate": "2011-05-16T00:00:00",
            "CloseDate": "2011-07-21T00:00:00"
        },
        {
            "PositionID": "43",
            "Position": "FNP",
            "PositionDetails": "new position (3 positions) approved by dean, EVD as of 2/3/13; revised 3/13 to include scholarship; 4/4 updated per MEZ request of 3/27 to include PNP in position announcment",
            "PostDate": "2013-03-08T00:00:00",
            "CloseDate": "2014-09-17T00:00:00",
            "documentLink": "FNP announcement FINAL 040213 Sdedits.doc"
        },
        {
            "PositionID": "44",
            "Position": "ABSN AH CLOSED",
            "PositionDetails": "Adult health position added to comm health;",
            "PostDate": "2011-06-16T00:00:00",
            "CloseDate": "2011-07-21T00:00:00"
        },
        {
            "PositionID": "45",
            "Position": "ADAA",
            "PostDate": "2011-07-22T00:00:00",
            "documentLink": "ADAA pos announc Final 071211.doc"
        },
        {
            "PositionID": "46",
            "Position": "ABSN Comm Health",
            "PositionDetails": "from mtg of 7/16/11 CLG, DBx, DTS, RAA, separate CH and AH positions for posting; new pos announc created",
            "PostDate": "2011-07-22T00:00:00",
            "documentLink": "ABSN Expan Pos Announ CH Final 071511.6.032509.doc"
        },
        {
            "PositionID": "47",
            "Position": "ABSN Adult Health",
            "PositionDetails": "from mtg of 7/16/11 CLG, DBx, DTS, RAA, separate CH and AH positions for posting; new pos announc created; two positions:  1 TT, 1CT",
            "PostDate": "2011-07-22T00:00:00",
            "documentLink": "ABSN Expan Pos Announ AH Final 071511.6.032509.doc"
        },
        {
            "PositionID": "48",
            "Position": "Statistician III",
            "PositionDetails": "Revised position posted (added TT track appointment has an independent program of research)",
            "PostDate": "2011-07-22T00:00:00",
            "documentLink": "Statistician III Pos Announc Final 071511.3.101110.doc"
        },
        {
            "PositionID": "49",
            "Position": "Senior Researcher",
            "PositionDetails": "Per CLG, separate junior and senior researcher positions; separate senior researcher posted.  3/2013:  new senior nurse researcher position approved (2-3 positions) and posted",
            "PostDate": "2011-07-22T00:00:00",
            "CloseDate": "2013-03-07T00:00:00",
            "documentLink": "Researcher Senior pos announc 071511.5.032509"
        },
        {
            "PositionID": "50",
            "Position": "Junior Researcher",
            "PositionDetails": "Per CLG, separate junior and senior researcher position; separate jr researcher posted",
            "PostDate": "2011-07-22T00:00:00",
            "CloseDate": "2016-09-30T00:00:00",
            "documentLink": "Researcher Junior pos announc 071511.5.032509.doc"
        },
        {
            "PositionID": "51",
            "Position": "Informatics",
            "PositionDetails": "Per CMJ email and CLG concurrence, position changed to TT appointment",
            "PostDate": "2011-07-22T00:00:00",
            "documentLink": "Informatics II pos announc FINAL071511.3.072210.doc"
        },
        {
            "PositionID": "52",
            "Position": "Health Policy",
            "PostDate": "2011-09-06T00:00:00",
            "CloseDate": "2016-06-11T00:00:00",
            "documentLink": "Health policy faculty position FINAL 090211.doc"
        },
        {
            "PositionID": "53",
            "Position": "NAP CEC",
            "PostDate": "2011-11-10T00:00:00",
            "CloseDate": "2016-06-05T00:00:00",
            "documentLink": "NAP CEC pos announc FINAL 110911.doc"
        },
        {
            "PositionID": "54",
            "Position": "ACPNP",
            "PositionDetails": "Position opened and approved for recruitment per CLG's email of 7/9/16",
            "PostDate": "2016-07-23T00:00:00",
            "CloseDate": "2016-12-17T00:00:00",
            "documentLink": "ACPNP pos announc 07112016.doc"
        },
        {
            "PositionID": "55",
            "Position": "Pharmacist",
            "PositionDetails": "Position opened and approved for recruitment per CLG's email of 7/9/16",
            "PostDate": "2016-07-23T00:00:00",
            "CloseDate": "2016-12-17T00:00:00",
            "documentLink": "Pharmacist pos announc  07112016.doc"
        },
        {
            "PositionID": "56",
            "Position": "Physiologist",
            "PositionDetails": "Position opened and approved for recruitment per CLG's email of 7/9/16",
            "PostDate": "2016-07-23T00:00:00",
            "CloseDate": "2013-06-19T00:00:00",
            "documentLink": "Physiologist pos announc 07112016.doc"
        },
        {
            "PositionID": "57",
            "Position": "Informatics III",
            "PositionDetails": "Recruitment opened following J Peace's resignation",
            "PostDate": "2016-05-30T00:00:00",
            "CloseDate": "2013-05-06T00:00:00",
            "documentLink": "Informatics III pos announc FINAL051512 407110 CMJ cg edits.doc"
        },
        {
            "PositionID": "58",
            "Position": "ABSN AH Track II",
            "PositionDetails": "In light of J Brion's departure, new position approved by dean in email of 10/17/16",
            "PostDate": "2016-10-18T00:00:00",
            "CloseDate": "2013-01-15T00:00:00",
            "documentLink": "ABSN AH Pos Announ 10172016.doc"
        },
        {
            "PositionID": "59",
            "Position": "NP (Adult, Ger, Family)",
            "PositionDetails": "Adult gero family NP position replaced with adult gero NP (with new faculty postings from BM/CLG) 3/16/13",
            "PostDate": "2016-12-06T00:00:00",
            "CloseDate": "2013-03-12T00:00:00"
        },
        {
            "PositionID": "60",
            "Position": "Community health",
            "PositionDetails": "new position approved by dean, EVD as of 2/3/13; 3/18: revised to include scholarship",
            "PostDate": "2013-03-08T00:00:00",
            "CloseDate": "2013-09-11T00:00:00",
            "documentLink": "Comm Health announcement FINAL 030713.doc"
        },
        {
            "PositionID": "61",
            "Position": "Pop Health Care Coord",
            "PositionDetails": "New position per dean's email of 4/14/2013; supported by HHI grant",
            "PostDate": "2013-04-05T00:00:00",
            "CloseDate": "2013-09-11T00:00:00",
            "documentLink": "PCCP faculty description FINAL 040413.doc"
        },
        {
            "PositionID": "62",
            "Position": "Psych NP",
            "PositionDetails": "Per dean, EVD, new positions approved as of 2/3/13; 3/18:  revised to include scholarship",
            "PostDate": "2013-03-08T00:00:00",
            "documentLink": "Psych NP announcement FINAL 030713.doc"
        },
        {
            "PositionID": "63",
            "Position": "AG NP",
            "PositionDetails": "new position (2 positionss) approved by dean, EVD as of 2/3/13; 3/18: revised to include scholarship; per EVD at 10/6 search mtg okay to remove posting from website",
            "PostDate": "2013-03-08T00:00:00",
            "CloseDate": "2014-10-07T00:00:00",
            "documentLink": "AG NP announcement FINAL 030713.doc"
        },
        {
            "PositionID": "64",
            "Position": "Senior Nurse Researcher",
            "PositionDetails": "New position (2-3 CV, neuro, onc) approved by dean, EVD as of 2/13",
            "PostDate": "2013-03-08T00:00:00",
            "documentLink": "Senior Nurse Researcher FINAL 030713.doc"
        },
        {
            "PositionID": "65",
            "Position": "Senior Nurse Researcher FINAL 030713",
            "PostDate": "2013-03-08T00:00:00",
            "documentLink": "Senior Nurse Researcher FINAL 030713.doc"
        },
        {
            "PositionID": "66",
            "Position": "Assist Professor, Track III",
            "PositionDetails": "Dean and EVD agreed to create postion for asst res prof w 50% funding/some teaching; emails of 8/29-30/13.  Per BM email of 2/7/14:  unable to proceed with hiring a 2nd  track III position at this time; will reconsider filling it in Fall",
            "PostDate": "2013-09-13T00:00:00",
            "CloseDate": "2014-02-15T00:00:00",
            "documentLink": "Asst Prof Track III FINAL 091113.doc"
        },
        {
            "PositionID": "67",
            "Position": "Statistician IV",
            "PositionDetails": "Approval to post - per email from B. Merwin 12/3/13; DHD - Research track position",
            "PostDate": "2013-12-06T00:00:00",
            "CloseDate": "2014-05-27T00:00:00",
            "documentLink": "Statistician Pos Announc FINAL 120613.doc"
        },
        {
            "PositionID": "68",
            "Position": "ABSN Program Director",
            "PostDate": "2014-03-28T00:00:00",
            "CloseDate": "2014-07-22T00:00:00",
            "documentLink": "ABSN Program Director Posting FINAL 032714.doc"
        },
        {
            "PositionID": "69",
            "Position": "ABSN AH and Fundamentals",
            "PostDate": "2014-03-28T00:00:00",
            "CloseDate": "2014-09-09T00:00:00",
            "documentLink": "ABSN AH and Fund Pos Announ FINAL 3 27 14.doc"
        },
        {
            "PositionID": "70",
            "Position": "ABSN Psych",
            "PostDate": "2013-09-10T00:00:00",
            "CloseDate": "2015-05-01T00:00:00"
        },
        {
            "PositionID": "71",
            "Position": "ABSN PSYCH",
            "PostDate": "2013-09-13T00:00:00",
            "CloseDate": "2015-05-01T00:00:00",
            "documentLink": "ABSN Psych Announcement FINAL 091213.doc"
        },
        {
            "PositionID": "72",
            "Position": "Nurse Anesthesia Program Faculty",
            "PositionDetails": "Position opened per email from B. Merwin on 9/11/14; closed 12/2014; reopened with close date of 3/1/15",
            "PostDate": "2014-09-18T00:00:00",
            "CloseDate": "2015-03-01T00:00:00",
            "documentLink": "NAP Faculty Position 09_11_14 _FINAL.doc"
        },
        {
            "PositionID": "73",
            "Position": "Jr Researcher Faculty",
            "PostDate": "2014-09-17T00:00:00",
            "CloseDate": "2014-12-01T00:00:00",
            "documentLink": "Jr  Res Pos Announc  09_17_14-FINAL.doc"
        },
        {
            "PositionID": "74",
            "Position": "ADRA",
            "PositionDetails": "Position opened per email from EVD",
            "PostDate": "2014-09-17T00:00:00",
            "CloseDate": "2015-01-31T00:00:00",
            "documentLink": "ADRA SECOND _9_17_14 -FINAL.doc"
        },
        {
            "PositionID": "75",
            "Position": "Sr  Nurse Researcher",
            "PositionDetails": "Position updated per email from EVD 9/17/14",
            "PostDate": "2014-09-17T00:00:00",
            "documentLink": "SR nurse researcher position 9_17_14-FINAL.doc"
        },
        {
            "PositionID": "76",
            "Position": "AG NP (VA program)",
            "PositionDetails": "Target hire date of September 2015",
            "PostDate": "2015-06-22T00:00:00"
        }
    ];

db.positions.insert(positionList);
