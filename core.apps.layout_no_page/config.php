<?

$config["js_apps"]["core.apps.layout_no_page"] = array(

    'general' => array(
        'title' => 'Layout page not found',
        'name' => 'layout_no_page',//should be like 3th part of folder
        'version' => '1.0.0',
        'category' => CATEGORY_HIDDEN,
        'description' => ''
    ),

    "content" => array(
        USERTYPE_ADMIN => array(
            "code" => array("layout_no_page.js")
        ),


        USERTYPE_CONTRIBUTOR => array(
            "code" => array("layout_no_page.js")
        ),


        USERTYPE_GUEST => array(
            "code" => array("layout_no_page.js")
        )
    )

)


?>