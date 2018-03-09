// Code.gs

// After opening the document, new menu items are added to the the current Spreadsheet
function onOpen() {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var menuEntries = [{name: "Search", functionName: "showForm"} ];
    ss.addMenu("Recipe Puppy", menuEntries);
}

function showForm() {
    var ui = HtmlService.createHtmlOutputFromFile("Form")
    SpreadsheetApp.getUi().showModelessDialog(ui,"demo");
}

function processFormData(e){
    // Use Recipe Puppy API and decode the response
    var url = 'http://www.recipepuppy.com/api/?i=' + e.ingredients + '&q=' + e.meal;
    var response = UrlFetchApp.fetch(url, {'muteHttpExceptions': true})
    var json = response.getContentText();
    var data = JSON.parse(json);
    var recipes = data.results;

    // Open Spreadsheet and select/insert Responses sheet
    var ss = SpreadsheetApp.openById("<INSERT GOOGLE SPREADSHEET ID>");
    var SheetResponses = ss.getSheetByName("Responses");

    if(!SheetResponses){
        SheetResponses = ss.insertSheet("Responses");
    }

    // Append header row
    SheetResponses.appendRow(['Recipe','Ingredients','URL',' Image URL']);

    // Append found recipes
    for each (var recipe in recipes) {
        SheetResponses.appendRow([recipe.title, recipe.ingredients, recipe.href, recipe.thumbnail]);
    };
}