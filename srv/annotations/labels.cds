using CapexCatalogService as service from '../cat-service';

//
// annotations that control rendering of fields and labels
//
annotate service.Capex with @title: '{i18n>capex}';
annotate service.CashFlowYear @title: '{i18n>cashFlowYear}';

annotate service.Capex with {

    documentID            @title: '{i18n>documentID}'            @UI.Placeholder: '{i18n>placeHolderdocumentID}';
    orderNumber           @title: '{i18n>orderNumber}'           @UI.Placeholder: '{i18n>placeHolderOrderNumber}';
    orderType             @title: '{i18n>orderType}'             @UI.Placeholder: '{i18n>placeHolderOrderType}';
    companyCode           @title: '{i18n>companyCode}'           @UI.Placeholder: '{i18n>placeHolderCompanyCode}';
    site                  @title: '{i18n>site}'                  @UI.Placeholder: '{i18n>placeHolderSite}';
    division              @title: '{i18n>division}'              @UI.Placeholder: '{i18n>placeHolderDivision}';
    description           @title: '{i18n>description}'           @UI.Placeholder: '{i18n>placeHolderDescription}';
    businessReason        @title: '{i18n>businessReason}'        @UI.Placeholder: '{i18n>placeHolderBusinessReason}';
    amount                @title: '{i18n>amount}'                @UI.Placeholder: '{i18n>placeHolderAmount}';
    currency              @title: '{i18n>currency}';
    currentApprover       @title: '{i18n>currentApprover}';
    strategic             @title: '{i18n>strategic}'             @UI.Placeholder: '{i18n>placeHolderStrategic}';
    businessSustaining    @title: '{i18n>businessSustaining}'    @UI.Placeholder: '{i18n>placeHolderBusinessSustaining}';
    mandatory             @title: '{i18n>mandatory}'             @UI.Placeholder: '{i18n>placeHolderMandatory}';
    profitImprovement     @title: '{i18n>profitImprovement}'     @UI.Placeholder: '{i18n>placeHolderProfitImprovement}';
    millLabor             @title: '{i18n>millLabor}'             @UI.Placeholder: '{i18n>placeHolderMillLabor}';
    maintenanceLabor      @title: '{i18n>maintenanceLabor}'      @UI.Placeholder: '{i18n>placeHolderMaintenanceLabor}';
    operationsLabor       @title: '{i18n>operationsLabor}'       @UI.Placeholder: '{i18n>placeHolderOperationsLabor}';
    totalCost             @title: '{i18n>totalCost}'             @UI.Placeholder: '{i18n>placeHoldertotalCost}';
    outsideContract       @title: '{i18n>outsideContract}'       @UI.Placeholder: '{i18n>placeHolderOutsideContract}';
    materialCost          @title: '{i18n>materialCost}'          @UI.Placeholder: '{i18n>placeHolderMaterialCost}';
    hardwareCost          @title: '{i18n>hardwareCost}'          @UI.Placeholder: '{i18n>placeHolderHardwareCost}';
    softwareCost          @title: '{i18n>softwareCost}'          @UI.Placeholder: '{i18n>placeHolderSoftwareCost}';
    contingencyCost       @title: '{i18n>contingencyCost}'       @UI.Placeholder: '{i18n>placeHolderContingencyCost}';
    appropriationLife     @title: '{i18n>appropriationLife}'     @UI.Placeholder: '{i18n>placeHolderAppropriationLife}';
    profitImprovementPct  @title: '{i18n>profitImprovementPct}'  @UI.Placeholder: '{i18n>placeHolderProfitImprovementPct}';
    profitImprovementNPV  @title: '{i18n>profitImprovementNPV}'  @UI.Placeholder: '{i18n>placeHolderProfitImprovementNPV}';
    paybackWithTaxes      @title: '{i18n>paybackWithTaxes}'      @UI.Placeholder: '{i18n>placeHolderPaybackWithTaxes}';
    paybackWithoutTaxes   @title: '{i18n>paybackWithoutTaxes}'   @UI.Placeholder: '{i18n>placeHolderPaybackWithoutTaxes}';
    oneTimeExpenses       @title: '{i18n>oneTimeExpenses}'       @UI.Placeholder: '{i18n>placeHolderOneTimeExpenses}';
    recurringExpenses     @title: '{i18n>recurringExpenses}'     @UI.Placeholder: '{i18n>placeHolderRecurringExpenses}';
    startupDate           @title: '{i18n>startupDate}'           @UI.Placeholder: '{i18n>placeHolderStartupDate}';
    downtime              @title: '{i18n>downtime}'              @UI.Placeholder: '{i18n>placeHolderDowntime}';
    environmentalImpacts  @title: '{i18n>environmentalImpacts}'  @UI.Placeholder: '{i18n>placeHolderEnvironmentalImpacts}';
    safetyImplications    @title: '{i18n>safetyImplications}'    @UI.Placeholder: '{i18n>placeHolderSafetyImplications}';
    creditPotential       @title: '{i18n>creditPotential}'       @UI.Placeholder: '{i18n>placeHolderCreditPotential}';
    insuranceApproval     @title: '{i18n>insuranceApproval}'     @UI.Placeholder: '{i18n>placeHolderInsuranceApproval}';
    status                @title: '{i18n>status}'                @Common.Text   : to_Status.value  @Common.TextArrangement: #TextOnly;
    notes                 @title: '{i18n>notes}'                 @UI.Placeholder: '{i18n>placeHolderNotes}';
};

annotate service.UnitOfMeasureCodeList with {
    code  @title: '{i18n>unitCode}'  @Common.Text: name  @Common.TextArrangement: #TextLast
};

annotate service.Objectives with {
    objective        @title: '{i18n>objective}'        @UI.Placeholder: '{i18n>placeHolderObjective}';
    objectiveTarget  @title: '{i18n>objectiveTarget}'  @UI.Placeholder: '{i18n>placeHolderObjectiveTarget}';
    impact           @title: '{i18n>impact}'           @UI.Placeholder: '{i18n>placeHolderImpact}';
    amount           @title: '{i18n>amount}'           @UI.Placeholder: '{i18n>placeHolderAmount}';
}

annotate service.CashFlowYear with {
    year            @title: '{i18n>year}'            @UI.Placeholder: '{i18n>placeHolderYear}';
    cashFlowQOne    @title: '{i18n>cashFlowQOne}'    @UI.Placeholder: '{i18n>placeHolderCashFlowQOne}';
    cashFlowQTwo    @title: '{i18n>cashFlowQTwo}'    @UI.Placeholder: '{i18n>placeHolderCashFlowQTwo}';
    cashFlowQThree  @title: '{i18n>cashFlowQThree}'  @UI.Placeholder: '{i18n>placeHolderCashFlowQThree}';
    cashFlowQFour   @title: '{i18n>cashFlowQFour}'   @UI.Placeholder: '{i18n>placeHolderCashFlowQFour}';
    total           @title: '{i18n>total}'           @UI.Placeholder: '{i18n>placeHolderTotal}';
}
// annotate service.Languages with {
//     code  @title: '{i18n>unitCode}'  @Common.Text: name  @Common.TextArrangement: #TextOnly
// };

annotate service.Division with {
    code  @title: '{i18n>division}'  @Common.Text: name  @Common.TextArrangement: #TextLast
};


annotate service.StatusValues with {
    code  @title: '{i18n>status}'  @Common.Text: value  @Common.TextArrangement: #TextOnly
};


annotate service.Cot001Set with {
    Bukrs @title: '{i18n>companyCode}';
    Butxt @title: '{i18n>companyCodeDescription}';
    Waers @title: '{i18n>currency}'
};

annotate service.Notes with {
    recipient  @title: '{i18n>recipient}'  @UI.Placeholder: '{i18n>placeHolderRecipient}';
    text       @title: '{i18n>text}'       @UI.Placeholder: '{i18n>placeHolderText}'  @UI.MultiLineText: true;
}
