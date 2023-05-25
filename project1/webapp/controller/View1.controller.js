sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
], function (Controller, MessageToast) {
    "use strict";

    return Controller.extend("project1.controller.View1", {
        onInit: function () {
        },
        onOpenDialog: function () {
            // create dialog lazily
            if (!this.pDialog) {
                this.pDialog = this.loadFragment({
                    name: "project1.view.Dialog"
                });
            }
            this.pDialog.then(function (oDialog) {
                oDialog.open();
            });
        },
        onPress: function () {
            this.pDialog.then(function (oDialog) {
                oDialog.close();
            });
            MessageToast.show("This is the message", {
                duration: 5000
            })
        },
        onPressClose: function () {
            this.pDialog.then(function (oDialog) {
                oDialog.close();
            });
        }
    });
});
