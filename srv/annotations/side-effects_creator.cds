using CapexCreatorCatalogService as service from '../creator-service';

annotate service.CashFlowYear @(Common: {SideEffects #pr_enabledChanged: {
    SourceProperties: [
        cashFlowQFour,
        cashFlowQOne,
        cashFlowQThree,
        cashFlowQTwo
    ],
    TargetProperties: ['total']
}});


annotate service.CashFlowYear @(Common: {SideEffects #pr_enabledChanged3: {
    SourceProperties: [
        cashFlowQFour,
        cashFlowQOne,
        cashFlowQThree,
        cashFlowQTwo
    ],
    TargetEntities  : ['']
}});


annotate service.Capex @(Common: {SideEffects #pr_enabledChanged: {
    SourceProperties: [
        millLabor,
        maintenanceLabor,
        operationsLabor,
        outsideContract,
        materialCost,
        hardwareCost,
        softwareCost,
        contingencyCost,
    ],
    TargetProperties: ['totalCost']
}});

annotate service.Comments @(Common: {SideEffects #CommentsChanged: {
    SourceEntities: [],
    TargetEntities: ['up_']
}});
