I would like to build a web app in the current directory that will let me manage a list of drugs and drug properties for a health care concern.  The app should be build in next.js using react in the front end. I would like to use tailwind for styling and shadcdn as a component library. The app will ultimately connect to a back-end postgresql database but to start, I would like it to manage local json documents (files).

The app will ultimately use github credentials for authentication.  To start, the app can use a hardcoded credential in the form of an email address.  The prototype does not have to wire up true
authentication, but can simulate the look/feel.

There will be two different layouts depending on whether the user is authenticated or not.  call them the “authenticated layout” and the “unauthenticated layout”. Both layouts will have the same basic structure but the contents will vary depending on authentication state.

For the common layout geometry, I would like every view to have the following:
1) a header that spans the page from left to right that abuts the top of the window.
2) a footer that spans the page from left to right that abuts the bottom of the window.
3) a body-content panel that spans the page from left to right and abuts the header at the top and 
abuts the footer at the bottom.

For the unauthenticated layout, the header will have a logo/banner image in the center and a “login” button on the right side.  When clicked, the login button will cause the body-content to display the login page. I will call this the “unauthenticated-header”.

Upon successful login, the header will change so that it has a logo/banner in the center and the login button on the right will be replaced with the logged in username. The username will act as a button that drops down a user-profile menu. the user-profile menu will have one item - “logoff”. When the “logoff” item is selected, the user will be logged out and the display should change to the unauthenticated layout.

The body content for the unauthenticated user will have a boilerplate display that outlines the functionality of the system and instructs the user to login in.

The unauthenticated footer will have a copyright notice in the center. At the right it will have a “login help” button that a user can select to fill out a form to request help. The form will ask for an email address and a text box for detail, and a submit button. (the submit button will do nothing and simply return the user to the unauthenticated body content.

The authenticated footer will have the same copyright notice in the center. The button to the right of the authenticated footer will be a “feedback” button that will launch a form to collect feedback/question.

For the authenticated body content, that will be specific to the actual drug data which will depend on the drug data schema.  Here is an outline of the drug schema:

Table: 
TableName: “generic_drugs”
Columns: generic_key (string)  - the name of the generic. examples: adalim, inflix, etaner

Table:
TableName: “manufacturer_drugs”
Columns: 
manufacturer_drug_key (string) - a delimited string. examples: humira:adalimumab, remicade:infliximab
generic_key (string) - the name of the associated generic drug (foreign key to generic_drug table)
drug_full_name - string
manufacturer - string
brandkey - string,

drugkey - string,

biosimilar_suffix - string,
bisimilar - boolean
orig_drug_name - string
drug_class - string

Table:
TableName: “drug_aliases”
Columns:
generic_key - string (foreign key to generic_drugs table)
drug_brand_name - string
alias - string

Table:
TableName “drug_approvals”
Columns:
generic_key - string - foreign key to generic_drugs table
drug_brand_name - string
route - string
country - string
approval_date - string (iso-8601 date string)

APP BODY CONTENT for AUTHENTICATED USER:

The body content will be broken up into several columns that span the body-content panel from top to bottom. From left to right the columns are:
1) Drug List - a list of all generic drugs from the generic_drugs table.
- The top of the column will say “Generic Drugs”.
- To the right of the title will be a square-plus icon to “add” a new drug.
- below the title will be a search box which will be used to limit the number of drugs shown in the list using a “substring match”.
- below the search box will be the list of generic drug keys
This list will be called content-list-1

2) When a drug is selected in the content-list-1, the app should display another list to the right of it.
The app should highlight the selected generic drug for visual reference.
We’ll call this new list “content-list-2”.  This list should display the “manufacturer_drugs” that match the generic_key for the drug selected in content-list-1.  The content-list-2 panel will have a title called “Manu Drugs”.  to the right of the title will be a square-plus icon that will be used to add a new manufacturer_drug with the appropriate relation to the generic drug.

3) In addition to the display of content-list-2, when a generic drug is selected in content-list-2, the app should display “generic-drug-detail” in the remainder of the space to the right of content-list-2.
This are will be filled with 3 cards spanning the page:
- card 1 (the top care) will have “Drug Details”. in the body of the card it should display all properties from the generic_drug table.  The drug-details card header should have an icon at the right edge fo the card header for “edit” (a pencil icon), “delete” (a red trashcan icon).
- card 2 (below the generic-drug-details) a card titled: “approvals”. The body of the card should show a table of all of the approvals in the “drug_approvals” table. Each row should include an icon to the right to “edit” a row, to “delete” a row. The card header should include icons for “add” a drug approval.
- card 3 (below the approvals card) will be a card entitled “aliases”.  The right of the card header should include a link to “add” an alias. The body of the card should display a table of aliases for the selected generic drug along with an “edit” icon and a “delete” icon.

4) for content-list-2, if a manufacturer-drug is selected, the drug-detail panel to the right of content-list-2 should display a card entitled “Manufacturer Drug”. The card title will have an edit icon and a delete icon to the right of the title.  The body of the card should display all of the properties in the manufacurer_drugs table for the selected drug.

Architecture:

I would like a clean “repository layer” that captures the data for the 4 tables and builds an interface to query, filter, and sort retrieved data. The initial implementation can use the 4 attached files as a “static” dataset.  

The data for the demo repository is located in the /data folder.