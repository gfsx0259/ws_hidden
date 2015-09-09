<?

$config["js_apps"]["core.apps.layout_row_settings"] = array(

    'general' => array(
        'title' => 'Layout row settings',
        'name' => 'layout_row_settings',//should be like 3th part of folder
        'version' => '1.0.0',
        'category' => CATEGORY_HIDDEN,
        'description' => ''
    ),

    "content" => array(
        USERTYPE_ADMIN => array(
            "code" => array(
                "layout_row_settings.js"
            ),
            "templates" => array(
                "template.xml"
            ),
            "styles" => array(
                "styles.css"
            )
        )
    )
);

?>