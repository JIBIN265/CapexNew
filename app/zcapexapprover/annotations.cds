using CapexApproverCatalogService as service from '../../srv/approver-service';
using from '../../srv/annotations/layouts_Capex_approver';
annotate service.Capex with @(
    UI.LineItem : {
        $value : [
            {
                $Type : 'UI.DataField',
                Value : documentID,
                ![@UI.Importance] : #High,
                ![@HTML5.CssDefaults] : {
                    width : '25%',
                },
            },
            {
                $Type : 'UI.DataField',
                Value : orderNumber,
                ![@UI.Importance] : #High,
                ![@HTML5.CssDefaults] : {
                    width : '25%',
                },
            },
            {
                $Type : 'UI.DataFieldForAnnotation',
                Label : '{i18n>progressIndicator}',
                Target : '@UI.DataPoint#progressIndicator2',
                ![@UI.Importance] : #Low,
            },
            {
                $Type : 'UI.DataField',
                Value : orderType,
            },
            {
                $Type : 'UI.DataField',
                Value : companyCode,
            },
            {
                $Type : 'UI.DataField',
                Value : site,
            },
            {
                $Type : 'UI.DataField',
                Value : division,
            },
            {
                $Type : 'UI.DataFieldForAction',
                Action : 'CapexApproverCatalogService.approve',
                Label : '{i18n>Approve}',
            },
            {
                $Type : 'UI.DataFieldForAction',
                Action : 'CapexApproverCatalogService.rejectFinal2',
                Label : '{i18n>RejectOrder}',
            },
            {
                $Type : 'UI.DataFieldForAction',
                Action : 'CapexApproverCatalogService.validate',
                Label : '{i18n>SkipApproval}',
            },
            {
                $Type : 'UI.DataField',
                Value : businessReason,
            },
            {
                $Type : 'UI.DataField',
                Value : amount,
            },
            {
                $Type : 'UI.DataField',
                Value : status,
                Criticality : to_Status.criticality,
                CriticalityRepresentation : #WithIcon,
            },
            {
                $Type : 'UI.DataField',
                Value : createdBy,
                ![@HTML5.CssDefaults] : {
                    width : '20%',
                },
            },
            {
                $Type : 'UI.DataField',
                Value : createdAt,
                ![@HTML5.CssDefaults] : {
                    width : '20%',
                },
            },
        ],
        ![@UI.Criticality] : to_Status.criticality,
    },
    UI.Identification : [
        {
            $Type : 'UI.DataFieldForAction',
            Action : 'CapexApproverCatalogService.validate',
            Label : '{i18n>SkipApproval}',
            Inline : true,
        },
        {
            $Type : 'UI.DataFieldForAction',
            Action : 'CapexApproverCatalogService.approve',
            Label : '{i18n>Approve}',
        },
        {
            $Type : 'UI.DataFieldForAction',
            Action : 'CapexApproverCatalogService.rejectFinal2',
            Label : '{i18n>RejectOrder}',
        },
    ],
);

