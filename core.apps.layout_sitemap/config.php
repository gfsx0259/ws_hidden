<?

$config["js_apps"]["core.apps.layout_sitemap"] = array(

    'general' => array(
        'title' => 'Layout sitemap',
        'name' => 'layout_sitemap',//should be like 3th part of folder
        'version' => '1.0.0',
        'category' => CATEGORY_HIDDEN,
        'description' => ''
    ),

    "content" => array(
        USERTYPE_ADMIN => array(
            "code" => array("layout_sitemap.js")
        ),


        USERTYPE_CONTRIBUTOR => array(
            "code" => array("layout_sitemap.js")
        ),


        USERTYPE_GUEST => array(
            "code" => array("layout_sitemap.js")
        )
    )

)


?>