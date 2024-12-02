using CapexCatalogService as service from '../cat-service';
using from './layouts_Capex';

annotate service.CurrencyF4Set with @(cds.odata.valuelist);

annotate service.Capex with {
    status         @(Common: {
        ValueListWithFixedValues: true,
        Label                   : 'SAP Status',
        ValueList               : {
            $Type         : 'Common.ValueListType',
            CollectionPath: 'StatusValues',
            Parameters    : [
                {
                    $Type            : 'Common.ValueListParameterInOut',
                    LocalDataProperty: status,
                    ValueListProperty: 'code'
                },
                {
                    $Type            : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty: 'value'
                }
            ]
        },
    });

    companyCode    @(Common: {ValueList: {
        $Type         : 'Common.ValueListType',
        CollectionPath: 'Cot001Set',
        Label         : 'Choose a company Code',
        Parameters    : [
            {
                $Type            : 'Common.ValueListParameterInOut',
                LocalDataProperty: companyCode,
                ValueListProperty: 'Bukrs',
            },
            {
                $Type            : 'Common.ValueListParameterDisplayOnly',
                ValueListProperty: 'Butxt'
            },
            {
                $Type            : 'Common.ValueListParameterOut',
                LocalDataProperty: 'currency_code',
                ValueListProperty: 'Waers'
            }
        ]
    }, });

    orderType      @(Common: {ValueList: {
        $Type         : 'Common.ValueListType',
        CollectionPath: 'OrderTypeF4Set',
        Label         : 'Choose a Order Type',
        Parameters    : [
            {
                $Type            : 'Common.ValueListParameterInOut',
                LocalDataProperty: orderType,
                ValueListProperty: 'Aurat',
            },
            {
                $Type            : 'Common.ValueListParameterDisplayOnly',
                ValueListProperty: 'Desc'
            }
        ]
    }, });

    site           @(Common: {ValueList: {
        $Type         : 'Common.ValueListType',
        CollectionPath: 'SiteF4Set',
        Label         : 'Choose a Site',
        Parameters    : [
            {
                $Type            : 'Common.ValueListParameterInOut',
                LocalDataProperty: site,
                ValueListProperty: 'Site',
            },
            {
                $Type            : 'Common.ValueListParameterDisplayOnly',
                ValueListProperty: 'Desc'
            }
        ]
    }, });

    division       @(Common: {ValueList: {
        $Type         : 'Common.ValueListType',
        CollectionPath: 'DivisionF4Set',
        Label         : 'Choose a Division',
        Parameters    : [
            {
                $Type            : 'Common.ValueListParameterInOut',
                LocalDataProperty: division,
                ValueListProperty: 'Div',
            },
            {
                $Type            : 'Common.ValueListParameterDisplayOnly',
                ValueListProperty: 'Desc'
            }
        ]
    }, });

    currency       @(Common: {ValueList: {
        $Type         : 'Common.ValueListType',
        CollectionPath: 'CurrencyF4Set',
        Label         : 'Choose a Currency',
        Parameters    : [
            {
                $Type            : 'Common.ValueListParameterInOut',
                LocalDataProperty: currency_code,
                ValueListProperty: 'Waers',
            },
            {
                $Type            : 'Common.ValueListParameterDisplayOnly',
                ValueListProperty: 'Desc'
            }
        ]
    }, });

    businessReason @(Common: {ValueList: {
        $Type         : 'Common.ValueListType',
        CollectionPath: 'BusinessReasonF4Set',
        Label         : 'Choose a Business Reason',
        Parameters    : [
            {
                $Type            : 'Common.ValueListParameterInOut',
                LocalDataProperty: businessReason,
                ValueListProperty: 'BusReason',
            },
            {
                $Type            : 'Common.ValueListParameterDisplayOnly',
                ValueListProperty: 'Desc'
            }
        ]
    }, });

};





// annotate service.ApproverHistory with {
//     level    @Common.FieldControl: #ReadOnly;
//     email    @Common.FieldControl: #ReadOnly;
//     status   @Common.FieldControl: #ReadOnly;
//     days     @Common.FieldControl: #ReadOnly;
//     comments @Common.FieldControl: #ReadOnly
// };
