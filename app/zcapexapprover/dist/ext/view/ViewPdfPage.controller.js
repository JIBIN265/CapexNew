sap.ui.define(["sap/fe/core/PageController"],function(e){"use strict";return e.extend("zcapexapprover.ext.view.ViewPdfPage",{onInit:function(){e.prototype.onInit.apply(this,arguments)},handleFullScreen:function(e){this.editFlow.getInternalRouting().switchFullScreen();this.byId("zcapexapprover::attachmentsViewPdfPagePage--enterFullScreenBtn").setVisible(false);this.byId("zcapexapprover::attachmentsViewPdfPagePage--exitFullScreenBtn").setVisible(true)},handleExitFullScreen:function(e){this.editFlow.getInternalRouting().switchFullScreen();this.byId("zcapexapprover::attachmentsViewPdfPagePage--enterFullScreenBtn").setVisible(true);this.byId("zcapexapprover::attachmentsViewPdfPagePage--exitFullScreenBtn").setVisible(false)},handleClose:function(e){this.editFlow.getInternalRouting().closeColumn()},onBack:function(e){var t=e.getSource().getBindingContext();if(t){this.editFlow.getInternalRouting().navigateBackFromContext(t)}}})});
//# sourceMappingURL=ViewPdfPage.controller.js.map