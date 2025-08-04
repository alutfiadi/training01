sap.ui.define([
    "training01/controller/BaseController",
    'sap/ui/model/Filter',
    "sap/ui/model/FilterType",
    'sap/ui/model/FilterOperator',
], (Controller,
    Filter,
    FilterType,
    FilterOperator
) => {
    "use strict";

    return Controller.extend("training01.controller.Home", {
        onInit() {
            //Create global variables with  this.<<variablename>>

            //get Model Flight refere to manifest 'model' name
            this.oModelFlight = this.getModel("flight");

            //set global variable with get control with this.byId("")
            this.oView = this.getView();
            this.oTableCarrier = this.byId('carrierTable');
            this.oFilterBar = this.byId("filterBar");
            this.filterCarrierId = this.byId("filterCarrierId");
            this.oExpandedLabel = this.byId("expandedLabel");
            this.oSnappedLabel = this.byId("snappedLabel");
            this.oBusyDialog = this.byId("carrierBusyDialog");
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
            this.oTableCarrier.getBinding("items").filter(allFilter);
            this.oTableCarrier.setShowOverlay(false);
        },

        /**
         * Event handler on button Add pressed
         * Navigate to Create Carrier Page
         * @private
        */
        onCarrierAdd: function () {
            this.getRouter().navTo("CarrierCreate");
        },

    });
});