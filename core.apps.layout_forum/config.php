<?

$config["js_apps"]["core.apps.layout_forum"] = array(

    'general' => array(
        'title' => 'Layout forum',
        'name' => 'layout_forum',//should be like 3th part of folder
        'version' => '1.0.0',
        'category' => CATEGORY_HIDDEN,
        'description' => ''
    ),

    "content" => array(
        USERTYPE_ADMIN => array(
            "code" => array(
                "layout_forum.js",
                "layout_forum.admin.js"
            ),
            "styles" => array(
                "style.css"
            )
        ),


        USERTYPE_CONTRIBUTOR => array(
            "code" => array(
                "layout_forum.js"
            ),
            "styles" => array(
                "style.css"
            )
        ),


        USERTYPE_GUEST => array(
            "code" => array(
                "layout_forum.js"
            ),
            "styles" => array(
                "style.css"
            )
        )
    )

)


?>