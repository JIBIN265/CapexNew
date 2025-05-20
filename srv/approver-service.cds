using zcapex as persistence from '../db/schema';
using {sap.common as common} from '../db/common';
using {ZODATA_INTERNAL_ORDER_SRV as external} from './external/ZODATA_INTERNAL_ORDER_SRV';


service CapexApproverCatalogService @(path: 'approver') @(requires: 'authenticated-user') {

    entity Capex                 as projection on persistence.CapexEntity
        actions {
            @(Common.SideEffects.TargetEntities: ['/CapexApproverCatalogService.EntityContainer/Capex'])
            action validate(text : String  @Common.Label:'Reason for Skip?'  @UI.MultiLineText:true  )           returns Capex;
            @(Common.IsActionCritical: true)
            @(Common.SideEffects.TargetEntities: ['/CapexApproverCatalogService.EntityContainer/Capex'])
            action approve(in : $self)                                                                           returns Capex;

            action customApprove(Capex : Capex)                                                                           returns Capex;

            @(Common.SideEffects.TargetEntities: ['/CapexApproverCatalogService.EntityContainer/Capex'])
            action rejectFinal2(text : String  @Common.Label:'Reason for Rejection?'  @UI.MultiLineText:true  )  returns Capex;

            @(Common.SideEffects.TargetEntities: ['/CapexApproverCatalogService.EntityContainer/Capex'])
            action rejectIncomplete(text : String  @Common.Label:'Reason for Rework?'  @UI.MultiLineText:true  ) returns Capex;

            action workflow(status : String(15), childId : String(40), comments : String(1000))                  returns {
                response : String(10);
            };

        };

    entity Comments              as projection on persistence.CapexEntity.to_Comments;
    entity CashFlowYear          as projection on persistence.CapexEntity.to_CashFlowYear;
    entity Objectives            as projection on persistence.CapexEntity.to_Objectives;
    entity RejectionReasons      as projection on persistence.CapexEntity.to_RejectionReasons;
    entity ApproverHistory       as projection on persistence.CapexEntity.to_ApproverHistory;
    entity Notes                 as projection on persistence.CapexEntity.to_Notes;
    entity Sustainability2030    as projection on persistence.Sustainability2030;

    @readonly
    entity CompanyCode           as projection on persistence.CompanyCode;

    @readonly
    entity Site                  as projection on persistence.Site;

    @readonly
    entity Division              as projection on persistence.Division;

    @readonly
    entity BusinessReason        as projection on persistence.BusinessReason;

    entity StatusValues          as projection on persistence.StatusValues;

    @readonly
    entity Countries             as projection on common.Countries;

    @readonly
    entity Currencies            as projection on common.Currencies;

    @readonly
    entity Cot001Set             as projection on external.Cot001Set;

    @readonly
    entity OrderTypeF4Set        as projection on external.OrderTypeF4Set;

    @readonly
    entity BusinessReasonF4Set   as projection on external.BusinessReasonF4Set;

    @readonly
    entity DivisionF4Set         as projection on external.DivisionF4Set;

    @readonly
    entity SiteF4Set             as projection on external.SiteF4Set;

    @readonly
    entity MasterDataSet         as projection on external.MasterDataSet;

    @readonly
    entity CurrencyF4Set         as projection on external.CurrencyF4Set;

    @readonly
    entity ChangeStatusSet       as projection on external.ChangeStatusSet;

    @readonly
    entity ApproverLevelsSet     as projection on external.ApproverLevelsSet;

    @readonly
    entity UserRolesSet          as projection on external.UserRolesSet;

    @readonly
    entity UnitOfMeasureCodeList as projection on common.UnitOfMeasureCodeList;

    @(requires: 'authenticated-user')
    function getMessages(Key : String(32)) returns persistence.messageImport;

    @(requires: 'authenticated-user')
    function getStatusCount()              returns persistence.statusCount;

};
