<?

$config["js_apps"]["core.apps.layout_store"] = array(

    'general' => array(
        'title' => 'Layout store',
        'name' => 'layout_store',//should be like 3th part of folder
        'version' => '1.0.0',
        'category' => CATEGORY_HIDDEN,
        'description' => '',
        'depends' => [
            'forms_manager',
            'ecommerce'
        ]
    ),

    "content" => array(
        USERTYPE_ADMIN => array(
            "code" => array(
                "layout_store.js"
            ),
            "styles" => array(
                "style.css"
            )
        ),


        USERTYPE_CONTRIBUTOR => array(
            "code" => array(
                "layout_store.js"
            ),
            "styles" => array(
                "style.css"
            )
        ),


        USERTYPE_GUEST => array(
            "code" => array(
                "layout_store.js"
            ),
            "styles" => array(
                "style.css"
            )
        )
    )

)


?>