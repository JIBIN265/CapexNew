sap.ui.define(["sap/ui/core/mvc/ControllerExtension"],function(e){"use strict";return e.extend("zcapexmain.ext.controller.CapexObjectPageCustom",{override:{onInit:function(){var e=this.base.getExtensionAPI().getModel()},routing:{onAfterBinding:async function(e){if(!e){return}try{const s=this.base.getExtensionAPI(),t=s.getModel(),n=s,o="getMessages",r=t.bindContext(`/${o}(...)`),i={N:{type:sap.ui.core.MessageType.Information,key:"isInProgress"},X:{type:sap.ui.core.MessageType.Error,key:"notes"},I:{type:sap.ui.core.MessageType.Warning,key:"isRejectionIncomplete"},D:{type:sap.ui.core.MessageType.None,key:"isDraft"},R:{type:sap.ui.core.MessageType.None,key:"isRejectionFinal"},A:{type:sap.ui.core.MessageType.Success,key:"isApproved"}};debugger;const a=t.bindContext(e.getPath());a.requestObject().then(e=>{const s=n.getModel("i18n").getResourceBundle();const t=e["status"];if(t&&i[t]){const{type:o,key:r}=i[t];const a=r==="notes"?e[r]:s.getText(r);const c=new sap.ui.core.message.Message({type:o,message:a});n.showMessages([c])}})}catch(e){console.error("You should have no error",e.message)}}}}})});
//# sourceMappingURL=CapexObjectPageCustom.controller.js.map