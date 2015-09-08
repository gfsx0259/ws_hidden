core.apps.websemble_setup_site.extendPrototype({


    onFirstRun: function() {
        this.showSettings();
    },




    settingsBlocks: [
        { title: "Columns:",
          controls: [
            { tag: "wsc_slider", id: "inp_cols",
              range: { min: 1, max: 20 } }
          ]},

        { title: "Thumbnails per page:",
          controls: [
            { tag: "wsc_slider", id: "inp_items_per_page",
              range: { min: 1, max: 100 } }
          ]},

        { title: "Thumbnail height:",
          controls: [
            { tag: "wsc_size", hide: "w", id: "inp_image_height" }
          ]},

        { title: "Thumbnail margin:", 
          controls: [
            { tag: "wsc_slider", id: "inp_spacing",
              range: { min: 0, max: 100 } }
          ]}
    ],



    fillSettingsForm: function() {
        this.$["inp_image_height"].setValue({ height: this.profile["image_height"] });
        this.$["inp_items_per_page"].setValue(this.profile["items_per_page"]);
        
        this.$["inp_cols"].setValue(this.profile["cols"]);
        this.$["inp_spacing"].setValue(this.profile["spacing"]);
    },

    processSettingsForm: function() {
        this.profile["image_height"] = this.$["inp_image_height"].value.height || this.defaultProfile["image_height"];
        this.profile["items_per_page"] = this.$["inp_items_per_page"].value;
        this.profile["cols"] = this.$["inp_cols"].value;
        this.profile["spacing"] = this.$["inp_spacing"].value;
    },




    onSettingsUpdated: function() {
        this.refresh();
    }    

});