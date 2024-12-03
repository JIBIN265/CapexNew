sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'zcapexapprover/test/integration/FirstJourney',
		'zcapexapprover/test/integration/pages/CapexList',
		'zcapexapprover/test/integration/pages/CapexObjectPage',
		'zcapexapprover/test/integration/pages/CashFlowYearObjectPage'
    ],
    function(JourneyRunner, opaJourney, CapexList, CapexObjectPage, CashFlowYearObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('zcapexapprover') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onTheCapexList: CapexList,
					onTheCapexObjectPage: CapexObjectPage,
					onTheCashFlowYearObjectPage: CashFlowYearObjectPage
                }
            },
            opaJourney.run
        );
    }
);