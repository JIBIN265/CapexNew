using CapexApproverCatalogService as service from '../approver-service';


annotate service.Notes with @(UI.LineItem: [
    {
        $Type: 'UI.DataField',
        Value: recipient,
    },
    {
        $Type: 'UI.DataField',
        Value: text,
    },
    {
        $Type: 'UI.DataField',
        Value: createdBy,
    },
    {
        $Type: 'UI.DataField',
        Value: createdAt,
    },
]);
