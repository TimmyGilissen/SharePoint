function execOperation(refiner, termId, termName) {

    if (termId.length === 37) {
        termId = termId.substr(1);
    }

    //Current Context
    var context = SP.ClientContext.get_current();

    //Current Taxonomy Session
    var taxSession = SP.Taxonomy.TaxonomySession.getTaxonomySession(context);

    //Term Stores
    var termStores = taxSession.get_termStores();

    //Name of the Term Store from which to get the Terms.
    var termStore = termStores.getByName("Managed Metadata Service Application");

    //GUID of Term Set from which to get the Terms.
    var termSet = termStore.getTerm(termId);

    var terms = termSet.get_terms();

    context.load(termSet);
    context.load(terms);

    context.executeQueryAsync(function () {

        var termEnumerator = terms.getEnumerator();

        var termList = new Object();

        termList[termName] = new Array();

        termList[termName].push('string("L0|#0' + termSet.get_id() + '|' + termSet.get_name() + '")');

        while (termEnumerator.moveNext()) {

            var currentTerm = termEnumerator.get_current();

            termList[termName].push('string("L0|#0' + currentTerm.get_id() + '|' + currentTerm.get_name() + '")');
        }        

        refiner.addRefinementFiltersJSON(Sys.Serialization.JavaScriptSerializer.serialize(termList));

    }, function (sender, args) {

    });

}

$(document).ready(function () {
    var scriptbase = _spPageContextInfo.siteAbsoluteUrl + "/_layouts/15/";

    $.ajax({
        async: false,
        url: scriptbase + "SP.js",
        dataType: "script"
    });

    $.ajax({
        async: false,
        url: scriptbase + "SP.Taxonomy.js",
        dataType: "script"
    });
});
