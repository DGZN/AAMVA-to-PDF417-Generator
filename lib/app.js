const codes = {
  "ANSI": "Format",
  "DCA": "Jurisdiction-specific vehicle class",
  "DCB": "Jurisdiction-specific restriction codes",
  "DCD": "Jurisdiction-specific endorsement codes",
  "DCS": "Customer Family Name",
  "DAC": "Customer First Name",
  "DAD": "Customer Middle Name(s)",
  "DBD": "Document Issue Date",
  "DBB": "Date of Birth",
  "DBA": "Document Expiration Date",
  "DBC": "Physical Description – Sex",
  "DAY": "Physical Description – Eye Color",
  "DAU": "Physical Description – Height",
  "DAG": "Address – Street 1",
  "DAI": "Address – City",
  "DAJ": "Address – Jurisdiction Code",
  "DAK": "Address – Postal Code",
  "DAQ": "Customer ID Number",
  "DCF": "Document Discriminator",
  "DCG": "Country Identification",
  "DDE": "Family name truncation",
  "DDF": "First name truncation",
  "DDG": "Middle name truncation",
  "DAZ": "Hair color",
  "DCJ": "Audit Information",
  "DCL": "Ethnicity",
  "DAH": "Street Address line 2)",
  "DAZ": "Hair Color",
  "DCI": "Place of Birth",
  "DCJ": "Audit Information",
  "DBN": "Alias Family Name",
  "DBG": "Alias Given Name",
  "DBS": "Alias Suffix Name",
  "DCU": "Suffix",
  "DCE": "Weight Range 0- 9",
  "DAW": "Weight LBs",
  "DAW": "Weight KGs",
  "DDH": "Date Cardholder Turns 18",
  "DDI": "Date Cardholder Turns 19",
  "DDJ": "Date Cardholder Turns 21",
  "DDK": "Organ Donor Indicator",
  "DDL": "Veteran Indicator",
  "DCL": "Ethnicity",
  "DCM": "Standard Vehicle Classification",
  "DCN": "Standard Endorsement Code",
  "DCO": "Standard Restriction code",
  "DCP": "Jurisdiction Specific Vehicle Classification",
  "DCQ": "Jurisdiction Specific Endorsement Code Description",
  "DCR": "Jurisdiction Specific Restriction Code Description",
  "DCK": "Inventory Control Number",
  "DDA": "Compliance Type",
  "DDB": "Revision Date",
  "DDC": "HazMat Endorsment Date",
  "DDD": "Limited Duration Document Indicator"
}

$(document).ready(function() {

  setTimeout(function () {

    $('.menu .item')
      .tab()
    ;
    
    $('.ui.dropdown')
      .dropdown({
        onChange: function (value, text, $selectedItem) {
          console.log(`UPDATING WITH VALUE ${value}`);
          updateAAMVA()
        }
      })
    ;
  }, 10);

  $('#code').val($('#code').val().toUpperCase())

  generate()

  $('#aamva :input').keyup(function () {
    let id = $(this).attr('id');
    switch (id) {
      case 'code':
        break;
      default:
        updateAAMVA()
        break;
    }
  })

  tippy('.ui.label', {
    content(reference) {
      const id = reference.innerHTML;
      const content = $(`#standards-${id}-row`).children('td:nth-child(2)').text()
      return content;
    },
  });

});

function download () {
  var link = document.getElementById('download');
  var name = document.getElementById('DCS').value;
  link.setAttribute('download', `PDF417-${name}`);
  link.setAttribute('href', barcode.toDataURL("image/png").replace("image/png", "image/octet-stream"));
  link.click();
}

function displayDownload() {
  $('#download_aamva_standard')
    .transition('fly right')
  ;
}

let transitionedElements = []
function transitionTab (tab) {
  if (!transitionedElements.includes(tab)) {
    transitionedElements.push(tab)
    $(`#${tab}`)
      .transition('vertical flip')
      .transition('vertical flip')
    ;
  }
}

let lines = []
let parsed = {}
let sortedKeys;

function codePosition (code) {
  return Object.keys(codes).join(' ').indexOf(code)
}

function generate() {
  let code = $('#code').val()
  let canvas = document.getElementById('barcode')

  lines = code.trim().split('\n');
  lines.map((l) => {
    Object.keys(codes).forEach((c, i) => {
      if (l.replace(/ID|DL/g, '').indexOf(c) > -1) {
        let match = l.split(c)
        if (match) {
          parsed[c] = match[1]
        }
      }
    })
  })
  
  sortedKeys = Object.keys(parsed).sort((a, b) => { 
    codePosition(a) > codePosition(b) 
  })
  
  Object.keys(parsed).forEach((k) => {
    $('form').form('set value', k, parsed[k])
  })

  PDF417.draw(code, canvas, 7)
}

function updateAAMVA() {
  let combinedVals = ''
  let inputVals = ''
  $('#aamva :input').each(function () {
    let id = $(this).attr('id');
    let val = $(this).val();
    switch (id) {
      case 'code':
        break;
      case 'DAQ':
        lines[1] = lines[1].replace(/DAQ.*/, `DAQ${val}`)
        break;
      default:
        inputVals += `${id}${val}\n`
        break;
    }
  });
  combinedVals = `${lines[0]}\n${lines[1]}\n${inputVals}`;
  $('#code').val(combinedVals)
}
