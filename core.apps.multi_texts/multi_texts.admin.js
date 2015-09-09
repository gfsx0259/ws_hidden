core.apps.multi_texts.extendPrototype({

    tmp: {
        startDate: 0,
        endDate: 0
    },

    settingsBlocks: [
        { title: "Tags",
          controls: [
            { tag: "input", type: "text",
              className: "text",
              id: "inp_tags" },
            { tag: "span", html: "Tags should be separated by \",\"" }
          ]},
        { title: "Dates",
          controls: [
            { tag: "select",
              id: "inp_dates",
              events: { onchange: ["onDatesChange"]},
              options: [
                { text: "Rolling", value: "rolling" },
                { text: "Static", value: "static" },
                { text: "No dates", value: "nodates" }
              ]}
          ]},
        { tag: "div",
          id: "rolling_dates",
          childs: [
            { tag: "div", className: "section",
              childs: [
                { tag: "div", className: "section_title", innerHTML: "Last"},
                { tag: "div", className: "section_controls",
                  childs: [
                    { tag: "input", type: "text", className: "text",
                      style: { width: "auto" },
                      id: "inp_daysCount" },
                    { tag: "span", innerHTML: " days" }
                  ]} 
              ]}
          ]},
        { tag: "div",
          id: "static_dates",
          childs: [
            { tag: "div", className: "section",
              childs: [
                { tag: "div", className: "section_title", innerHTML: "Start date"},
                { tag: "div", className: "section_controls",
                  childs: [
                    { tag: "input", type: "text", className: "text",
                      style: { width: "auto" },
                      readOnly: true,
                      id: "inp_startDate" },
                    { tag: "img", src: "static/site.images/icons/calendar.gif",
                      events: { onclick: ["showDatePicker", "startDate"] } }
                  ]}, 
                { tag: "div", className: "section_title", innerHTML: "End date"},
                { tag: "div", className: "section_controls",
                  childs: [
                    { tag: "input", type: "text", className: "text",
                      style: { width: "auto" },
                      readOnly: true,
                      id: "inp_endDate" },
                    { tag: "img", src: "static/site.images/icons/calendar.gif",
                      events: { onclick: ["showDatePicker", "endDate"] } }
                  ]} 
              ]}
          ]}
    ],

    processSettingsForm: function() {
        this.profile["dates"] = this.$["inp_dates"].value;
        this.profile["tags"] = this.$["inp_tags"].value;
        this.profile["daysCount"] = parseInt(this.$["inp_daysCount"].value, 10);
        this.profile["startDate"] = this.tmp["startDate"];
        this.profile["endDate"] = this.tmp["endDate"];
        var p = {
            dialog: "texts_manager",
            act: "get_multiple",
            tags: this.profile["tags"],
            startDate: this.profile["startDate"],
            endDate: this.profile["endDate"]
        };
        core.transport.send("/controller.php", p, this.onTextIDs.bind(this));
    },

    fillSettingsForm: function() {
        this.$["inp_tags"].value = this.profile["tags"];
        this.$["inp_dates"].value = this.profile["dates"];
        this.tuneSettings();
    },

    onSettingsUpdated: function() {
    },

    tuneSettings: function() {
        this.hideElements(["rolling_dates", "static_dates"]);
        if (this.$["inp_dates"].value != "nodates") {
            this.showElement(this.$["inp_dates"].value + "_dates");
        }
    },

    onTextIDs: function(msg) {
        if (msg == null) return;
        this.profile["ids"] = msg.ids;
        this.renderDocs();
    },

    onDatesChange: function(e) {
        this.tuneSettings();
    },

    showDatePicker: function(e, s) {
        var pos = [e.clientX,e.clientY];

        var w = this;
        core.externals.datepicker({
            inputField: this.$["inp_" + s],
            showsTime: false,
            singleClick: true,
            onUpdate: test = function (cal) {w.onDateSelect(cal, s)},
            position : pos
        });
        this.$["inp_" + s].onclick();
    },

    onDateSelect: function(cal, s) {
        var tmp = this.tmp[s];
        this.tmp[s] = parseInt(cal.date.getTime() / 1000);
        this.$["inp_" + s].value = this.tmp[s] ? (new Date(this.tmp[s] * 1000)).toDateString() : '';
        if (this.tmp["endDate"] && this.tmp["endDate"] < this.tmp["startDate"]) {
            this.tmp[s] = tmp;
            this.$["inp_" + s].value = this.tmp[s] ? (new Date(this.tmp[s] * 1000)).toDateString() : '';
            desktop.modal_dialog.alert("Start date should be less than End date");
        }
    }
});

