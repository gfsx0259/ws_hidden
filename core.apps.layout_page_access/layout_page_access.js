core.apps.layout_page_access = function(args) {

    this.title = "Page access";

    this.buildModel(args.parentElement, 
        { tag: "div", className: "no_columns",
          childs: [
            { tag: "div", id: "box_pwd",
              display: false,
              childs: [
                { tag: "div",
                  className: "attention",
                  innerHTML: "Page protected by password." },

                { tag: "div",
                  className: "message_error",
                  display: core.data.page_pwd_error == 1,
                  innerHTML: "Wrong password." },

                { tag: "form",
                  method: "POST",
                  action: location.href,
                  childs: [
                    { tag: "div",
                      innerHTML: "Password: ",
                      childs: [
                        { tag: "input", type: "password", name: "page_pwd" },
                        { tag: "input", type: "submit", value: " Ok " }
                      ]}
                  ]}
              ]},


            { tag: "div", id: "box_user",
              className: "attention",
              display: false,
              innerHTML: "Please login to access this page." },


            { tag: "div", id: "box_contributor",
              className: "attention",
              display: false,
              innerHTML: "Only contributors can access this page." },


            { tag: "div", id: "box_admin",
              className: "attention",
              display: false,
              innerHTML: "Only admin can access this page." }
          ]}
    ); 


    this.showElement("box_" + core.data.access_error);

}

core.apps.layout_page_access.extendPrototype(core.components.html_component);