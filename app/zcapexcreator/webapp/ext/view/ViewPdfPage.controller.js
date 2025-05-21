sap.ui.define(
    [
        'sap/fe/core/PageController'
    ],
    function (PageController) {
        'use strict';

        return PageController.extend('zcapexcreator.ext.view.ViewPdfPage', {
            /**
             * Called when a controller is instantiated and its View controls (if available) are already created.
             * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
             * @memberOf capex.ext.view.ViewPdfPage
             */
            onInit: function () {
                PageController.prototype.onInit.apply(this, arguments); // needs to be called to properly initialize the page controller
                // var oView = this.getView();

                // // Listen for binding changes and update the MIME type when the context is available
                // oView.attachEvent("modelContextChange", this._updateMimeType, this);
            },

            // _updateMimeType: function () {
            //     var oContext = this.getView().getBindingContext();
            //     if (oContext) {
            //         debugger
            //         var oData = oContext.getObject();
            //         if (oData.mimeType === "application/pdf" && oData.filename?.endsWith(".pdf")) {
            //             oContext.setProperty("mimeType", "application/octet-stream");
            //             debugger
            //             var oModel = this.getView().getModel();
            //             if (oModel.hasPendingChanges()) {
            //                 // If there are pending changes, wait for them to be submitted
            //                 debugger
            //                 oModel.submitBatch("$auto").then(function () {
            //                     // After batch is submitted, refresh the context
            //                     debugger
            //                     oContext.refresh();
            //                 }).catch(function (error) {
            //                     // Handle errors if the batch submission fails
            //                     console.error("Error submitting batch:", error);
            //                 });
            //             } else {
            //                 // If no pending changes, refresh immediately
            //                 oContext.refresh();
            //             }
            //         }
            //     }
            // },

            /**
             * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
             * (NOT before the first rendering! onInit() is used for that one!).
             * @memberOf capex.ext.view.ViewPdfPage
             */
            // onBeforeRendering: function () {
            //     debugger
            // },

            /**
             * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
             * This hook is the same one that SAPUI5 controls get after being rendered.
             * @memberOf capex.ext.view.ViewPdfPage
             */
            //  onAfterRendering: function() {
            //
            //  },

            /**
             * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
             * @memberOf capex.ext.view.ViewPdfPage
             */
            //  onExit: function() {
            //
            //  }
            handleFullScreen: function (oEvent) {
                this.editFlow.getInternalRouting().switchFullScreen()
                this.byId("zcapexcreator::attachmentsViewPdfPagePage--enterFullScreenBtn").setVisible(false)
                this.byId("zcapexcreator::attachmentsViewPdfPagePage--exitFullScreenBtn").setVisible(true)

            },

            handleExitFullScreen: function (oEvent) {
                this.editFlow.getInternalRouting().switchFullScreen()
                this.byId("zcapexcreator::attachmentsViewPdfPagePage--enterFullScreenBtn").setVisible(true)
                this.byId("zcapexcreator::attachmentsViewPdfPagePage--exitFullScreenBtn").setVisible(false)
            },

            handleClose: function (oEvent) {
                this.editFlow.getInternalRouting().closeColumn()
                //   await  this.editFlow.getInternalRouting().navigateToRoute("/")
            },

            onBack: function (oEvent) {
                var oContext = oEvent.getSource().getBindingContext();
                if (oContext) {
                    this.editFlow.getInternalRouting().navigateBackFromContext(oContext);
                    //Also works
                    // const routing = this.getExtensionAPI().getRouting();
                    // routing.navigateToRoute('salesorderObjectPage', {
                    //     "key": "ID=" + oContext.getProperty("up__ID") + ",IsActiveEntity=" + oContext.getProperty("IsActiveEntity")
                    // });
                }

            },

            isLoaded: function (oEvent) {
                debugger;
            },
            isError: function (oEvent) {
                 debugger;
             },
             isFormatError: function (oEvent) {
                debugger;
            },
            issourceValidationFailed: function (oEvent) {
                debugger;
            },
            modelContextChange: function (oEvent) {
                debugger;
            }

        });
    }
);
