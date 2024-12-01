using zcapex as persistence from '../db/schema';
using {sap.common as common} from '../db/common';
using {ZODATA_INTERNAL_ORDER_SRV as external} from './external/ZODATA_INTERNAL_ORDER_SRV';


service CapexCatalogService @(requires: 'authenticated-user') {

    entity Capex @(restrict: [
        {
            grant: ['READ'],
            to   : ['ZCapexApprover'],
            where: 'currentApprover = $user'
        },
        {
            grant: [
                'READ',
                'UPDATE'
            ],
            to   : ['ZCapexUser'],
            where: 'createdBy = $user'
        },
        {
            grant: 'WRITE',
            to   : ['ZCapexUser']
        },
        {
            grant: '*',
            to   : 'ZCapexAdmin'
        }
    ])                           as projection on persistence.CapexEntity
        actions {
            @(requires: 'ZCapexUser')
            action copyCapex(in : $self)                                                                       returns Capex;
            @(requires: 'ZCapexUser')
            action validate()                                                                                  returns Capex;

            @(requires: 'ZCapexApprover')
            @(Common.IsActionCritical: true)
            @(
                cds.odata.bindingparameter.name: '_it',
                Common.SideEffects             : {TargetEntities: ['$Return']}
            )
            action approve(in : $self)                                                                         returns Capex;

            @(requires: 'ZCapexApprover')
            @(
                cds.odata.bindingparameter.name: '_it',
                Common.SideEffects             : {TargetEntities: ['$Return']}
            )

            action rejectFinal2(text : String  @Common.Label:'Reason for rejection'  @UI.MultiLineText:true  ) returns Capex;

            @(requires: 'ZCapexApprover')
            @(
                cds.odata.bindingparameter.name: '_it',
                Common.SideEffects             : {TargetEntities: ['$Return']}
            )
            action rejectIncomplete(text : String @Common.Label:'Reason for Rework'  @UI.MultiLineText:true  )                                                             returns Capex;

            @(
                cds.odata.bindingparameter.name: '_it',
                Common.SideEffects             : {TargetEntities: ['_it']}
            )
            action workflowApprove()                                                                           returns {
                status : String(10);
                orderNumber : String(12);
            };

            action workflowIncomplete()                                                                        returns {
                status : String(10);
                orderNumber : String(12);
            };

            action workflowFinal()                                                                             returns {
                status : String(10);
                orderNumber : String(12);
            };

            action workflow(status : String(15), childId : String(40), comments : String(1000))                returns {
                response : String(10);
            };

        };

    entity Comments @(restrict: [
        {
            grant: ['READ'],
            to   : ['ZCapexApprover'],
            where: 'currentApprover = $user'
        },
        {
            grant: [
                'READ',
                'UPDATE'
            ],
            to   : ['ZCapexUser'],
            where: 'createdBy = $user'
        },
        {
            grant: 'WRITE',
            to   : ['ZCapexUser']
        },
        {
            grant: ['*'],
            to   : ['ZCapexAdmin']
        }
    ])                           as projection on persistence.CapexEntity.to_Comments;

    entity CashFlowYear @(restrict: [
        {
            grant: ['READ'],
            to   : ['ZCapexApprover'],
            where: 'currentApprover = $user'
        },
        {
            grant: [
                'READ',
                'UPDATE'
            ],
            to   : ['ZCapexUser'],
            where: 'createdBy = $user'
        },
        {
            grant: 'WRITE',
            to   : ['ZCapexUser']
        },
        {
            grant: ['*'],
            to   : ['ZCapexAdmin']
        }
    ])                           as projection on persistence.CapexEntity.to_CashFlowYear;

    entity Objectives @(restrict: [
        {
            grant: ['READ'],
            to   : ['ZCapexApprover'],
            where: 'currentApprover = $user'
        },
        {
            grant: [
                'READ',
                'UPDATE'
            ],
            to   : ['ZCapexUser'],
            where: 'createdBy = $user'
        },
        {
            grant: 'WRITE',
            to   : ['ZCapexUser']
        },
        {
            grant: ['*'],
            to   : ['ZCapexAdmin']
        }
    ])                           as projection on persistence.CapexEntity.to_Objectives;

    entity RejectionReasons @(restrict: [
        {
            grant: ['READ'],
            to   : ['ZCapexApprover'],
            where: 'currentApprover = $user'
        },
        {
            grant: [
                'READ',
                'UPDATE'
            ],
            to   : ['ZCapexUser'],
            where: 'createdBy = $user'
        },
        {
            grant: 'WRITE',
            to   : ['ZCapexUser']
        },
        {
            grant: ['*'],
            to   : ['ZCapexAdmin']
        }
    ])                           as projection on persistence.CapexEntity.to_RejectionReasons;

    entity ApproverHistory @(restrict: [
        {
            grant: ['READ'],
            to   : ['ZCapexApprover'],
            where: 'currentApprover = $user'
        },
        {
            grant: [
                'READ',
                'UPDATE'
            ],
            to   : ['ZCapexUser'],
            where: 'createdBy = $user'
        },
        {
            grant: 'WRITE',
            to   : ['ZCapexUser']
        },
        {
            grant: ['*'],
            to   : ['ZCapexAdmin']
        }
    ])                           as projection on persistence.CapexEntity.to_ApproverHistory;

    entity Notes @(restrict: [
        {
            grant: ['READ'],
            to   : ['ZCapexApprover'],
            where: 'currentApprover = $user'
        },
        {
            grant: [
                'READ',
                'UPDATE'
            ],
            to   : ['ZCapexUser'],
            where: 'createdBy = $user'
        },
        {
            grant: 'WRITE',
            to   : ['ZCapexUser']
        },
        {
            grant: ['*'],
            to   : ['ZCapexAdmin']
        }
    ])                           as projection on persistence.CapexEntity.to_Notes;

    entity Sustainability2030 @(restrict: [
        {
            grant: ['READ'],
            to   : ['ZCapexApprover'],
            where: 'currentApprover = $user'
        },
        {
            grant: [
                'READ',
                'UPDATE'
            ],
            to   : ['ZCapexUser'],
            where: 'createdBy = $user'
        },
        {
            grant: 'WRITE',
            to   : ['ZCapexUser']
        },
        {
            grant: ['*'],
            to   : ['ZCapexAdmin']
        }
    ])                           as projection on persistence.Sustainability2030;

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
