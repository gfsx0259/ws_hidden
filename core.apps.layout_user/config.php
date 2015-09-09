<?

$config["js_apps"]["core.apps.layout_user"] = array(

    'general' => array(
        'title' => 'Layout user',
        'name' => 'layout_user',//should be like 3th part of folder
        'version' => '1.0.0',
        'category' => CATEGORY_HIDDEN,
        'description' => '',
        'depends' => [
            'users_manager'
        ]
    ),


    "content" => array(
        USERTYPE_ADMIN => array(
            "code" => array("layout_user.js"),
            "templates" => array("templates/layout_user_forms.xml"),
            "styles" => array("styles.css")
        ),


        USERTYPE_CONTRIBUTOR => array(
            "code" => array("layout_user.js"),
            "templates" => array("templates/layout_user_forms.xml"),
            "styles" => array("styles.css")
        ),


        USERTYPE_GUEST => array(
            "code" => array("layout_user.js"),
            "templates" => array("templates/layout_user_forms.xml"),
            "styles" => array("styles.css")
        )
    )

)


?>