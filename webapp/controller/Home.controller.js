sap.ui.define([
    "training01/controller/BaseController",
    'sap/ui/model/Filter',
    "sap/ui/model/FilterType",
    'sap/ui/model/FilterOperator',
    "sap/m/MessageBox",
    'sap/m/MessageToast'
], (Controller,
    Filter,
    FilterType,
    FilterOperator,
    MessageBox,
    MessageToast
) => {
    "use strict";

    return Controller.extend("training01.controller.Home", {
        onInit() {
            //Create global variables with  this.<<variablename>>

            //get Model Flight refere to manifest 'model' name
            this.modelFlight = this.getModel("flight");

            //set global variable with get control with this.byId("")
            this.viewHome = this.getView();
            this.tableCarrier = this.byId('carrierTable');
            this.filterBar = this.byId("filterBar");
            this.filterCarrierId = this.byId("filterCarrierId");
            this.expandedLabel = this.byId("expandedLabel");
            this.snappedLabel = this.byId("snappedLabel");
            this.busyDialog = this.byId("carrierBusyDialog");
        },
        /**
         * Function Event on Filter 
         * @param {sap.ui.base.Event} Control Event
         * This event is fired when the Go button is pressed.
         * @private
        **/
        onFilter: function (oEvent) {
            //Array for all the filters
            let keyFilters = [];
            //Populate all input filter 
            let searchQuery = this.byId("searchCarrier").getValue();
            //Filter Currency is a MultiCombobox so the results will be an array
            let filterCurrency = this.byId('filterCurrency').getSelectedKeys();
            //Search Query Validate and Push  into keyFilters
            if (searchQuery.length > 0) {
                let searchFilter = [];
                if (searchQuery.length <= 2) {
                    searchFilter.push(new Filter("CarrierId", FilterOperator.Contains, searchQuery.toUpperCase()));
                }
                searchFilter.push(new Filter("Name", FilterOperator.Contains, searchQuery));
                keyFilters.push(
                    new Filter({
                        filters: searchFilter,
                        and: false, // Use 'or' logic for multiple status selections
                    })
                );
            }
            //Filter Currency Validation and Push into keyFIlters
            if (filterCurrency.length > 0) {
                if (filterCurrency[0] != "") {
                    var currencyFilters = filterCurrency.map((key) => new Filter("CurrencyCode", FilterOperator.EQ, key));
                    keyFilters.push(
                        new Filter({
                            filters: currencyFilters,
                            and: false, // Use 'or' logic for multiple status selections
                        })
                    );
                }
            }
            let allFilter = new Filter({
                filters: keyFilters,
                and: true,
            })
            this.tableCarrier.getBinding("items").filter(allFilter);
            this.tableCarrier.setShowOverlay(false);
        },

        /**
         * Event handler on button Add pressed
         * Navigate to Create Carrier Page
         * @private
        */
        onCarrierAdd: function () {
            this.getRouter().navTo("CarrierCreate");
        },

        /**
         * Event handler on item pressed
         * @param {event} Control Event
         * Navigate to Carrier Detail
         * @private
        */
        onCarrierDetail: function (event) {
            let carrierId = event.getSource().getBindingContext('flight').getProperty('CarrierId');
            this.getRouter().navTo("CarrierDetail", {
                carrier: encodeURIComponent(carrierId)
            });
        },

        /**
         * Event handler on button Add pressed
         * Navigate to Create Carrier Page
         * @private
        */
        onCarrierDelete: function (oEvent) {
            this.busyDialog.open();
            const that = this;
            const pathCarrier = this.byId("carrierTable").getSelectedContexts()[0].sPath;
            let selectedItem = this.byId("carrierTable").getSelectedItem();
            let carrierId = selectedItem.getBindingContext('flight').getProperty('CarrierId')

            MessageBox.confirm("Are you sure want to delete this Carrier " + carrierId, {
                actions: [MessageBox.Action.YES, MessageBox.Action.CANCEL],
                emphasizedAction: MessageBox.Action.CANCEL,
                onClose: function (sAction) {
                    //   console.log(sAction)
                    if (sAction == "YES") {
                        that._deleteCarrier(pathCarrier);
                    }
                }
            });

        },
        
        /**
         * Function helper on delete Carrier
         * Navigate to Create Carrier Page
         * @private
        */
        _deleteCarrier: function (pathCarrier) {
            const that = this;
            this.modelFlight.remove(pathCarrier, {
                method: "DELETE",
                success: function (oData, oResponse) {
                    console.log(oResponse)
                    that.busyDialog.close();
                    MessageToast.show("Success Delete Carrier");
                },
                error: function (oError) {
                    console.log(oError)
                    that.busyDialog.close();
                    MessageToast.show("Failed Delete Carrier");
                }
            });
        }
    });
});