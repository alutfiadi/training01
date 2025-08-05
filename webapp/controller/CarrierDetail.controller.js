sap.ui.define([
    "training01/controller/BaseController",
    "sap/m/MessageBox"
], (Controller,
    MessageBox
) => {
    "use strict";

    return Controller.extend("training01.controller.CarrierDetail", {
        onInit: function () {
            this.router = this.getRouter();
            this.router.getRoute("CarrierDetail").attachPatternMatched(this._onRouteMatched, this);

            this.modelFilght = this.getModel('flight');
            this.viewDetail = this.getView();
            this.tableConnection = this.byId("connectionTable");
            this.tableFlight = this.byId("flightTable");

        },

        /**
         * Event handler on Pattern URI is Matched with Route Carrier Detail
         * @param {sap.ui.base.Event} Control Event
         * @private
        **/
        _onRouteMatched: function (event) {
            let paramters = event.getParameters();
            let carrierIdparam = paramters.arguments.carrier;
            this.pathCarrier = this.modelFilght.createKey("/CarrierSet", {
                CarrierId: carrierIdparam
            })

            this.viewDetail.bindElement({
                path: this.pathCarrier,
                model: 'flight'
            });

            //Bind Table Connection with expanded Connections from CarriesSet
            this.tableConnection.setModel(this.modelFilght);
            this.tableConnection.bindElement({
                path: this.pathCarrier,
                parameters: {
                    expand: "Connections"
                }
            });

            //Bind Table Connection with expanded Flights from CarriesSet
            this.tableFlight.setModel(this.modelFilght);
            this.tableFlight.bindElement({
                path: this.pathCarrier,
                parameters: {
                    expand: "Flights"
                }
            });

        },
        onSavePress: function (oEvent) {
            this._toggleButtonsAndView(false);

            let carrierId = this.byId("carrierId").getValue(),
                name = this.byId("nameInput").getValue(),
                currencyCode = this.byId("currencyInput").getValue();

            let payload = {
                CarrierId: carrierId,
                Name: name,
                CurrencyCode: currencyCode
            }

            this.modelFilght.update(this.pathCarrier, payload, {
                success: function (oData, oResponse) {
                    // Success
                    MessageBox.success("Success Update Carrier Information.");
                }.bind(this),
                error: function (oError) {
                    let response = JSON.parse(oError.responseText);
                    let errmessage = response.error.message.value;
                    let message = "Failed to update carrier due to:  " + errmessage;
                    MessageBox.error(message);
                }
            })

        },

        onEditPress: function (event) {
            this._toggleButtonsAndView(true);
        },

        onCancelPress: function (event) {
            this._toggleButtonsAndView(false);
        },

        _toggleButtonsAndView: function (isEdit) {
            // Show the appropriate action buttons
            this.byId("editButton").setVisible(!isEdit);
            this.byId("saveButton").setVisible(isEdit);
            this.byId("cancelButton").setVisible(isEdit);

            this.byId("nameInput").setEditable(isEdit);
            this.byId("currencyInput").setEditable(isEdit);
        },

        onSearchEdit: function (event) {
            // Get the source control that fired the event
            const sourceControl = event.getSource();

            // Get the ID of the source control
            const sourceID = sourceControl.getId();
            const querySearch = event.getParameter("query");

            if (sourceID === this.byId("sfConnection").getId()) {
                var idTable = "connectionTable";
                var searchFields = [
                    { field: "ConnectionId", type: "EQ" },
                    { field: "AirportFromId", type: "Contains" },
                    { field: "AirportToId", type: "Contains" }
                ];
            } else if (sourceID === this.byId("sfFlight").getId()) {
                var idTable = "flightTable";
                var searchFields = [
                    { field: "ConnectionId", type: "EQ" },
                    { field: "PlaneTypeId", type: "Contains" }
                ];
            }

            // console.log({aSearchFields})
            if (!event.getParameter("clearButtonPressed")) {
                this.onSearch(querySearch, searchFields, idTable);
            } else {
                this.onSearch("", [], idTable);
            }

        }

    });
});