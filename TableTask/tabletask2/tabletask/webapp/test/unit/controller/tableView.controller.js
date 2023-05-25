/*global QUnit*/

sap.ui.define([
	"tableTask/tabletask/controller/tableView.controller"
], function (Controller) {
	"use strict";

	QUnit.module("tableView Controller");

	QUnit.test("I should test the tableView controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
