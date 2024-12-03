using CapexApproverCatalogService as service from '../approver-service';


annotate service.Sustainability2030 with @(
    UI.FieldGroup #GeneratedGroup: {
        $Type: 'UI.FieldGroupType',
        Data : [
            {
                $Type: 'UI.DataField',
                Label: 'objective',
                Value: objective,
            },
            {
                $Type: 'UI.DataField',
                Label: 'objectiveTarget',
                Value: objectiveTarget,
            },
            {
                $Type: 'UI.DataField',
                Label: 'filled',
                Value: filled,
            },
            {
                $Type: 'UI.DataField',
                Label: 'impact',
                Value: impact,
            },
            {
                $Type: 'UI.DataField',
                Label: 'amount',
                Value: amount,
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
            Label: 'objective',
            Value: objective,
        },
        {
            $Type: 'UI.DataField',
            Label: 'objectiveTarget',
            Value: objectiveTarget,
        },
        {
            $Type: 'UI.DataField',
            Label: 'filled',
            Value: filled,
        },
        {
            $Type: 'UI.DataField',
            Label: 'impact',
            Value: impact,
        },
        {
            $Type: 'UI.DataField',
            Label: 'amount',
            Value: amount,
        },
    ],
);


