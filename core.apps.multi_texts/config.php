<?

$config["js_apps"]["core.apps.multi_texts"] = array(

    'general' => array(
        'title' => 'Multi_texts',
        'name' => 'multi_texts',//should be like 3th part of folder
        'version' => '1.0.0',
        'category' => CATEGORY_HIDDEN,
        'description' => ''
    ),

    "content" => array(
        USERTYPE_ADMIN => array(
            "code" => array(
                "multi_texts.js",
                "multi_texts.admin.js"
            )
        ),


        USERTYPE_CONTRIBUTOR => array(
            "code" => array("multi_texts.js")
        ),


        USERTYPE_GUEST => array(
            "code" => array("multi_texts.js")
        )
    )

)


?>