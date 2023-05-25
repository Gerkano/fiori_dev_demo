/*global QUnit*/

sap.ui.define([
	"ns/tabletask/controller/Tables.controller"
], function (Controller) {
	"use strict";

	QUnit.module("Tables Controller");

	QUnit.test("I should test the Tables controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
