sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'zcapexcreator/test/integration/FirstJourney',
		'zcapexcreator/test/integration/pages/CapexList',
		'zcapexcreator/test/integration/pages/CapexObjectPage',
		'zcapexcreator/test/integration/pages/CashFlowYearObjectPage'
    ],
    function(JourneyRunner, opaJourney, CapexList, CapexObjectPage, CashFlowYearObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('zcapexcreator') + '/index.html'
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