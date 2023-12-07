sap.ui.define([
    "sap/ui/core/mvc/Controller",
    'sap/ui/Device',
    'sap/ui/model/Filter', 
    'sap/ui/model/FilterOperator',
    "sap/ui/model/Sorter",
    'sap/m/Menu',
	'sap/m/MenuItem',
    'sap/m/Token',
	'sap/m/MessageToast',
    'sap/ui/core/Fragment',
	'sap/m/PDFViewer',
    '../model/formatter'
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */

    function (Controller, Device, Filter, FilterOperator, Sorter, Menu, MenuItem, Token, MessageToast, Fragment, PDFViewer, formatter) {
        "use strict";
        
        return Controller.extend("dumpsShow.dumps.controller.View1", {

            formatter: formatter,
            onInit: function () { 
                // var oModel = this.getOwnerComponent().getModel();
                // oModel.setHeaders({
                //     "sap-uname" : 'aItemArray[0]'
                // });
                // console.log(oModel);
                this._oCurrentP13nData = null;
			    this._bIsOpen = false;
                var oMultiInput1 = this.getView().byId("multiInput");
			oMultiInput1.setTokens([
				new Token({text: "555", key: "0001"}),
				new Token({text: "555", key: "0002"}),
			]);
			this._mViewSettingsDialogs = {};
                var that = this
                this._pdfViewer = new PDFViewer();
                this.getView().addDependent(this._pdfViewer);
                console.log(this._pdfViewer);
                var oTable = this.getView().byId('table0')
                var oItemTemplate = new sap.m.ColumnListItem({
                    cells: [new sap.m.Text("text2",{text:"{Uname}"}), 

                            new sap.m.Text(
                                "text3",
                                {text:"{path: 'Datum', type: 'sap.ui.model.type.DateTime', formatOptions: { pattern: 'yyyy-MM-dd' }}"
                            }),
                            new sap.m.Text("text8",{text:"{Uzeit}"}),
                            new sap.m.Text("text4",{text:"{Ahost}"}),
                            new sap.m.Text("text5",{text:"{Mandt}"}),
                            new sap.m.Text("text6",{text:"{Modno}"}),
                            new sap.m.Text("text7",{text:"{Seqno}"}),
                            new sap.m.Text("text9",{text:"{Xhold}"}) ]}
                            ).addEventDelegate({
                                onfocusin: function(oEvent) {
                                    var aItemArray = []
                                    // console.log(oModel);
                                    console.log(oEvent.srcControl);
                                    var sPath = "/FILE_UPLOADSet(FILENAME='PDF')/$value?"
                                    var oSelectedRow = oEvent.srcControl.getCells()
                                    for (var i = 0; i < oSelectedRow.length; i++) {
                                        var vKey = oSelectedRow[i].mBindingInfos.text.parts[0].path
                                        var vCell = oSelectedRow[i].getText()
                                        if (vKey == 'Datum') {
                                            vCell = vCell.replace("-", "")
                                            vCell = vCell.replace("-", "")
                                        }
                                        if (vKey == 'Uzeit') {
                                            vCell = vCell.replace(":", "")
                                            vCell = vCell.replace(":", "")
                                        }
                                        console.log(vCell, vKey);
                                        sPath = sPath + vKey + "=" + vCell + ","
                                        aItemArray.push(vCell)
                                    }
                                    console.log(aItemArray[0]);

                                    // var sPath = "/FILE_UPLOADSet(FILENAME='PDF')/$value?gch"
                                    console.log(sPath);
                                    var sSource = "/sap/opu/odata/sap/ZGC_SHOW_DUMPS_ODATA_SRV" + sPath
                                    that._pdfViewer.setSource(sSource);
                                    that._pdfViewer.setTitle(sSource);
                                    that._pdfViewer.addCustomData()
                                    
                                    // that._pdfViewer.getModel().setHeaders({
                                    //     "sap-uname" : 'aItemArray[0]'
                                    // });
                                    console.log(that._pdfViewer);
                                    that._pdfViewer.open();
                                }
                            })
                            console.log(oItemTemplate);
                oTable.bindAggregation("items", {
                    path: "/SHOW_DUMPSSet",
                    filters: this.getFilter(),
                    template: oItemTemplate,
                    templateShareable: false
                    });
            },
            _initialData: {
                sort: [
                    {sorted: true, name: "Datum", label: "Date", descending: true},
                    {sorted: true, name: "Modno", label: "Modno", descending: true}
                ]
            },
            _setInitialData: function() {
                
                var oSortPanel = this.getView().byId("sortPanel");
                oSortPanel.setP13nData(this._initialData.sort);
            },
            reset: function(oEvt) {
                //reset sort menu and set to default sorter 
                this._setInitialData();
                this.defaultSort()
                // Clearing sort indicator items
                var oDateCol = this.getView().byId('column1')
                oDateCol.setSortIndicator('None')
                var oModnoCol = this.getView().byId('column5')
                oModnoCol.setSortIndicator('None')
                var oView = this.getView();
                var oPopup = oView.byId("p13nPopup");
                console.log(oPopup);
                console.log(oEvt);
                oEvt.fireClose(null, 'Cancel')
            },
            handleSortButtonPressed: function(oEvt) {
                var oView = this.getView();
                var oPopup = oView.byId("p13nPopup");
                if (!this._bIsOpen) {
                    this._setInitialData();
                    this._bIsOpen = true;
                }
    
                oPopup.open(oEvt.getSource());
            },

            onConfirmDialog: function(oEvt) {
                
                var sReason = oEvt.getParameter("reason");
                if (sReason == 'Ok'){
                    MessageToast.show("Dialog close reason: " + sReason);
                    var oView = this.getView();
        
                    var oP13nState = {
                        sort: oView.byId("sortPanel").getP13nData()
                    };
                    this.handleSortAndIndicator(oP13nState);
                }

                else {
                    MessageToast.show("Dialog close reason: " + sReason);
                }
            },
    

            defaultSort: function () {
                var oTable = this.byId("table0"),
                    oBinding = oTable.getBinding("items"),
                    oSorter = new Sorter('Datum', false);
                    oBinding.sort(oSorter)
            },

            handleSortAndIndicator: function(oSortCond) {
                var oTable = this.byId("table0"),
                    oBinding = oTable.getBinding("items"),
                    aSorters = [];
                for (let i = 0; i < oSortCond.sort.length; i++) {
                    var column,
                        order,
                        sPath = oSortCond.sort[i].name,
                        bDescending = oSortCond.sort[i].descending;
                    if (sPath == 'Datum'){
                        column = 'column1'
                    }
                    else if (sPath == 'Modno'){
                        column = 'column5'
                    }
                    else{
                        continue
                    }
                
                    if (bDescending == true){
                        order = 'Descending'
                    }
                    else if (bDescending == false) {
                        order = 'Ascending'
                    }
                    else {
                        order = 'None'
                    }
                    if (oSortCond.sort[i].sorted == true){
                        // Enable Sort indicator
                        var oSortColumn = this.getView().byId(column)
                        oSortColumn.setSortIndicator(order)
                        aSorters.push(new Sorter(sPath, bDescending));
                        oBinding.sort(aSorters);
                    }
                
                    else if (oSortCond.sort[i].sorted == false) {
                        // Disable Sort indicator 
                        var oSortColumn = this.getView().byId(column)
                        console.log(oSortColumn);
                        oSortColumn.setSortIndicator('None')
                    }
                }
            },

            getFilter: function () {
                var oFilter = new Filter({
                    filters: [
                        new Filter ({
                            path: 'Uname',
                            operator: FilterOperator.EQ,
                            value1: 'GCHITROV'
                        }),
                        new Filter ({
                            path: 'Datum',
                            operator: FilterOperator.BT,
                            value1: '2023-03-15T02:00',
                            value2: '2023-04-15T02:00'
                        }),
                        new Filter ({
                            path: 'Mandt',
                            operator: FilterOperator.BT,
                            value1: '555',
                            value2: '555'
                        })
                    ],
                    and: true|false
                });
                return oFilter
            },

            onFilterPress: function () {
                var fname = this.getView().byId('input0').mProperties.value.toUpperCase()
                var dateRange = this.getView().byId('DRS1')
                var date1 = formatter.date(dateRange.getDateValue())
                var date2 = formatter.date(dateRange.getSecondDateValue())
                var mand1 = this.getView().byId("multiInput").getTokens()[0].mProperties.text
                var mand2 = this.getView().byId("multiInput").getTokens()[1].mProperties.text
                var oFilter = new Filter({
                    filters: [
                        new Filter ({
                            path: 'Uname',
                            operator: FilterOperator.EQ,
                            value1: fname
                        }),
                        new Filter ({
                            path: 'Datum',
                            operator: FilterOperator.BT,
                            value1: date1,
                            value2: date2
                        }),
                        new Filter ({
                            path: 'Mandt',
                            operator: FilterOperator.BT,
                            value1: mand1,
                            value2: mand2
                        })
                    ],
                    and: true
                })
                var oTable = this.getView().byId('table0')
                var oBinding = oTable.getBinding('items')
                oBinding.filter([oFilter])
            }
        });
    });
