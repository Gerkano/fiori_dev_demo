sap.ui.define(['sap/ui/core/format/DateFormat'], function (DateFormat) {
	"use strict";
	return {
       date: function(oDate) {
                console.log('dateformated');
                var oDateFormat = DateFormat.getDateInstance({
                    pattern: "YYYY-MM-ddThh:mm"
                });

                return oDateFormat.format(oDate)

            } 
    }});