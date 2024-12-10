using CapexCreatorCatalogService as service from '../creator-service';

// annotate service.Capex.approve with @(Common.IsActionCritical: true);
//
// annotations that control the behavior of fields and actions
// Bold Keys and for navigation
annotate service.Capex with @(Common.SemanticKey: [documentID], );


annotate service.Capex {
    // ID                     @UI.Hidden               @readonly  @mandatory  @UI.ExcludeFromNavigationContext;
    ID              @readonly                                        @mandatory                                      @UI.ExcludeFromNavigationContext; //don't hide display text only
    orderType       @validation.message: 'i18n>orderTypeError'       @mandatory;
    site            @validation.message: 'i18n>siteError'            @mandatory;
    amount          @validation.message: 'i18n>amountError'          @mandatory;
    companyCode     @validation.message: 'i18n>companyCodeError'     @mandatory;
    division        @validation.message: 'i18n>divisionError'        @mandatory;
    currency        @validation.message: 'i18n>currencyError'        @mandatory;
    businessReason  @validation.message: 'i18n>businessReasonError'  @mandatory;
    status          @Core.Computed;
    totalCost       @Core.Computed                                   @Measures.ISOCurrency: currency_code;
    // description_custom     @Core.Computed           @UI.HiddenFilter: true  @UI.ExcludeFromNavigationContext;
    description     @UI.MultiLineText                                @validation.message  : 'i18n>descriptionError'  @mandatory;
    notes           @UI.MultiLineText;
    createdAt       @UI.HiddenFilter   : false                       @UI.ExcludeFromNavigationContext;
    createdBy       @UI.HiddenFilter   : false                       @UI.ExcludeFromNavigationContext;
    modifiedAt      @UI.HiddenFilter   : false                       @UI.ExcludeFromNavigationContext;
    modifiedBy      @UI.HiddenFilter   : false                       @UI.ExcludeFromNavigationContext;


};

// annotate service.Capex.Attachments with @Common.FieldControl #Mandatory;

annotate service.Objectives {
    // ID                     @UI.Hidden               @readonly  @mandatory  @UI.ExcludeFromNavigationContext;
    ID              @readonly                @mandatory  @UI.ExcludeFromNavigationContext; //don't hide display text only

    objectiveTarget @Measures.Unit  : '%';

    // description_custom     @Core.Computed           @UI.HiddenFilter: true  @UI.ExcludeFromNavigationContext;

    createdAt       @UI.HiddenFilter: false  @UI.ExcludeFromNavigationContext;
    createdBy       @UI.HiddenFilter: false  @UI.ExcludeFromNavigationContext;
    modifiedAt      @UI.HiddenFilter: false  @UI.ExcludeFromNavigationContext;
    modifiedBy      @UI.HiddenFilter: false  @UI.ExcludeFromNavigationContext;


};

annotate service.CashFlowYear {
    // ID                     @UI.Hidden               @readonly  @mandatory  @UI.ExcludeFromNavigationContext;
    ID          @readonly                @mandatory  @UI.ExcludeFromNavigationContext; //don't hide display text only

    total       @readonly;
    // total       @Core.Computed;
    // description_custom     @Core.Computed           @UI.HiddenFilter: true  @UI.ExcludeFromNavigationContext;

    createdAt   @UI.HiddenFilter: false  @UI.ExcludeFromNavigationContext;
    createdBy   @UI.HiddenFilter: false  @UI.ExcludeFromNavigationContext;
    modifiedAt  @UI.HiddenFilter: false  @UI.ExcludeFromNavigationContext;
    modifiedBy  @UI.HiddenFilter: false  @UI.ExcludeFromNavigationContext;


};
