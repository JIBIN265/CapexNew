using CapexApproverCatalogService as service from '../approver-service';

annotate service.Comments with @(UI.LineItem: [
    {
        $Type: 'UI.DataField',
        Value: icon,
    },
    {
        $Type: 'UI.DataField',
        Value: info,
    },
    {
        $Type: 'UI.DataField',
        Value: text,
    },

]);