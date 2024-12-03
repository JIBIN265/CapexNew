sap.ui.define(['sap/ui/core/mvc/ControllerExtension'], function (ControllerExtension) {
	'use strict';

	return ControllerExtension.extend('zcapexapprover.ext.controller.CapexListReportCustom', {
		// this section allows to extend lifecycle hooks or hooks provided by Fiori elements
		override: {
			/**
             * Called when a controller is instantiated and its View controls (if available) are already created.
             * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
             * @memberOf zcapexapprover.ext.controller.CapexListReportCustom
             */
			onInit: function () {
				// you can access the Fiori elements extensionAPI via this.base.getExtensionAPI
				var oModel = this.base.getExtensionAPI().getModel();
			},
			// routing: {
			// 	onAfterBinding: async function (oBindingContext) {
			// 		try {

			// 			const oExtensionAPI = this.base.getExtensionAPI(),
			// 				oModel = oExtensionAPI.getModel(),
			// 				extensionAPI = oExtensionAPI, // Store oExtensionAPI in a separate variable for closure
			// 				sFunctionName = "getStatusCount",
			// 				oFunction = oModel.bindContext(`/${sFunctionName}(...)`),
			// 				i18n = extensionAPI.getModel("i18n").getResourceBundle();

			// 			await oFunction.execute();

			// 			const oContext = oFunction.getBoundContext();

			// 			const oValue = oContext.getValue();
			// 			if (oValue) {
			// 				const sInProgressText = i18n.getText("inProgress", [oValue.inProgressCount]),
			// 					sApprovedText = i18n.getText("approvedOrders", [oValue.approvedCount]),
			// 					sRejectFinalText = i18n.getText("rejectFinal", [oValue.rejectFinalCount]),
			// 					sRejectIncompleteText = i18n.getText("rejectIncomplete", [oValue.rejectIncompleteCount]),
			// 					sMessage = `${sInProgressText}, ${sApprovedText}, ${sRejectFinalText}, ${sRejectIncompleteText}`;
			// 				var oMessage = {
			// 					message: sMessage,
			// 					type: sap.ui.core.MessageType.Information
			// 				}
			// 				function fnOnClose() { MessageToast.show("Custom message closed"); }

			// 				extensionAPI.setCustomMessage(oMessage, null, fnOnClose);
			// 			}

			// 		} catch (error) {
			// 			console.error('You should have no error', error.message);
			// 		}
			// 	}
			// }
		}
	});
});
