sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/unified/FileUploader"
],

    function (Controller, MessageToast, FileUploader) {
        "use strict";

        return Controller.extend("fileupload.controller.View1", {
            onInit: function () {

            },
            handleShowData: function () {
                var idFileUploader = this.getView().byId("fileUploader"); 
                var file =  idFileUploader.oFileUpload.files[0];
                var that = this;
                this.fileName = file.name;
                this.fileType = file.type;
                console.log(file);
                console.log(this.fileName);
                console.log(this.fileType);
                if (this.fileType === "text/csv") {
                    var reader = new FileReader();
                    reader.onload = function (e) {
                        var strCSV = e.currentTarget.result;
                        var arrCSV = strCSV.match(/[\w .]+(?=,?)/g);
                        var noOfCols = 3;
                        var hdrRow = arrCSV.splice(0, noOfCols);
                        var data = [];
                        while (arrCSV.length > 0) {
                            var obj = {};
                            var row = arrCSV.splice(0, noOfCols)
                            for (var i = 0; i < row.length; i++) {
                                obj[hdrRow[i]] = row[i].trim()
                            }
                            data.push(obj)
                        }
                        var oModel = new sap.ui.model.json.JSONModel();
                        oModel.setData(data);
                        var oTable = that.byId("table0");
                        oTable.setModel(oModel);
                        console.log(data)
                    }
                    reader.readAsBinaryString(file);
                }
                else if (this.fileType == "application/vnd.ms-excel") {
                    var reader = new FileReader();
			        var excelData = {};
                    reader.onload = function (e) {
                        var data = e.currentTarget.result;
                        var workbook = XLSX.read(data, {
                            type: 'binary'
                        });
                        workbook.SheetNames.forEach(function (sheetName) {
                        // Here is your object for every sheet in workbook
                            excelData = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                        });
                        var oModel = new sap.ui.model.json.JSONModel();
                        oModel.setData(excelData);
                        var oTable = that.byId("table0");
                        oTable.setModel(oModel);
                    }
                    reader.readAsBinaryString(file);
                }               

                // reader.readAsBinaryString(file);
                
            },
            checkUpload: function () {
                var idFileUploader = this.getView().byId("fileUploader"); 
                if (idFileUploader.checkFileReadable()){
                var oButton1 = this.byId("uploadButton");
                var oButton2 = this.byId("showButton");
                oButton1.setEnabled();
                oButton2.setEnabled();
                }
                
            },
            handleUploadComplete: function(oEvent) {
                var sResponse = oEvent.getParameter("response"),
                    iHttpStatusCode = parseInt(/\d{3}/.exec(sResponse)[0]),
                    sMessage;
                if (sResponse) {
                    sMessage = iHttpStatusCode === 200 ? sResponse + " (Upload Success)" : sResponse + " (Upload Error)";
                    MessageToast.show(sMessage);
                }

            },
            handleUploadPress: function() {
                var oFileUploader = this.byId("fileUploader");
                oFileUploader.checkFileReadable().then(function() {
                    MessageToast.show("oFileUploader.upload()");
                }, function(error) {
                    MessageToast.show("The file cannot be read. It may have changed.");
                }).then(function() {
                    oFileUploader.clear();
                });
            }
        });
    });
