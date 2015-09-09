<?

$config["js_apps"]["core.apps.layout_page_access"] = array(

    'general' => array(
        'title' => 'Layout page access',
        'name' => 'layout_page_access',//should be like 3th part of folder
        'version' => '1.0.0',
        'category' => CATEGORY_HIDDEN,
        'description' => ''
    ),

    "content" => array(
        USERTYPE_ADMIN => array(
            "code" => array("layout_page_access.js")
        ),


        USERTYPE_CONTRIBUTOR => array(
            "code" => array("layout_page_access.js")
        ),


        USERTYPE_GUEST => array(
            "code" => array("layout_page_access.js")
        )
    )

)


?>