sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'zcapexmain/test/integration/FirstJourney',
		'zcapexmain/test/integration/pages/CapexList',
		'zcapexmain/test/integration/pages/CapexObjectPage',
		'zcapexmain/test/integration/pages/CashFlowYearObjectPage'
    ],
    function(JourneyRunner, opaJourney, CapexList, CapexObjectPage, CashFlowYearObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('zcapexmain') + '/index.html'
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