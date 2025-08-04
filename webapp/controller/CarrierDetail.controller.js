sap.ui.define([
    "training01/controller/BaseController",
    'sap/ui/core/Fragment'
], (Controller,
    Fragment
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
            let pathCarrier = this.modelFilght.createKey("/CarrierSet",{
                CarrierId: carrierIdparam
            })

            this.viewDetail.bindElement({
                path: pathCarrier,
                model: 'flight'
            });

        },

       

    });
});