using CapexCreatorCatalogService as service from '../creator-service';
using CapexCreatorCatalogService.CashFlowYear as CashFlowYear from './layouts_to_CashFlowYear_creator';
using CapexCreatorCatalogService.Comments as Comments from './layouts_to_Comments_creator';
using CapexCreatorCatalogService.Notes as Notes from './layouts_to_Notes_creator';
using CapexCreatorCatalogService.Objectives as Objectives from './layouts_to_Objectives_creator';
using CapexCreatorCatalogService.ApproverHistory as ApproverHistory from './layouts_ApproverHistory_creator';
using from '../../db/schema';

annotate service.Capex with @(
    UI.Facets         : [
        {
            $Type : 'UI.CollectionFacet',
            ID    : 'GeneralCollectionFacetID',
            Label : '{i18n>general}',
            Facets: [
                {
                    $Type : 'UI.ReferenceFacet',
                    ID    : 'GeneralFacetID',
                    Label : '',
                    Target: '@UI.FieldGroup#General',
                },
                {
                    $Type : 'UI.ReferenceFacet',
                    ID    : 'GeneralFacetID2',
                    Label : '',
                    Target: '@UI.FieldGroup#General2',
                },
                {
                    $Type : 'UI.ReferenceFacet',
                    ID    : 'GeneralFacetID3',
                    Label : '',
                    Target: '@UI.FieldGroup#General3',
                },
            ],
        },
        {
            $Type : 'UI.CollectionFacet',
            ID    : 'AppropriationCollectionFacetID',
            Label : '{i18n>appropriation}',
            Facets: [
                {
                    $Type : 'UI.CollectionFacet',
                    ID    : 'AppropriationCostCollectionFacetID',
                    Label : '{i18n>costs}',
                    Facets: [{
                        $Type : 'UI.ReferenceFacet',
                        ID    : 'AppropriationCostsFacetID',
                        Label : '',
                        Target: '@UI.FieldGroup#AppropriationCosts',
                    }, ],
                },
                {
                    $Type : 'UI.CollectionFacet',
                    ID    : 'AnnualCashFlowCollectionFacetID',
                    Label : '{i18n>AnnualCashFlow}',
                    Facets: [{
                        $Type : 'UI.ReferenceFacet',
                        Label : '',
                        ID    : 'AnnualCashFlow',
                        Target: 'to_CashFlowYear/@UI.LineItem#AnnualCashFlow',
                    }, ],
                },
                {
                    $Type : 'UI.CollectionFacet',
                    ID    : 'AppropriationSummaryCollectionFacetID',
                    Label : '{i18n>summary}',
                    Facets: [
                        {
                            $Type : 'UI.ReferenceFacet',
                            Target: '@UI.FieldGroup#AppropriationSummary',
                            ID    : 'AppropriationSummaryFacetID',
                            Label : '',
                        },
                        {
                            $Type : 'UI.ReferenceFacet',
                            Target: '@UI.FieldGroup#AppropriationSummary2',
                            ID    : 'AppropriationSummary2FacetID',
                            Label : '',
                        },
                    ],
                },
            ],
        },
        {
            $Type : 'UI.ReferenceFacet',
            Label : '{i18n>Objectives}',
            ID    : 'Objectives',
            Target: 'to_Objectives/@UI.LineItem#Objectives',
        },
        {
            $Type : 'UI.ReferenceFacet',
            Label : '{i18n>ApproverHistory}',
            ID    : 'ApproverHistory',
            Target: 'to_ApproverHistory/@UI.SelectionPresentationVariant#ApproverHistory',
        },
    ],
    UI.Identification : [
        {
            $Type : 'UI.DataFieldForAction',
            Action: 'CapexCreatorCatalogService.copyCapex',
            Label : '{i18n>Copy}',
        },
    ],
    UI.LineItem       : {
        $value            : [
            {
                $Type                : 'UI.DataField',
                Value                : documentID,
                ![@UI.Importance]    : #High,
                ![@HTML5.CssDefaults]: {width: '25%', },
            },
            {
                $Type                : 'UI.DataField',
                Value                : orderNumber,
                ![@UI.Importance]    : #High,
                ![@HTML5.CssDefaults]: {width: '25%', },
            },
            {
                $Type            : 'UI.DataFieldForAnnotation',
                Label            : '{i18n>progressIndicator}',
                Target           : '@UI.DataPoint#progressIndicator',
                ![@UI.Importance]: #Low,
            },
            {
                $Type: 'UI.DataField',
                Value: orderType,
            },
            {
                $Type: 'UI.DataField',
                Value: companyCode,
            },
            {
                $Type: 'UI.DataField',
                Value: site,
            },
            {
                $Type: 'UI.DataField',
                Value: division,
            },
            {
                $Type              : 'UI.DataFieldForAction',
                Action             : 'CapexCreatorCatalogService.copyCapex',
                Label              : '{i18n>Copy}',
            },
            {
                $Type: 'UI.DataField',
                Value: businessReason,
            },
            {
                $Type: 'UI.DataField',
                Value: amount,
            },
            {
                $Type                    : 'UI.DataField',
                Value                    : status,
                Criticality              : to_Status.criticality,
                CriticalityRepresentation: #WithIcon,
            },
            {
                $Type                : 'UI.DataField',
                Value                : createdBy,
                ![@HTML5.CssDefaults]: {width: '20%', },
            },
            {
                $Type                : 'UI.DataField',
                Value                : createdAt,
                ![@HTML5.CssDefaults]: {width: '20%', },
            },
        ],
        ![@UI.Criticality]: to_Status.criticality,
    },
    UI.SelectionFields: [
        documentID,
        orderNumber,
        'to_ApproverHistory/email',
        companyCode,
        site,
        status,
        createdBy,
        modifiedBy,
    ],
    UI.HeaderInfo     : {
        TypeName      : '{i18n>CapexTypeName}',
        TypeNamePlural: '{i18n>CapexTypeNamePlural}',
        Title         : {
            $Type: 'UI.DataField',
            Value: documentID,
        // Criticality: #VeryPositive,
        },
        Description   : {
            $Type: 'UI.DataField',
            Value: description,

        },
        ImageUrl      : 'https://www.kruger.com/wp-content/uploads/2020/03/logo-kruger-300x201.gif',
        TypeImageUrl  : 'sap-icon://sales-order',
    },
    UI.HeaderFacets   : [
        {
            $Type : 'UI.CollectionFacet',
            ID    : 'HeaderCollectionFacetId',
            Label : '{i18n>adminData}',
            Facets: [{
                $Type : 'UI.ReferenceFacet',
                Target: '@UI.FieldGroup#AdminData',
                ID    : 'AdminDataID',
                Label : '{i18n>adminData}',
            }]
        },

        {

            $Type : 'UI.ReferenceFacet',
            Target: '@UI.DataPoint#Status',
            ID    : 'statusDataPointID',
            Label : '{i18n>status}',

        },
        {
            $Type : 'UI.ReferenceFacet',
            Target: '@UI.DataPoint#orderNumber',
            ID    : 'OrderNumberDataPointID',
            Label : '{i18n>orderNumber}',

        },

        {
            $Type : 'UI.CollectionFacet',
            ID    : 'CollectionFacet1',
            Facets: [{
                //Search-Term: #DataPoint
                $Type : 'UI.ReferenceFacet',
                Label : 'Approval Status',
                Target: '@UI.DataPoint#progressIndicator2',
            },

            ],
        },

    ]
);

annotate service.Capex with @(
    UI.FieldGroup #General              : {
        $Type: 'UI.FieldGroupType',
        Data : [

            {
                $Type: 'UI.DataField',
                Value: orderType,
            },
            {
                $Type: 'UI.DataField',
                Value: companyCode,
            },
            {
                $Type: 'UI.DataField',
                Value: site,
            },
            {
                $Type: 'UI.DataField',
                Value: division,
            },
        ],
    },
    UI.FieldGroup #General2             : {
        $Type: 'UI.FieldGroupType',
        Data : [
            {
                $Type: 'UI.DataField',
                Value: description,
            },
            {
                $Type: 'UI.DataField',
                Value: amount,
            },
            {
                $Type: 'UI.DataField',
                Value: currency_code,
            },
        ],
    },
    UI.FieldGroup #General3             : {
        $Type: 'UI.FieldGroupType',
        Data : [{
            $Type: 'UI.DataField',
            Value: businessReason,
        },

        ],
    },
    UI.FieldGroup #AppropriationCosts   : {
        $Type: 'UI.FieldGroupType',
        Data : [

            {
                $Type: 'UI.DataField',
                Value: millLabor,
            },
            {
                $Type: 'UI.DataField',
                Value: maintenanceLabor,
            },
            {
                $Type: 'UI.DataField',
                Value: operationsLabor,
            },
            {
                $Type: 'UI.DataField',
                Value: outsideContract,
            },
            {
                $Type: 'UI.DataField',
                Value: materialCost,
            },
            {
                $Type: 'UI.DataField',
                Value: hardwareCost,
            },
            {
                $Type: 'UI.DataField',
                Value: softwareCost,
            },
            {
                $Type: 'UI.DataField',
                Value: contingencyCost,
            },
            {
                $Type : 'UI.DataFieldForAnnotation',
                Target: ![@UI.DataPoint#progressIndicator],
            },


        ],
    },
    UI.FieldGroup #AppropriationSummary : {
        $Type: 'UI.FieldGroupType',
        Data : [

            {
                $Type: 'UI.DataField',
                Value: appropriationLife,
            },
            {
                $Type: 'UI.DataField',
                Value: profitImprovementPct,
            },
            {
                $Type: 'UI.DataField',
                Value: profitImprovementNPV,
            },
            {
                $Type: 'UI.DataField',
                Value: paybackWithTaxes,
            },
            {
                $Type: 'UI.DataField',
                Value: paybackWithoutTaxes,
            },
            {
                $Type: 'UI.DataField',
                Value: oneTimeExpenses,
            },
            {
                $Type: 'UI.DataField',
                Value: recurringExpenses,
            },
            {
                $Type: 'UI.DataField',
                Value: startupDate,
            },
            {
                $Type: 'UI.DataField',
                Value: downtime,
            },

        ],
    },
    UI.FieldGroup #AppropriationSummary2: {
        $Type: 'UI.FieldGroupType',
        Data : [

            {
                $Type: 'UI.DataField',
                Value: environmentalImpacts,
            },
            {
                $Type: 'UI.DataField',
                Value: safetyImplications,
            },
            {
                $Type: 'UI.DataField',
                Value: creditPotential,
            },
            {
                $Type: 'UI.DataField',
                Value: insuranceApproval,
            },


        ],
    },
    UI.FieldGroup #AdminData            : {Data: [
        {Value: createdAt},
        {Value: createdBy},
        {Value: modifiedAt},
        {Value: modifiedBy}
    ]},
    UI.FieldGroup #Notes                : {Data: [{Value: notes}]},
    UI.DataPoint #Status                : {
        Value               : status,
        Title               : '{i18n>status}',
        Criticality         : to_Status.criticality,
        ![@Common.QuickInfo]: '{i18n>status}',
    },
    UI.DataPoint #orderNumber           : {
        Value               : orderNumber,
        Title               : '{i18n>orderNumber}',
        Visualization       : #Number,
        // Criticality         : to_Status.criticality,
        ![@Common.QuickInfo]: '{i18n>orderNumber}',
    },
    UI.DataPoint #documentID            : {
        Value               : documentID,
        Title               : '{i18n>documentID}',
        Criticality         : to_Status.criticality,
        ![@Common.QuickInfo]: '{i18n>documentID}',
    },
    UI.DataPoint #progressIndicator     : {
        Value        : totalCost,
        TargetValue  : amount,
        Visualization: #Progress,
        // Title        : '{i18n>progressIndicator}',
        Criticality  : 3,
    },
    UI.DataPoint #progressIndicator2    : {
        //Search-Term: #ProgressIndicator
        Value        : approvedCount,
        TargetValue  : totalApprovals,
        Visualization: #Progress,
        Title        : '{i18n>progressIndicator}',
    //Criticality   : criticality, //> optional criticality
    },

);


annotate service.Capex with @(
    UI.SelectionVariant #SelectionVariantAll       : {
        Text         : 'All Orders',
        ID           : 'SelectionVariantAll',
        SelectOptions: [{PropertyName: status}]
    },
    UI.SelectionVariant #SelectionVariantApproved  : {
        ID           : 'SelectionVariantApproved',
        Text         : 'Approved',
        SelectOptions: [{
            PropertyName: status,
            Ranges      : [{
                Sign  : #I,
                Option: #EQ,
                Low   : 'E0009',
            }, ],
        }, ],
    },
    UI.SelectionVariant #SelectionVariantFinal     : {
        ID           : 'SelectionVariantFinal',
        Text         : 'Rejected Final',
        SelectOptions: [{
            PropertyName: status,
            Ranges      : [{
                Sign  : #I,
                Option: #EQ,
                Low   : 'E0010',
            }, ],
        }, ],
    },
    UI.SelectionVariant #SelectionVariantIncomplete: {
        ID           : 'SelectionVariantIncomplete',
        Text         : 'Rejected Incomplete',
        SelectOptions: [{
            PropertyName: status,
            Ranges      : [{
                Sign  : #I,
                Option: #EQ,
                Low   : 'E0011',
            }, ],
        }, ],
    },

    UI.SelectionVariant #SelectionVariantApprover  : {
        ID           : 'SelectionVariantApprover',
        Text         : 'Approved',
        SelectOptions: [{
            PropertyName: 'to_ApproverHistory/email',
            Ranges      : [{
                Sign  : #I,
                Option: #EQ,
                Low   : '$user.name',
            }, ],
        }, ],
    },
);


annotate service.Capex with @Aggregation.ApplySupported: {
    Transformations       : [
        'aggregate',
        'topcount',
        'bottomcount',
        'identity',
        'concat',
        'groupby',
        'filter',
        // 'expand',
        'search'
    ],
    Rollup                : #None,
    PropertyRestrictions  : true,
    GroupableProperties   : [
        orderNumber,
        status,
        site,
        orderType,
        division
    ],
    AggregatableProperties: [{Property: documentID, }],
};
