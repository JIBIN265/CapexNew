/* checksum : 2cf4d14338fdd8957927b4a22d2975fe */
@cds.external : true
@m.IsDefaultEntityContainer : 'true'
@sap.supported.formats : 'atom json xlsx'
service ZODATA_INTERNAL_ORDER_SRV {};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.pageable : 'false'
@sap.content.version : '1'
entity ZODATA_INTERNAL_ORDER_SRV.Cot001Set {
  @sap.unicode : 'false'
  @sap.label : 'Company Code'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  key Bukrs : String(4) not null;
  @sap.unicode : 'false'
  @sap.label : 'Company Name'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Butxt : String(25) not null;
  @sap.unicode : 'false'
  @sap.label : 'Currency'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  @sap.semantics : 'currency-code'
  Waers : String(5) not null;
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.pageable : 'false'
@sap.addressable : 'false'
@sap.content.version : '1'
entity ZODATA_INTERNAL_ORDER_SRV.OrderTypeF4Set {
  @sap.unicode : 'false'
  @sap.label : 'Order Type'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  key Aurat : LargeString not null;
  @sap.unicode : 'false'
  @sap.label : 'Description'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Desc : LargeString not null;
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.pageable : 'false'
@sap.addressable : 'false'
@sap.content.version : '1'
entity ZODATA_INTERNAL_ORDER_SRV.SiteF4Set {
  @sap.unicode : 'false'
  @sap.label : 'Site'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  key Site : LargeString not null;
  @sap.unicode : 'false'
  @sap.label : 'Description'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Desc : LargeString not null;
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.pageable : 'false'
@sap.addressable : 'false'
@sap.content.version : '1'
entity ZODATA_INTERNAL_ORDER_SRV.DivisionF4Set {
  @sap.unicode : 'false'
  @sap.label : 'Division'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  key Div : LargeString not null;
  @sap.unicode : 'false'
  @sap.label : 'Description'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Desc : LargeString not null;
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.pageable : 'false'
@sap.addressable : 'false'
@sap.content.version : '1'
entity ZODATA_INTERNAL_ORDER_SRV.BusinessReasonF4Set {
  @sap.unicode : 'false'
  @sap.label : 'Business Reason'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  key BusReason : LargeString not null;
  @sap.unicode : 'false'
  @sap.label : 'Description'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Desc : LargeString not null;
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.pageable : 'false'
@sap.addressable : 'false'
@sap.content.version : '1'
entity ZODATA_INTERNAL_ORDER_SRV.MasterDataSet {
  @sap.unicode : 'false'
  @sap.label : 'Order Type'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  key orderType : LargeString not null;
  @sap.unicode : 'false'
  @sap.label : 'Company Code'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  key companyCode : LargeString not null;
  @sap.unicode : 'false'
  @sap.label : 'site'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  key site : LargeString not null;
  @sap.unicode : 'false'
  @sap.label : 'division'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  key division : LargeString not null;
  @sap.unicode : 'false'
  @sap.label : 'Order Number'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  orderNumber : LargeString not null;
  @sap.unicode : 'false'
  @sap.label : 'description'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  description : LargeString not null;
  @sap.unicode : 'false'
  @sap.label : 'businessReason'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  businessReason : LargeString not null;
  @sap.unicode : 'false'
  @sap.label : 'currency'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  currency : LargeString not null;
  @sap.unicode : 'false'
  @sap.label : 'appropriationLife'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  appropriationLife : Integer64 not null;
  @sap.unicode : 'false'
  @sap.label : 'downtime'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  downtime : Integer64 not null;
  @sap.unicode : 'false'
  @sap.label : 'amount'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  amount : Decimal(31, 0) not null;
  @sap.unicode : 'false'
  @sap.label : 'millLabor'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  millLabor : Decimal(31, 0) not null;
  @sap.unicode : 'false'
  @sap.label : 'maintenanceLabor'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  maintenanceLabor : Decimal(31, 0) not null;
  @sap.unicode : 'false'
  @sap.label : 'operationsLabor'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  operationsLabor : Decimal(31, 0) not null;
  @sap.unicode : 'false'
  @sap.label : 'outsideContract'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  outsideContract : Decimal(31, 0) not null;
  @sap.unicode : 'false'
  @sap.label : 'materialCost'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  materialCost : Decimal(31, 0) not null;
  @sap.unicode : 'false'
  @sap.label : 'hardwareCost'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  hardwareCost : Decimal(31, 0) not null;
  @sap.unicode : 'false'
  @sap.label : 'softwareCost'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  softwareCost : Decimal(31, 0) not null;
  @sap.unicode : 'false'
  @sap.label : 'contingencyCost'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  contingencyCost : Decimal(31, 0) not null;
  @sap.unicode : 'false'
  @sap.label : 'totalCost'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  totalCost : Decimal(31, 0) not null;
  @sap.unicode : 'false'
  @sap.label : 'profitImprovementPct'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  profitImprovementPct : Decimal(31, 0) not null;
  @sap.unicode : 'false'
  @sap.label : 'profitImprovementNPV'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  profitImprovementNPV : Decimal(31, 0) not null;
  @sap.unicode : 'false'
  @sap.label : 'paybackWithTaxes'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  paybackWithTaxes : Decimal(31, 0) not null;
  @sap.unicode : 'false'
  @sap.label : 'paybackWithoutTaxes'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  paybackWithoutTaxes : Decimal(31, 0) not null;
  @sap.unicode : 'false'
  @sap.label : 'oneTimeExpenses'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  oneTimeExpenses : Decimal(31, 0) not null;
  @sap.unicode : 'false'
  @sap.label : 'recurringExpenses'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  recurringExpenses : Decimal(31, 0) not null;
  @odata.Type : 'Edm.DateTime'
  @sap.unicode : 'false'
  @sap.label : 'startupDate'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  startupDate : DateTime;
  @sap.unicode : 'false'
  @sap.label : 'strategic'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  strategic : Boolean;
  @sap.unicode : 'false'
  @sap.label : 'businessSustaining'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  businessSustaining : Boolean;
  @sap.unicode : 'false'
  @sap.label : 'mandatory'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  mandatory : Boolean;
  @sap.unicode : 'false'
  @sap.label : 'profitImprovement'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  profitImprovement : Boolean;
  @sap.unicode : 'false'
  @sap.label : 'environmentalImpacts'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  environmentalImpacts : Boolean;
  @sap.unicode : 'false'
  @sap.label : 'safetyImplications'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  safetyImplications : Boolean;
  @sap.unicode : 'false'
  @sap.label : 'creditPotential'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  creditPotential : Boolean;
  @sap.unicode : 'false'
  @sap.label : 'insuranceApproval'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  insuranceApproval : Boolean;
  @sap.unicode : 'false'
  @sap.label : 'businessArea'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  businessArea : LargeString not null;
  @sap.unicode : 'false'
  @sap.label : 'controllingArea'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  controllingArea : LargeString not null;
  @sap.unicode : 'false'
  @sap.label : 'status'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  status : LargeString not null;
  @sap.unicode : 'false'
  @sap.label : 'stonr'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  stonr : LargeString not null;
  @sap.unicode : 'false'
  @sap.label : 'user name'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  userName : LargeString not null;
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.pageable : 'false'
@sap.addressable : 'false'
@sap.content.version : '1'
entity ZODATA_INTERNAL_ORDER_SRV.ChangeStatusSet {
  @sap.unicode : 'false'
  @sap.label : 'orderNumber'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  key orderNumber : LargeString not null;
  @sap.unicode : 'false'
  @sap.label : 'status'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  status : LargeString not null;
  @sap.unicode : 'false'
  @sap.label : 'message'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  message : LargeString not null;
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.pageable : 'false'
@sap.addressable : 'false'
@sap.content.version : '1'
entity ZODATA_INTERNAL_ORDER_SRV.CurrencyF4Set {
  @sap.unicode : 'false'
  @sap.label : 'currency'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  key Waers : LargeString not null;
  @sap.unicode : 'false'
  @sap.label : 'description'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Desc : LargeString not null;
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.pageable : 'false'
@sap.addressable : 'false'
@sap.content.version : '1'
entity ZODATA_INTERNAL_ORDER_SRV.ApproverLevelsSet {
  @sap.unicode : 'false'
  @sap.label : 'Site'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  key Site : LargeString not null;
  @sap.unicode : 'false'
  @sap.label : 'Level'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  key Level : LargeString not null;
  @sap.unicode : 'false'
  @sap.label : 'Email'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  key Email : LargeString not null;
  @sap.unicode : 'false'
  @sap.label : 'Order Type'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  key OrderType : LargeString not null;
  @sap.unicode : 'false'
  @sap.label : 'Order'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  key Order : LargeString not null;
  @sap.unicode : 'false'
  @sap.label : 'Amount'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Amount : LargeString not null;
  @sap.unicode : 'false'
  @sap.label : 'Currency'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Currency : LargeString not null;
  @sap.unicode : 'false'
  @sap.label : 'Division'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Division : LargeString not null;
  @sap.unicode : 'false'
  @sap.label : 'Estat'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Estat : LargeString not null;
  @sap.unicode : 'false'
  @sap.label : 'Name'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Name : LargeString not null;
  @sap.unicode : 'false'
  @sap.label : 'Message'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Message : LargeString not null;
  @sap.unicode : 'false'
  @sap.label : 'InternalLevel'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  InternalLevel : LargeString not null;
  @sap.unicode : 'false'
  @sap.label : 'Create'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Create : LargeString not null;
  @sap.unicode : 'false'
  @sap.label : 'Approve'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Approve : LargeString not null;
  @sap.unicode : 'false'
  @sap.label : 'Display'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Display : LargeString not null;
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.pageable : 'false'
@sap.addressable : 'false'
@sap.content.version : '1'
entity ZODATA_INTERNAL_ORDER_SRV.UserRolesSet {
  @sap.unicode : 'false'
  @sap.label : 'Email'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  key Email : LargeString not null;
  @sap.unicode : 'false'
  @sap.label : 'Display'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Display : LargeString not null;
  @sap.unicode : 'false'
  @sap.label : 'Create'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Create : LargeString not null;
  @sap.unicode : 'false'
  @sap.label : 'Approve'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Approve : LargeString not null;
  @sap.unicode : 'false'
  @sap.label : 'Name'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Name : LargeString not null;
  @sap.unicode : 'false'
  @sap.label : 'Message'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Message : LargeString not null;
};

