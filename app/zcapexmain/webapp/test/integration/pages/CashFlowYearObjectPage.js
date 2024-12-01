sap.ui.define(['sap/fe/test/ObjectPage'], function(ObjectPage) {
    'use strict';

    var CustomPageDefinitions = {
        actions: {},
        assertions: {}
    };

    return new ObjectPage(
        {
            appId: 'zcapexmain',
            componentId: 'CashFlowYearObjectPage',
            contextPath: '/Capex/to_CashFlowYear'
        },
        CustomPageDefinitions
    );
});