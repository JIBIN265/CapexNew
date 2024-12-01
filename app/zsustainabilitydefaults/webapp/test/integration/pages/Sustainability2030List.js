sap.ui.define(['sap/fe/test/ListReport'], function(ListReport) {
    'use strict';

    var CustomPageDefinitions = {
        actions: {},
        assertions: {}
    };

    return new ListReport(
        {
            appId: 'zsustainabilitydefaults',
            componentId: 'Sustainability2030List',
            contextPath: '/Sustainability2030'
        },
        CustomPageDefinitions
    );
});