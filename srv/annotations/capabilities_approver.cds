using CapexApproverCatalogService as service from '../approver-service';

annotate service.Capex with @odata.draft.enabled; //Search-Term: #Draft
// annotate service.StatusValues with @odata.draft.enabled;
// annotate service.Sustainability2030 with @odata.draft.enabled;

annotate service.Capex with @(Capabilities: {

SearchRestrictions: {
    $Type     : 'Capabilities.SearchRestrictionsType',
    Searchable: true,
},

});

annotate service.Capex with @(
    //Disables the delete option dependent of the fields value
    Capabilities.DeleteRestrictions: {Deletable: to_Status.deletePossible, //Search-Term: #DynamicCRUD
    },
    /* Capabilities.UpdateRestrictions : {
        Updatable : updatePossible, //UpdateRestrictions are ignored in determining if the edit button is visible or not, but it still affects wheather the fields are editable or not
    }, */
    UI.DeleteHidden                : true,
    UI.CreateHidden                : true,
    UI.UpdateHidden                : true, //Search-Term: #DynamicCRUD

/* Capabilities.FilterRestrictions : {
    RequiredProperties : [
        stringProperty //Search-Term: #RequiredFilter
    ],
}, */
);


annotate service.ApproverHistory with @(
    //Disables the delete option dependent of the fields value
    Capabilities.DeleteRestrictions: {Deletable: false, 
    },
    UI.DeleteHidden                : true,
    
    UI.UpdateHidden                : true, 

    UI.CreateHidden                : true,

);

annotate service.Capex with @(Capabilities: {
    FilterRestrictions: {FilterExpressionRestrictions: [
        {
            Property          : 'createdAt',
            AllowedExpressions: 'SingleRange'
        },
        {
            Property          : 'modifiedAt',
            AllowedExpressions: 'SingleRange'
        },
    ]},

    CountRestrictions : {
        $Type    : 'Capabilities.CountRestrictionsType',
        Countable: true,
    },
});

// @sap.searchable: true annotate service.SapDescription with  @(Capabilities: {SearchRestrictions: {
//     $Type     : 'Capabilities.SearchRestrictionsType',
//     Searchable: true,
// }, });

// annotate service.SapDescription with {
//     description  @Search.defaultSearchElement  @Search.fuzzinessThreshold: 0.7
// };
