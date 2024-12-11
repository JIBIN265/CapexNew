using CapexCreatorCatalogService as service from '../creator-service';

annotate service.CashFlowYear with @(UI.LineItem #AnnualCashFlow: [
    {
        $Type                : 'UI.DataField',
        Value                : year,
        ![@HTML5.CssDefaults]: {width: '100%'}
    },
    {
        $Type                : 'UI.DataField',
        Value                : cashFlowQOne,
        ![@HTML5.CssDefaults]: {width: '100%'}
    },
    {
        $Type                : 'UI.DataField',
        Value                : cashFlowQTwo,
        ![@HTML5.CssDefaults]: {width: '100%'}
    },
    {
        $Type                : 'UI.DataField',
        Value                : cashFlowQThree,
        ![@HTML5.CssDefaults]: {width: '100%'}
    },
    {
        $Type                : 'UI.DataField',
        Value                : cashFlowQFour,
        ![@HTML5.CssDefaults]: {width: '100%'}

    },
    {
        $Type                : 'UI.DataField',
        Value                : total,
        ![@HTML5.CssDefaults]: {width: '100%'}
    },
]);
