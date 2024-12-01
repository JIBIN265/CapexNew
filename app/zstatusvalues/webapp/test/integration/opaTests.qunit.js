sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'zstatusvalues/test/integration/FirstJourney',
		'zstatusvalues/test/integration/pages/StatusValuesList',
		'zstatusvalues/test/integration/pages/StatusValuesObjectPage'
    ],
    function(JourneyRunner, opaJourney, StatusValuesList, StatusValuesObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('zstatusvalues') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onTheStatusValuesList: StatusValuesList,
					onTheStatusValuesObjectPage: StatusValuesObjectPage
                }
            },
            opaJourney.run
        );
    }
);