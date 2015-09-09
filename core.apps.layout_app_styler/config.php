<?

$config["js_apps"]["core.apps.layout_app_styler"] = array(

    'general' => array(
        'title' => 'Layout app styler',
        'name' => 'layout_app_styler',//should be like 3th part of folder
        'version' => '1.0.0',
        'category' => CATEGORY_HIDDEN,
        'description' => ''
    ),

    "content" => array(
        USERTYPE_ADMIN => array(
            "code" => array(
                "layout_app_styler.js"
            ),
            "templates" => array("layout_app_styler.xml"),
            "styles" => array("styles.css")
        )

    )
)
?>