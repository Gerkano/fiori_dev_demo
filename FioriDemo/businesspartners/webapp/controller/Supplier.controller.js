sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("ns.businesspartners.controller.Supplier", {
            onInit: function () {
                var oRouter = this.getOwnerComponent().getRouter();

			oRouter.getRoute("RouteSupplier").attachMatched(this._onRouteMatched, this);
            },
            _onRouteMatched: function (oEvent) {
                var oArgs, oView;

                oArgs = oEvent.getParameter("arguments");
                oView = this.getView();
                console.log(1);
                console.log(oArgs.supplierId);
                oView.bindElement({
                    path: "/BusinessPartnerSet('" + oArgs.supplierId + "')",
                    events: {
                        change: this._onBindingChange.bind(this),
                        dataRequested: function (oEvent) {
                            oView.setBusy(true);
                        },
                        dataReceived: function (oEvent) {
                            oView.setBusy(false);
                        }
                    }

                });

            },

		_onBindingChange : function (oEvent) {
			// No data for the binding
            console.log(2);
			if (!this.getView().getBindingContext()) {
				this.getOwnerComponent().getRouter().getTargets().display("notFound");
			}
		}
        })
    });
