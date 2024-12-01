using CapexCatalogService as service from '../../srv/cat-service';

annotate service.CashFlowYear with @(UI.LineItem #AnnualCashFlow: [
    {
        $Type: 'UI.DataField',
        Value: year,
    },
    {
        $Type: 'UI.DataField',
        Value: cashFlowQOne,
    },
    {
        $Type: 'UI.DataField',
        Value: cashFlowQTwo,
    },
    {
        $Type: 'UI.DataField',
        Value: cashFlowQThree,
    },
    {
        $Type: 'UI.DataField',
        Value: cashFlowQFour,

    },
    {
        $Type: 'UI.DataField',
        Value: total,
    },
]);