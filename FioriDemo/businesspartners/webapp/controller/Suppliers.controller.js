sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",

],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, MessageToast) {
        "use strict";

        return Controller.extend("ns.businesspartners.controller.Suppliers", {
            onInit: function () {

            },
            onListItemPressed : function(oEvent){

                MessageToast.show("Button pressed")
                var oItem, oCtx;
                oItem = oEvent.getSource();
                oCtx = oItem.getBindingContext();

                this.getOwnerComponent().getRouter().navTo("RouteSupplier",{
                    supplierId : oCtx.getProperty("BusinessPartnerID")
                })
                MessageToast.show("routing")
            }});
    
    });
