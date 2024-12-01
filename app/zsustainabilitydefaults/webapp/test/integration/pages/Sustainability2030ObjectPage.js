sap.ui.define(['sap/fe/test/ObjectPage'], function(ObjectPage) {
    'use strict';

    var CustomPageDefinitions = {
        actions: {},
        assertions: {}
    };

    return new ObjectPage(
        {
            appId: 'zsustainabilitydefaults',
            componentId: 'Sustainability2030ObjectPage',
            contextPath: '/Sustainability2030'
        },
        CustomPageDefinitions
    );
});