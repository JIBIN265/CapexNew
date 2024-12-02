//@ui5-bundle zstatusvalues/Component-preload.js
sap.ui.require.preload({
	"zstatusvalues/Component.js":function(){
sap.ui.define(["sap/fe/core/AppComponent"],function(e){"use strict";return e.extend("zstatusvalues.Component",{metadata:{manifest:"json"}})});
},
	"zstatusvalues/i18n/i18n.properties":'# This is the resource bundle for zstatusvalues\n\n#Texts for manifest.json\n\n#XTIT: Application name\nappTitle=Maintain Default Status Values\n\n#YDES: Application description\nappDescription=Capex Default Status Values\n\n#XFLD,90\nflpTitle=Maintain Default Status Values\n',
	"zstatusvalues/manifest.json":'{"_version":"1.65.0","sap.app":{"id":"zstatusvalues","type":"application","i18n":"i18n/i18n.properties","applicationVersion":{"version":"0.0.1"},"title":"{{appTitle}}","description":"{{appDescription}}","resources":"resources.json","sourceTemplate":{"id":"@sap/generator-fiori:lrop","version":"1.15.6","toolsId":"9eac00e8-d6f7-42d3-8a36-68c73fba80cb"},"dataSources":{"mainService":{"uri":"odata/v4/capex-catalog/","type":"OData","settings":{"annotations":[],"odataVersion":"4.0"}}},"crossNavigation":{"inbounds":{"ZCapexStatus-manage":{"semanticObject":"ZCapexStatus","action":"manage","title":"{{flpTitle}}","signature":{"parameters":{},"additionalParameters":"allowed"}}}}},"sap.ui":{"technology":"UI5","icons":{"icon":"","favIcon":"","phone":"","phone@2":"","tablet":"","tablet@2":""},"deviceTypes":{"desktop":true,"tablet":true,"phone":true}},"sap.ui5":{"flexEnabled":true,"dependencies":{"minUI5Version":"1.131.0","libs":{"sap.m":{},"sap.ui.core":{},"sap.fe.templates":{}}},"contentDensities":{"compact":true,"cozy":true},"models":{"i18n":{"type":"sap.ui.model.resource.ResourceModel","settings":{"bundleName":"zstatusvalues.i18n.i18n"}},"":{"dataSource":"mainService","preload":true,"settings":{"operationMode":"Server","autoExpandSelect":true,"earlyRequests":true}},"@i18n":{"type":"sap.ui.model.resource.ResourceModel","uri":"i18n/i18n.properties"}},"resources":{"css":[]},"routing":{"config":{},"routes":[{"pattern":":?query:","name":"StatusValuesList","target":"StatusValuesList"},{"pattern":"StatusValues({key}):?query:","name":"StatusValuesObjectPage","target":"StatusValuesObjectPage"}],"targets":{"StatusValuesList":{"type":"Component","id":"StatusValuesList","name":"sap.fe.templates.ListReport","options":{"settings":{"contextPath":"/StatusValues","variantManagement":"Page","navigation":{"StatusValues":{"detail":{"route":"StatusValuesObjectPage"}}},"controlConfiguration":{"@com.sap.vocabularies.UI.v1.LineItem":{"tableSettings":{"type":"ResponsiveTable"}}}}}},"StatusValuesObjectPage":{"type":"Component","id":"StatusValuesObjectPage","name":"sap.fe.templates.ObjectPage","options":{"settings":{"editableHeaderContent":false,"contextPath":"/StatusValues"}}}}}},"sap.fiori":{"registrationIds":[],"archeType":"transactional"},"sap.cloud":{"public":true,"service":"hana.app"}}'
});
//# sourceMappingURL=Component-preload.js.map