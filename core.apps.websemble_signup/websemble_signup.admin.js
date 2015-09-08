core.apps.websemble_signup.extendPrototype({


    settingsBlocks: [
        { title: "Top text:", 
          controls: [
            { tag: "wsc_textarea", id: "inp_top_text",
              style: { height: "100px" } }
          ]},
        { title: "Bottom text:", 
          controls: [
            { tag: "wsc_textarea", id: "inp_bottom_text",
              style: { height: "100px" } }
          ]}
    ],


    fillSettingsForm: function() {
        this.$["inp_bottom_text"].value = this.profile["bottom_text"];
        this.$["inp_top_text"].value = this.profile["top_text"];
    },


    processSettingsForm: function() {
       this.profile["bottom_text"] = this.$["inp_bottom_text"].value;
       this.profile["top_text"] = this.$["inp_top_text"].value;
    },


    onSettingsUpdated: function() {
        this.refresh();
    }

});