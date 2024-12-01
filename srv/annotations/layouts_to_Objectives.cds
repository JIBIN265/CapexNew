using CapexCatalogService as service from '../../srv/cat-service';


annotate service.Objectives with @(UI.LineItem #Objectives: [
    {
        $Type                  : 'UI.DataField',
        Value                  : objective,
        ![@Common.FieldControl]: {$edmJson: {$If: [
            {$Eq: [
                {$Path: 'filled'},
                true
            ]},
            1,
            3
        ]}}

    },
    {
        $Type                  : 'UI.DataField',
        Value                  : objectiveTarget,
        ![@Common.FieldControl]: {$edmJson: {$If: [
            {$Eq: [
                {$Path: 'filled'},
                true
            ]},
            1,
            3
        ]}},
        ![@HTML5.CssDefaults]  : {width: '15%'}

    },

    {
        $Type: 'UI.DataField',
        Value: impact,

    },
    {
        $Type: 'UI.DataField',
        Value: amount,

    },
]);


annotate service.Objectives with @(

    UI.SelectionVariant #SelectionVariantActive : {
        ID           : 'SelectionVariantActiveID',
        Text         : 'Sustainability2030',
        SelectOptions: [{
            PropertyName: filled,
            Ranges      : [{
                Sign  : #I,
                Option: #EQ,
                Low   : true,
            }, ],
        }, ],
    },
    UI.SelectionVariant #SelectionVariantExpired: {
        ID           : 'SelectionVariantExpiredID',
        Text         : 'Other Objectives',
        SelectOptions: [{
            PropertyName: filled,
            Ranges      : [{
                Sign  : #I,
                Option: #EQ,
                Low   : false,
            }, ],
        }, ],
    },
    UI.SelectionVariant #SelectionVariantAll    : {
        Text         : 'All Objectives',
        ID           : 'SelectionVariantAllID',
        SelectOptions: [{PropertyName: filled}]
    },
);

