sap.ui.define([
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/core/Fragment"
], function (MessageToast, MessageBox, Fragment) {
    'use strict';

    return {
        onPost: async function (oEvent) {
            debugger;
            MessageToast.show("Adding comment.");
            // Get the control that fired the event
            var oControl = oEvent.getSource();

            // Get the binding context of the control
            var oContext = oControl.getBindingContext();
            if (!oContext) {
                MessageToast.show("No context found.");
                return;
            }
            var sNewComment = oControl.getValue();
            var sValue = oEvent.getParameter("value");

            // Prepare the new comment entry
            var oNewComment = {
                text: sNewComment,
                // Add other required properties if needed
            };

            // Get the ODataModel from the context
            var oModel = oContext.getModel();
            var sPath = oContext.getPath() + "/to_Comments";

            // Get the binding context for 'to_Comments'
            var oListBinding = oModel.bindList(sPath, oContext);

            // Prepare the new comment entry
            var oNewComment = {
                text: sNewComment,
                // Add other required properties if needed
            };
            debugger;
            try {
                // Create the new entry in the context
                await oListBinding.create(oNewComment);

                // Submit changes
                await oModel.submitBatch(oModel.getUpdateGroupId());

                MessageToast.show("Comment added successfully!");
                oControl.setValue(""); // Clear the input field

                const oList = this.byId('zcapexcreator::CapexObjectPage--fe::CustomSubSection::Feed--commentsList');
                if (oList) {
                    oContext.refresh();
                } else {
                    MessageToast.show("Unable to refresh the comments list.");
                }

            } catch (oError) {
                MessageToast.show(oError.message);
            }
        },
    };
});
