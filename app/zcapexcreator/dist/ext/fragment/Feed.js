sap.ui.define(["sap/m/MessageToast","sap/m/MessageBox","sap/ui/core/Fragment"],function(e,t,a){"use strict";return{onPost:async function(t){debugger;e.show("Adding comment.");var a=t.getSource();var s=a.getBindingContext();if(!s){e.show("No context found.");return}var o=a.getValue();var r=t.getParameter("value");var n={text:o};var c=s.getModel();var i=s.getPath()+"/to_Comments";var u=c.bindList(i,s);var n={text:o};debugger;try{await u.create(n);await c.submitBatch(c.getUpdateGroupId());e.show("Comment added successfully!");a.setValue("");const t=this.byId("zcapexcreator::CapexObjectPage--fe::CustomSubSection::Feed--commentsList");if(t){s.refresh()}else{e.show("Unable to refresh the comments list.")}}catch(t){e.show(t.message)}}}});
//# sourceMappingURL=Feed.js.map