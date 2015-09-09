<?

$config["js_apps"]["core.apps.layout_styler"] = array(

    'general' => array(
        'title' => 'Layout styler',
        'name' => 'layout_styler',//should be like 3th part of folder
        'version' => '1.0.0',
        'category' => CATEGORY_HIDDEN,
        'description' => ''
    ),

    "content" => array(
        USERTYPE_ADMIN => array(
            "code" => array(
                "layout_styler.js"
            ),
            "templates" => array(
                "templates/layout_styler.xml"
            ),
            "styles" => array("styles.css")
        )

    )
)
?>