<?

$config["js_apps"]["core.apps.layout_newsletter"] = array(

    'general' => array(
        'title' => 'Layout newsletter',
        'name' => 'layout_newsletter',//should be like 3th part of folder
        'version' => '1.0.0',
        'category' => CATEGORY_HIDDEN,
        'description' => ''
    ),

    "content" => array(
        USERTYPE_ADMIN => array(
            "code" => array("layout_newsletter.js")
        ),


        USERTYPE_CONTRIBUTOR => array(
            "code" => array("layout_newsletter.js")
        ),


        USERTYPE_GUEST => array(
            "code" => array("layout_newsletter.js")
        )
    )

)


?>