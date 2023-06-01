// ==UserScript==
// @name        Zenodo Curation Checklist
// @resource    jqueryUiCss https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.13.2/themes/base/jquery-ui.min.css
// @require     https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.0/jquery.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.13.2/jquery-ui.min.js
// @namespace   curation.epflrdm.zenodo
// @author      Alain Borel
// @include     https://zenodo.org/record/*
// @include     https://sandbox.zenodo.org/record/*
// @grant       none
// @version     1
// ==/UserScript==

const checklistData = {
  "M1": {"full": "At least one author must be affiliated with EPFL at the time of the submission or creation of the submitted work", "category": "must"},                
  "M2": {"full": "The content of the dataset must be accessible for review, i.e. Open Access, or Restricted after an access request has been completed. Embargoed datasets will be reviewed after the embargo has expired", "category": "must"},   
  "M3": {"full": "The Description of the submitted dataset must be  sufficiently detailed. Mere references to external articles or other resources are not a sufficient description", "category": "must"},
  "M4": {"full": "If no ORCID is listed, the name and surname and EPFL email address of at least one author must be specified in the Description", "category": "must"},   
  "R1": {"full": "Authors are identified by their ORCID", "category": "recommended"},   
  "R2": {"full": "The title should be human-readable on the same level as conventional publications: filenames or coded expressions are deprecated", "category": "recommended"},   
  "R3": {"full": 'If existing, references to related publications (e.g., article, source code, other datasets, etc.) should specified in the "Related/alternate identifiers" field, using a DOI if available', "category": "recommended"},   
  "R4": {"full": "In general, a README file should be present in the root directory, and in case the submission consists of a compressed file then it is external. The README file is not needed for records consisting in one single document which already contains enough information (such as publications, posters and presentation slides)", "category": "recommended"},    
  "R5": {"full": "Any sensitive, personal data should have been anonymized", "category": "recommended"},   
  "N1": {"full": 'If applicable, related grants should acknowledged using “Funding/Grants” fields', "category": "nth"},   
  "N2": {"full": "Dataset should have been cleaned up (e.g., there are no temporary or unnecessary empty files or folders, no superfluous file versions, etc.)", "category": "nth"},
  "N3": {"full": "Permissive licenses are preferred (order of preference: CC0, CC-BY-4.0, CC-BY-SA-4.0 for data; MIT, BSD, GPL for code)", "category": "nth"},
  "N4": {"full": "When a README file is advised, it could contain information such as the convention for files and folders naming, possible ontologies or controlled vocabularies, etc.", "category": "nth"},
  "N5": {"full": "If the submission is related to a PhD thesis, the supervisor should be specified", "category": "nth"},
  "N6": {"full": "Files should be available in open formats", "category": "nth"},
  "N7": {"full": "Where applicable, sources from which the work is derived should be specified", "category": "nth"},
  "N8": {"full": "Keywords should be entered as separated fields", "category": "nth"}
};


const checklistStyle = `
<style>
.check {
  -webkit-appearance: none; /*hides the default checkbox*/
  height: 20px;
  width: 20px;
  transition: 0.10s;
  background-color: #FE0006;
  text-align: center;
  font-weight: 600;
  color: white;
  border-radius: 3px;
  outline: none;
}

.check:checked {
  background-color: #0E9700;
}

.check:before {
  content: "✖";
}
.check:checked:before {
  content: "✔";
}

.check:hover {
  cursor: pointer; 
  opacity: 0.8;
}
</style>
`;

this.$ = this.jQuery = jQuery.noConflict(true);
$('head').append( $('<link rel="stylesheet" type="text/css" />').attr('href', 'https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.13.2/themes/base/jquery-ui.min.css') );
$('head').append( checklistStyle );


addButtons();


function addButtons() {
  
  var btn = document.createElement('BUTTON');
  var t = document.createTextNode('Prepare curation e-mail');
  var frm = document.createElement('FORM');
  var icn = document.createElement('I');


  icn.setAttribute('class', "fa fa-external-link");
  btn.setAttribute('class', "btn btn-primary btn-block");
  btn.appendChild(icn);
  btn.appendChild(t);
  frm.appendChild(btn);
  
  frm.addEventListener("click", function(event) {
    
    var collapse = document.getElementById('collapseTwo');
    
    var zenodoURL = window.location.href;
    var finalURL = "mailto:info@zenodo.org";

    openMailEditor(finalURL);
    event.preventDefault();
  });

  var menu = document.getElementsByClassName("col-sm-4 col-md-4 col-right")[0];
  var metadata = document.getElementsByClassName("well metadata")[0];

  //menu.appendChild(btn);

  menu.insertBefore(frm, metadata);
  
  // This one should always be there, let's use it as a reference
  let license = $( "dt:contains('License (for files):')" );
  let importantFrame = license.parent();
  if (license.length) {
    license.append('&nbsp;<input type="checkbox" class="check" name="nth" value="N3" />');
  }
  
  
  let relativeIdentifiers = $( "dt:contains('Related identifiers:')" );
  if (relativeIdentifiers.length) {
    relativeIdentifiers.attr("title", checklistData["R3"]);
    relativeIdentifiers.tooltip();
    relativeIdentifiers.append('&nbsp;<input type="checkbox" name="recommended" class="check" value="R3"/>');
  } else {
    importantFrame.append('<dt>No related identifiers here, is it OK? &nbsp;<input type="checkbox" name="recommended" class="check" value="R3" /></dt>');
  }
  
  let grants = $( "dt:contains('Grants:')" );
  if (grants.length) {
    grants.attr("title", checklistData["N1"]);
    grants.tooltip();
    grants.append('&nbsp;<input type="checkbox" class="check" name="nth" value="N1" />');
  } else {
    importantFrame.append('<dt>No grants here, is it OK? &nbsp;<input type="checkbox" name="nth" class="check" value="N8" /></dt>');
  }
  
  
  let keywords = $( "dt:contains('Keyword(s):')" );
  console.log('Keywords', keywords);
  if (keywords.length) {
    keywords.append('&nbsp;<input type="checkbox" name="nth" value="N8" />');
  } else {
    importantFrame.append('<dt>No keywords here, is it OK? &nbsp;<input type="checkbox" name="nth" class="check" value="N8" /></dt>');
  }
  

}


function openMailEditor(url) {
  location.href = url;
}

// wait for async elements to load
//setTimeout(addButton, 1000);
