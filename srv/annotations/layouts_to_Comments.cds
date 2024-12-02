using CapexCatalogService as service from '../cat-service';

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
