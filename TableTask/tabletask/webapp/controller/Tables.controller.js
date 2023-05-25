sap.ui.define([
	'sap/ui/core/mvc/Controller',
	'sap/ui/export/library',
	'sap/ui/export/Spreadsheet',
	'sap/m/MessageToast'
], function(Controller, exportLbriary, Spreadsheet, MessageToast) {
	'use strict';

	var EdmType = exportLibrary.EdmType;

	return Controller.extend('ns.tabletask.controller.Tables', {

		onInit: function() {
			// var oModel = new JSONModel(sap.ui.require.toUrl('sap/opu/odata/iwbep/GWSAMPLE_BASIC/BusinessPartnerSet/'))
			// console.log(1);
			// this.getView().setModel(oModel);
		},

		createColumnConfig: function() {
			return [
				{
					label: 'CompanyName',
					property: 'CompanyName',
                    type: EdmType.String,
					width: '25'
				},
				{
					label: 'PhoneNumber',
					property: 'PhoneNumber',
                    type: EdmType.String,
					width: '18'
				},
				{
                    label: 'EmailAddress',
					property: 'EmailAddress',
                    type: EdmType.String,
					width: '18'
				},
				{
					label: 'WebAddress',
					property: 'WebAddress',
                    type: EdmType.String,
					width: '25'
				},
				{
					label: 'City',
					property: 'Address/City',
                    type: EdmType.String,
					width: '25'
				}];
		},

		onExport: function() {
			var aCols, oBinding, oSettings, oSheet, oTable;

			oTable = this.getView().byId('table0');
			oBinding = oTable.getBinding('items');
			aCols = this.createColumnConfig();

			oSettings = {
				workbook: { columns: aCols },
				dataSource: oBinding
			};

			oSheet = new Spreadsheet(oSettings);
			oSheet.build()
				.then(function() {
					MessageToast.show('Spreadsheet export has finished');
				}).finally(function() {
					oSheet.destroy();
				});
		}
	});
});