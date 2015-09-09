<?

$config["js_apps"]["core.apps.layout_document"] = array(

    'general' => array(
        'title' => 'Layout document',
        'name' => 'layout_document',//should be like 3th part of folder
        'version' => '1.0.0',
        'category' => CATEGORY_HIDDEN,
        'description' => '',
        'depends' => [
            'texts'
        ]
    ),
    "content" => array(
        USERTYPE_ADMIN => array(
            "code" => array(
                "layout_document.js",
                "layout_document.admin.js"
            )
        ),


        USERTYPE_CONTRIBUTOR => array(
            "code" => array(
                "layout_document.js"
            )
        ),


        USERTYPE_GUEST => array(
            "code" => array(
                "layout_document.js"
            )
        )
    )

)


?>