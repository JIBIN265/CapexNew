sap.ui.define(["sap/fe/core/PageController"],function(e){"use strict";return e.extend("zcapexcreator.ext.view.ViewPdfPage",{onInit:function(){e.prototype.onInit.apply(this,arguments)},handleFullScreen:function(e){this.editFlow.getInternalRouting().switchFullScreen();this.byId("zcapexcreator::attachmentsViewPdfPagePage--enterFullScreenBtn").setVisible(false);this.byId("zcapexcreator::attachmentsViewPdfPagePage--exitFullScreenBtn").setVisible(true)},handleExitFullScreen:function(e){this.editFlow.getInternalRouting().switchFullScreen();this.byId("zcapexcreator::attachmentsViewPdfPagePage--enterFullScreenBtn").setVisible(true);this.byId("zcapexcreator::attachmentsViewPdfPagePage--exitFullScreenBtn").setVisible(false)},handleClose:function(e){this.editFlow.getInternalRouting().closeColumn()},onBack:function(e){var t=e.getSource().getBindingContext();if(t){this.editFlow.getInternalRouting().navigateBackFromContext(t)}}})});
//# sourceMappingURL=ViewPdfPage.controller.js.map