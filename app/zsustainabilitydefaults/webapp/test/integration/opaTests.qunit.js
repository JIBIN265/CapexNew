sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'zsustainabilitydefaults/test/integration/FirstJourney',
		'zsustainabilitydefaults/test/integration/pages/Sustainability2030List',
		'zsustainabilitydefaults/test/integration/pages/Sustainability2030ObjectPage'
    ],
    function(JourneyRunner, opaJourney, Sustainability2030List, Sustainability2030ObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('zsustainabilitydefaults') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onTheSustainability2030List: Sustainability2030List,
					onTheSustainability2030ObjectPage: Sustainability2030ObjectPage
                }
            },
            opaJourney.run
        );
    }
);