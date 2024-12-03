//@ui5-bundle zcapexmain/Component-preload.js
sap.ui.require.preload({
	"zcapexmain/Component.js":function(){
sap.ui.define(["sap/fe/core/AppComponent"],function(e){"use strict";return e.extend("zcapexmain.Component",{metadata:{manifest:"json"}})});
},
	"zcapexmain/ext/controller/CapexListReportCustom.controller.js":function(){
sap.ui.define(["sap/ui/core/mvc/ControllerExtension"],function(e){"use strict";return e.extend("zcapexmain.ext.controller.CapexListReportCustom",{override:{onInit:function(){var e=this.base.getExtensionAPI().getModel()}}})});
},
	"zcapexmain/ext/controller/CapexObjectPageCustom.controller.js":function(){
sap.ui.define(["sap/ui/core/mvc/ControllerExtension"],function(e){"use strict";return e.extend("zcapexmain.ext.controller.CapexObjectPageCustom",{override:{onInit:function(){var e=this.base.getExtensionAPI().getModel()},routing:{onAfterBinding:async function(e){if(!e){return}try{const s=this.base.getExtensionAPI(),t=s.getModel(),n=s,o="getMessages",r=t.bindContext(`/${o}(...)`),i={N:{type:sap.ui.core.MessageType.Information,key:"isInProgress"},X:{type:sap.ui.core.MessageType.Error,key:"notes"},I:{type:sap.ui.core.MessageType.Warning,key:"isRejectionIncomplete"},D:{type:sap.ui.core.MessageType.Warning,key:"isDraft"},R:{type:sap.ui.core.MessageType.None,key:"isRejectionFinal"},A:{type:sap.ui.core.MessageType.Success,key:"isApproved"}};debugger;const a=t.bindContext(e.getPath());a.requestObject().then(e=>{const s=n.getModel("i18n").getResourceBundle();const t=e["status"];if(t&&i[t]){const{type:o,key:r}=i[t];const a=r==="notes"?e[r]:s.getText(r);const c=new sap.ui.core.message.Message({type:o,message:a});n.showMessages([c])}})}catch(e){console.error("You should have no error",e.message)}}}}})});
},
	"zcapexmain/ext/fragment/Feed.fragment.xml":'<core:FragmentDefinition xmlns:core="sap.ui.core"\n    xmlns="sap.m"\n    xmlns:l="sap.ui.layout"\n    displayBlock="true"><l:VerticalLayout core:require="{handler: \'zcapexmain/ext/fragment/Feed\'}"\n                      id="verticalLayout"\n                      class="sapUiContentPadding"\n                      width="100%"><l:content><FeedInput \n                id="feedInput"\n                enabled="{= ${ui>/editMode} === \'Editable\'}"\n                post="handler.onPost"\n                icon="test-resources/sap/m/images/dronning_victoria.jpg"\n                class="sapUiSmallMarginTopBottom"/><List id="commentsList" headerText="Comments" showSeparators="Inner" \n            items="{path: \'to_Comments\', templateShareable: false, sorter: { path: \'modifiedAt\', descending: true } }" ><items  ><FeedListItem  \n                id="feedListItemTemplate"\n                sender="{createdBy}"\n                icon="{icon}"\n                info="{info}"\n                timestamp="{modifiedAt}"\n                text="{text}"\n                convertLinksToAnchorTags="All" /></items></List></l:content></l:VerticalLayout></core:FragmentDefinition>\n',
	"zcapexmain/ext/fragment/Feed.js":function(){
sap.ui.define(["sap/m/MessageToast","sap/m/MessageBox","sap/ui/core/Fragment"],function(e,t,a){"use strict";return{onPost:async function(t){debugger;e.show("Adding comment.");var a=t.getSource();var s=a.getBindingContext();if(!s){e.show("No context found.");return}var o=a.getValue();var r=t.getParameter("value");var n={text:o};var i=s.getModel();var c=s.getPath()+"/to_Comments";var u=i.bindList(c,s);var n={text:o};debugger;try{await u.create(n);await i.submitBatch(i.getUpdateGroupId());e.show("Comment added successfully!");a.setValue("");const t=this.byId("zcapexmain::CapexObjectPage--fe::CustomSubSection::Feed--commentsList");if(t){s.refresh()}else{e.show("Unable to refresh the comments list.")}}catch(t){e.show(t.message)}}}});
},
	"zcapexmain/ext/fragment/Viewpdf.fragment.xml":'<core:FragmentDefinition xmlns:core="sap.ui.core" xmlns:m="sap.ui.model" xmlns:mvc="sap.ui.core.mvc" xmlns="sap.m"><Dialog \n        core:require="{handler: \'zcapexmain/ext/fragment/Viewpdf\'}"\n        id="pdfDialog" \n        title="PDF Viewer"\n        \n        class="sapUiResponsivePadding--header sapUiResponsivePadding--content"\n        afterClose="onDialogClose" draggable="true" contentHeight="600px" \n        contentWidth="600px" resizable= "true" ><content><PDFViewer\n                id="pdfViewer" \n                source="" \n                isTrustedSource="true"\n\n                displayType="Embedded"\n                height="600px"\n                width="600px"><layoutData><FlexItemData id="_IDGenFlexItemData1" growFactor="1" /></layoutData></PDFViewer></content><endButton><Button id="_IDGenButton"  \n            text="Close"\n             tooltip="Close"\n             icon="sap-icon://cancel" \n             type="Reject" \n             press="onClose"/></endButton></Dialog></core:FragmentDefinition>\n',
	"zcapexmain/ext/fragment/Viewpdf.js":function(){
sap.ui.define(["sap/m/MessageToast","sap/ui/core/Fragment","sap/m/Button"],function(o,e,t){"use strict";return{viewpdf:function(n,i){o.show("Custom handler invoked.");const a=i[0];if(!a){o.show("No context found.");return}var s=a.getProperty("content");var c=this;if(!this.oDialog){e.load({id:"pdfDialog",name:"zcapexmain.ext.fragment.Viewpdf",type:"XML",controller:this}).then(function(o){c.oDialog=o;var n=e.byId("pdfDialog","pdfViewer");n.setSource(s);var i=new t({text:"Close",icon:"sap-icon://cancel",type:"Reject",press:function(){c.oDialog.close()}});o.addButton(i);c.oDialog.open()}).catch(function(e){o.show("Error loading PDF Viewer: "+e.message)})}else{var r=e.byId("pdfDialog","pdfViewer");r.setSource(s);this.oDialog.open()}},onClose:function(){this.oDialog.close();o.show("Dialog closed via End button.")},onDialogClose:function(){o.show("Dialog closed.")}}});
},
	"zcapexmain/ext/view/ViewPdfPage.controller.js":function(){
sap.ui.define(["sap/fe/core/PageController"],function(e){"use strict";return e.extend("zcapexmain.ext.view.ViewPdfPage",{onInit:function(){e.prototype.onInit.apply(this,arguments)},handleFullScreen:function(e){this.editFlow.getInternalRouting().switchFullScreen();this.byId("zcapexmain::attachmentsViewPdfPagePage--enterFullScreenBtn").setVisible(false);this.byId("zcapexmain::attachmentsViewPdfPagePage--exitFullScreenBtn").setVisible(true)},handleExitFullScreen:function(e){this.editFlow.getInternalRouting().switchFullScreen();this.byId("zcapexmain::attachmentsViewPdfPagePage--enterFullScreenBtn").setVisible(true);this.byId("zcapexmain::attachmentsViewPdfPagePage--exitFullScreenBtn").setVisible(false)},handleClose:function(e){this.editFlow.getInternalRouting().closeColumn()},onBack:function(e){var t=e.getSource().getBindingContext();if(t){this.editFlow.getInternalRouting().navigateBackFromContext(t)}}})});
},
	"zcapexmain/ext/view/ViewPdfPage.view.xml":'<mvc:View xmlns:core="sap.ui.core"\n    xmlns:mvc="sap.ui.core.mvc"\n    xmlns="sap.m"\n    xmlns:macros="sap.fe.macros"\n    xmlns:html="http://www.w3.org/1999/xhtml" controllerName="zcapexmain.ext.view.ViewPdfPage"><Page id="ViewPdfPage" title="{i18n>ViewPdfPageTitle}" showNavButton="true" navButtonPress=".onBack" enableScrolling="true"><headerContent><OverflowToolbar id="_IDGenOverflowToolbar1"><OverflowToolbarButton type="Transparent" icon="sap-icon://full-screen" press=".handleFullScreen" id="enterFullScreenBtn" tooltip="Enter Full Screen Mode" visible="true"/><OverflowToolbarButton type="Transparent" icon="sap-icon://exit-full-screen" press=".handleExitFullScreen" id="exitFullScreenBtn" tooltip="Exit Full Screen Mode" visible="false"/><OverflowToolbarButton type="Transparent" icon="sap-icon://decline" press=".handleClose" id="_IDGenOverflowToolbarButton" tooltip="Close middle column" visible="true"/></OverflowToolbar></headerContent><content><FlexBox id="_IDGenFlexBox" direction="Column" renderType="Div" class="sapUiSmallMargin" fitContainer="true"><PDFViewer id="_IDGenPDFViewer" source="{content}" isTrustedSource="true" loaded=".isLoaded" height="700px" width="auto" title="{status}"><layoutData><FlexItemData id="_IDGenFlexItemData" growFactor="1"/></layoutData></PDFViewer></FlexBox></content></Page></mvc:View>',
	"zcapexmain/i18n/customI18N.properties":'## Search-Term: "enhanceI18n"\nC_COMMON_ACTION_PARAMETER_DIALOG_CANCEL=Custom cancel text\nC_OPERATIONS_ACTION_CONFIRM_MESSAGE|RootEntities|criticalAction=Custom text for the critical action message\nC_TRANSACTION_HELPER_OBJECT_PAGE_CONFIRM_DELETE_WITH_OBJECTTITLE_SINGULAR|RootEntities=Custom text for the delete RootEntities message\nC_COMMON_DIALOG_OK=Agree\nNEW_OBJECT=New Order\nC_TRANSACTION_HELPER_OBJECT_CREATED=Order Submitted to SAP for Activation\nC_TRANSACTION_HELPER_OBJECT_SAVED=Order Saved\nT_ANNOTATION_HELPER_DEFAULT_HEADER_TITLE_NO_HEADER_INFO=No Order Description\nT_OP_OBJECT_PAGE_SAVE=Save Order\nT_OP_RELATED_APPS=Related Apps\nT_NEW_OBJECT=New Order\nM_ILLUSTRATEDMESSAGE_DESCRIPTION=This may happen if your access is restricted or the data is incomplete.\nM_COMMON_TABLE_CREATE=+ Order\n#XMSG: Messagebox text for confirming an action question \nC_OPERATIONS_ACTION_CONFIRM_MESSAGE|Capex|approve=Confirm Capex Order Approval?',
	"zcapexmain/i18n/customI18N_en.properties":'C_COMMON_ACTION_PARAMETER_DIALOG_CANCEL=Cancel Rejection\nC_OPERATIONS_ACTION_CONFIRM_MESSAGE|RootEntities|criticalAction=Custom text for the critical action message\nC_TRANSACTION_HELPER_OBJECT_PAGE_CONFIRM_DELETE_WITH_OBJECTTITLE_SINGULAR|Capex=Confirm Order Delete\nC_COMMON_DIALOG_OK=Agree\nNEW_OBJECT=New Order\nC_TRANSACTION_HELPER_OBJECT_CREATED=Order submitted to SAP\nC_TRANSACTION_HELPER_OBJECT_SAVED=Order Saved\nT_ANNOTATION_HELPER_DEFAULT_HEADER_TITLE_NO_HEADER_INFO=No Order Description\nT_OP_OBJECT_PAGE_SAVE=Submit Order\nT_OP_OBJECT_PAGE_CREATE=Submit Order to SAP\nT_OP_RELATED_APPS=Related Apps\nT_NEW_OBJECT=New Order\nM_ILLUSTRATEDMESSAGE_DESCRIPTION=This may happen if your access is restricted or the data is incomplete.\nM_COMMON_TABLE_CREATE|Capex=+ Order\nM_COMMON_TABLE_CREATE|to_CashFlowYear=+ Year\nM_COMMON_TABLE_CREATE|to_Objectives=+ Objective\nM_COMMON_TABLE_CREATE|to_Attachments=+ Attachments\nST_DRAFT_DATALOSS_CREATE_ENTITY_TOL|Capex=Create the Order\nST_DRAFT_DATALOSS_POPUP_MESSAGE_CREATE|Capex=You haven\'t created this Order yet.What would you like to do?\nM_TABLE_AND_CHART_NO_FILTERS_NO_DATA_TEXT|to_CashFlowYear=Add an year\nM_TABLE_AND_CHART_NO_FILTERS_NO_DATA_TEXT|to_Objectives=Add an objective\nT_TABLE_AND_CHART_NO_DATA_TEXT_WITH_FILTER|Capex=No Orders found. Try adjusting the search or filter parameters.\n#XMSG: Messagebox text for confirming an action question \nC_OPERATIONS_ACTION_CONFIRM_MESSAGE|Capex|approve=Confirm Capex Order Approval?',
	"zcapexmain/i18n/i18n.properties":'# This is the resource bundle for zcapexmain\n\n#Texts for manifest.json\n\n#XTIT: Application name\nappTitle=Kruger Capital Expenditure Approval Process\n\n#YDES: Application description\nappDescription=Kruger Capital Expenditure Approval Process\n\n#XFLD,64.5\nflpTitle=Kruger Capital Expenditure Approval Process\n',
	"zcapexmain/i18n/i18n_en.properties":'# This is the resource bundle for zcapexmain\n\n#Texts for manifest.json\n\n#XTIT: Application name\nappTitle=Kruger Capital Expenditure Superuser Hub\n\n#YDES: Application description\nappDescription=Kruger Capital Expenditure Superuser Hub\n\n#XFLD,64.5\nflpTitle=Kruger Capital Expenditure Superuser Hub\n\nreject=Reject\nhasErrors=This report was rejected by SAP due to XYZ\n\nisDraft=Attachment is mandatory for expenditure submission.\nisRejectionFinal=This order has been finally rejected.\nisRejectionIncomplete=This order has an incomplete rejection.\nisInProgress=This order has been submitted for Approval.\nisApproved=This is an approved order. Edit with caution.\ninProgress=Orders in progress: {0}\napprovedOrders=Approved orders: {0}\nrejectFinal=Final rejected orders: {0}\nrejectIncomplete=Incomplete rejected orders: {0}\n\nClose=Close\n\t\t\t\t\t\t\t\n',
	"zcapexmain/manifest.json":'{"_version":"1.65.0","sap.app":{"id":"zcapexmain","type":"application","i18n":{"bundleName":"zcapexmain.i18n.i18n","supportedLocales":["en","fr"],"fallbackLocale":"en"},"applicationVersion":{"version":"0.0.1"},"title":"{{appTitle}}","description":"{{appDescription}}","resources":"resources.json","sourceTemplate":{"id":"@sap/generator-fiori:lrop","version":"1.15.6","toolsId":"745fec8d-a032-48f5-b88f-0b24fa775e74"},"dataSources":{"mainService":{"uri":"odata/v4/capex-catalog/","type":"OData","settings":{"annotations":[],"odataVersion":"4.0"}}},"crossNavigation":{"inbounds":{"ZCapexMain-manage":{"semanticObject":"ZCapexMain","action":"manage","title":"{{flpTitle}}","signature":{"parameters":{},"additionalParameters":"allowed"}}}}},"sap.ui":{"technology":"UI5","icons":{"icon":"","favIcon":"","phone":"","phone@2":"","tablet":"","tablet@2":""},"deviceTypes":{"desktop":true,"tablet":true,"phone":true}},"sap.ui5":{"flexEnabled":true,"dependencies":{"minUI5Version":"1.131.0","libs":{"sap.m":{},"sap.ui.core":{},"sap.fe.templates":{},"sap.f":{},"sap.fe.core":{}}},"contentDensities":{"compact":true,"cozy":true},"models":{"i18n":{"type":"sap.ui.model.resource.ResourceModel","settings":{"bundleName":"zcapexmain.i18n.i18n","supportedLocales":["en","fr"],"fallbackLocale":"en"}},"":{"dataSource":"mainService","preload":true,"settings":{"operationMode":"Server","autoExpandSelect":true,"earlyRequests":true}},"@i18n":{"type":"sap.ui.model.resource.ResourceModel","uri":"i18n/i18n.properties"}},"resources":{"css":[]},"routing":{"config":{"flexibleColumnLayout":{"defaultTwoColumnLayoutType":"TwoColumnsMidExpanded","defaultThreeColumnLayoutType":"ThreeColumnsMidExpanded"},"routerClass":"sap.f.routing.Router"},"routes":[{"pattern":":?query:","name":"CapexList","target":["CapexList"]},{"pattern":"Capex({key}):?query:","name":"CapexObjectPage","target":["CapexList","CapexObjectPage"]},{"pattern":"Capex({key})/to_CashFlowYear({key2}):?query:","name":"CashFlowYearObjectPage","target":["CapexList","CapexObjectPage","CashFlowYearObjectPage"]},{"name":"Capex_attachmentsViewPdfPagePage","pattern":"Capex({key})/attachments({attachmentsKey}):?query:","target":["CapexList","CapexObjectPage","Capex_attachmentsViewPdfPagePage"]}],"targets":{"CapexList":{"type":"Component","id":"CapexList","name":"sap.fe.templates.ListReport","options":{"settings":{"contextPath":"/Capex","enhanceI18n":"i18n/customI18N.properties","variantManagement":"Page","navigation":{"Capex":{"detail":{"route":"CapexObjectPage"}}},"controlConfiguration":{"@com.sap.vocabularies.UI.v1.SelectionFields":{"showClearButton":true,"filterFields":{"modifiedAt":{"settings":{"operatorConfiguration":[{"path":"key","equals":"TODAYXYDAYS","exclude":true},{"path":"key","equals":"LASTMINUTES","exclude":true},{"path":"key","equals":"NEXTDAYS","exclude":true},{"path":"key","equals":"TODAYFROMTO","exclude":true},{"path":"key","equals":"LASTDAYS","exclude":true},{"path":"key","equals":"LASTWEEKS","exclude":true},{"path":"key","equals":"LASTYEARS","exclude":true},{"path":"key","equals":"LASTMONTHS","exclude":true},{"path":"key","equals":"NEXTHOURS","exclude":true},{"path":"key","equals":"NEXTYEARS","exclude":true},{"path":"key","equals":"NEXTYEAR","exclude":true},{"path":"key","equals":"LASTHOURS","exclude":true},{"path":"key","equals":"NEXTMINUTES","exclude":true},{"path":"key","equals":"NEXTWEEK","exclude":true},{"path":"key","equals":"NEXTWEEKS","exclude":true},{"path":"key","equals":"NEXTMONTH","exclude":true},{"path":"key","equals":"NEXTMONTHS","exclude":true},{"path":"key","equals":"THISQUARTER","exclude":true},{"path":"key","equals":"LASTQUARTER","exclude":true},{"path":"key","equals":"LASTQUARTERS","exclude":true},{"path":"key","equals":"NEXTQUARTER","exclude":true},{"path":"key","equals":"NEXTQUARTERS","exclude":true},{"path":"key","equals":"QUARTER1","exclude":true},{"path":"key","equals":"QUARTER2","exclude":true},{"path":"key","equals":"QUARTER3","exclude":true},{"path":"key","equals":"QUARTER4","exclude":true}]}}}},"@com.sap.vocabularies.UI.v1.LineItem":{"tableSettings":{"type":"ResponsiveTable","enableExport":true,"selectAll":true,"enablePaste":true,"condensedTableLayout":true},"actions":{"MenuActions":{"text":"{i18n>reject}","menu":["DataFieldForAction::CapexCatalogService.rejectIncomplete","DataFieldForAction::CapexCatalogService.rejectFinal2"]},"DataFieldForAction::CapexCatalogService.approve":{"enableOnSelect":"single"},"DataFieldForAction::CapexCatalogService.copyCapex":{"enableOnSelect":"single","afterExecution":{"enableAutoScroll":true}}}}},"initialLoad":"Enabled"}},"controlAggregation":"beginColumnPages","contextPattern":""},"CapexObjectPage":{"type":"Component","id":"CapexObjectPage","name":"sap.fe.templates.ObjectPage","options":{"settings":{"editableHeaderContent":false,"enhanceI18n":"i18n/customI18N.properties","showRelatedApps":true,"contextPath":"/Capex","navigation":{"to_CashFlowYear":{"detail":{"route":"CashFlowYearObjectPage"}},"attachments":{"detail":{"route":"Capex_attachmentsViewPdfPagePage"}}},"controlConfiguration":{"@com.sap.vocabularies.UI.v1.FieldGroup#General2":{"fields":{"DataField::description":{"formatOptions":{"textLinesDisplay":1,"textMaxLines":"2","textLinesEdit":1,"textMaxLength":80,"textMaxCharactersDisplay":50,"textExpandBehaviorDisplay":"Popover"}}}},"@com.sap.vocabularies.UI.v1.FieldGroup#Notes":{"fields":{"DataField::notes":{"formatOptions":{"textLinesDisplay":2,"textMaxLines":"5","textLinesEdit":4,"textMaxLength":1000,"textMaxCharactersDisplay":300,"textExpandBehaviorDisplay":"Popover"}}}},"to_CashFlowYear/@com.sap.vocabularies.UI.v1.LineItem#AnnualCashFlow":{"tableSettings":{"creationMode":{"createAtEnd":true,"name":"InlineCreationRows"},"selectAll":true,"selectionMode":"Multi"}},"to_Objectives/@com.sap.vocabularies.UI.v1.LineItem#Objectives":{"tableSettings":{"selectionMode":"Multi","condensedTableLayout":true,"selectAll":true,"creationMode":{"createAtEnd":true,"name":"Inline"},"quickVariantSelection":{"paths":[{"annotationPath":"com.sap.vocabularies.UI.v1.SelectionVariant#SelectionVariantActive"},{"annotationPath":"com.sap.vocabularies.UI.v1.SelectionVariant#SelectionVariantExpired"},{"annotationPath":"com.sap.vocabularies.UI.v1.SelectionVariant#SelectionVariantAll"}]}},"actions":{"viewpdf":{"press":"zcapexmain.ext.controller.Viewpdf.viewpdf","visible":true,"enabled":true,"requiresSelection":true,"text":"View PDF"}}},"attachments/@com.sap.vocabularies.UI.v1.LineItem":{"actions":{"viewpdf":{"press":"zcapexmain.ext.fragment.Viewpdf.viewpdf","visible":true,"enableOnSelect":"single","enabled":true,"requiresSelection":true,"text":"View PDF"}}}},"content":{"header":{"actions":{"MenuActions":{"text":"{i18n>reject}","menu":["DataFieldForAction::CapexCatalogService.rejectIncomplete","DataFieldForAction::CapexCatalogService.rejectFinal2"]},"DataFieldForAction::CapexCatalogService.copyCapex":{"afterExecution":{"enableAutoScroll":true}}}},"body":{"sections":{"Feed":{"template":"zcapexmain.ext.fragment.Feed","position":{"placement":"After","anchor":"Attachments"},"title":"Feed"}}}}}},"controlAggregation":"midColumnPages","contextPattern":"/Capex({key})"},"CashFlowYearObjectPage":{"type":"Component","id":"CashFlowYearObjectPage","name":"sap.fe.templates.ObjectPage","options":{"settings":{"editableHeaderContent":false,"enhanceI18n":"i18n/customI18N.properties","contextPath":"/Capex/to_CashFlowYear"}},"controlAggregation":"endColumnPages","contextPattern":"/Capex({key})/to_CashFlowYear({key2})"},"Capex_attachmentsViewPdfPagePage":{"type":"Component","id":"Capex_attachmentsViewPdfPagePage","name":"sap.fe.core.fpm","controlAggregation":"endColumnPages","options":{"settings":{"viewName":"zcapexmain.ext.view.ViewPdfPage","contextPath":"/Capex/attachments"}},"contextPattern":"/Capex({key})/attachments({attachmentsKey})"}}},"rootView":{"viewName":"sap.fe.templates.RootContainer.view.Fcl","type":"XML","async":true,"id":"appRootView"},"extends":{"extensions":{"sap.ui.controllerExtensions":{"sap.fe.templates.ListReport.ListReportController#zcapexmain::CapexList":{"controllerName":"zcapexmain.ext.controller.CapexListReportCustom"},"sap.fe.templates.ObjectPage.ObjectPageController#zcapexmain::CapexObjectPage":{"controllerName":"zcapexmain.ext.controller.CapexObjectPageCustom"}}}}},"sap.fiori":{"registrationIds":[],"archeType":"transactional"},"sap.cloud":{"public":true,"service":"hana.app"}}'
});
//# sourceMappingURL=Component-preload.js.map
