sap.ui.define([
    "training01/controller/BaseController",
    "sap/m/MessageBox"
], (Controller,
    MessageBox
) => {
    "use strict";

    return Controller.extend("training01.controller.CarrierCreate", {
        onInit: function () {
            this.oBusyDialog = this.byId("createCarrierBD")
            //get Model Flight refere to manifest 'model' name
            this.oModelFlight = this.getModel("flight");

            //set global variable with get control with this.byId("")
            this.oView = this.getView();
        },

        /**
          * Event handler on Save press button
          * @private
         **/
        onSave: async function () {
            var that = this;

            //Get Values from SimpleForm for Carrier
            let valueCarrierId = this.byId("CarrierId").getValue();
            let valueName = this.byId("Name").getValue();
            let valueCurrency = this.byId("CurrencyCode").getValue();

            // Create Payload with type Object <FieldName>:<Value>
            let payload = {
                CarrierId: valueCarrierId,
                Name: valueName,
                CurrencyCode: valueCurrency
            }
            if (this.oModelFlight) {
                this.oBusyDialog.open();
                this.oModelFlight.create("/CarrierSet", payload, {
                    success: function (oData, oResponse) {
                        that.oBusyDialog.close();
                        let carrierId = oResponse.data.CarrierId;
                        let message = "Airlines " + carrierId + " is successfully created." + "\n";
                        MessageBox.success(message,  {
                            actions: [MessageBox.Action.OK],
                            emphasizedAction: MessageBox.Action.OK,
                            onClose: function (sAction) {
                                that._clearForms();
                                that.onNaviBack();
                            }
                        });
                        this.oModelFlight.refresh(); // Refresh after successful save
                    }.bind(this),
                    error: function (oError) {
                        that.oBusyDialog.close();
                        let response = JSON.parse(oError.responseText);
                        let errmessage = response.error.message.value;
                        let message = "Airlines creation failed:  " + errmessage;
                        MessageBox.error(message);
                    }
                });
            }
        },
        
        /**
         * method to clear Forms and table data
         * @private
        **/
        _clearForms: function () {
            this.byId("CarrierId").setValue();
            this.byId("Name").setValue();
            this.byId("CurrencyCode").setValue();

        },

        /**
         * Event Handler to navigate back
         * @private
        **/
        onCancel: function () {
            this._clearForms();

            //use public function onNaviBack from BaseController.js
            this.onNaviBack();
        },

        onExit: function (){
            this._clearForms();
        }


    });
});