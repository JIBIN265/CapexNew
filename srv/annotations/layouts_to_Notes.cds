using CapexCatalogService as service from '../cat-service';


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

