using CapexCatalogService as service from '../cat-service';

annotate service.StatusValues with @(
    UI.FieldGroup #GeneratedGroup: {
        $Type: 'UI.FieldGroupType',
        Data : [
            {
                $Type: 'UI.DataField',
                Label: 'Code',
                Value: code,
            },
            {
                $Type: 'UI.DataField',
                Label: 'Value',
                Value: value,
            },
            {
                $Type: 'UI.DataField',
                Label: 'Criticality',
                Value: criticality,
            },
            {
                $Type: 'UI.DataField',
                Label: 'Delete Possible',
                Value: deletePossible,
            },
            {
                $Type: 'UI.DataField',
                Label: 'Insert Possible',
                Value: insertPossible,
            },
            {
                $Type: 'UI.DataField',
                Label: 'Update Possible',
                Value: updatePossible,
            },
        ],
    },
    UI.Facets                    : [{
        $Type : 'UI.ReferenceFacet',
        ID    : 'GeneratedFacet1',
        Label : 'General Information',
        Target: '@UI.FieldGroup#GeneratedGroup',
    }, ],
    UI.LineItem                  : [
        {
            $Type: 'UI.DataField',
            Label: 'Code',
            Value: code,
        },
        {
            $Type: 'UI.DataField',
            Label: 'Value',
            Value: value,
        },
        {
            $Type: 'UI.DataField',
            Label: 'Criticality',
            Value: criticality,
        },
        {
            $Type: 'UI.DataField',
            Label: 'Delete Possible',
            Value: deletePossible,
        },
        {
            $Type: 'UI.DataField',
            Label: 'Insert Possible',
            Value: insertPossible,
        },
    ],
);

annotate service.StatusValues with @(UI.HeaderInfo: {
    TypeName      : 'Status',
    TypeNamePlural: 'Statuses',
    Title         : {
        $Type: 'UI.DataField',
        Value: code,
    },
    Description   : {
        $Type: 'UI.DataField',
        Value: value,

    },
    ImageUrl      : 'https://www.kruger.com/wp-content/uploads/2020/03/logo-kruger-300x201.gif',
    TypeImageUrl  : 'sap-icon://sales-order',
});
