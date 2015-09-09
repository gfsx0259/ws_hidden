<?

$config["js_apps"]["core.apps.send_emails_to_friends"] = array(

    'general' => array(
        'title' => 'Send emails to friends',
        'name' => 'send_emails_to_friends',//should be like 3th part of folder
        'version' => '1.0.0',
        'category' => CATEGORY_HIDDEN,
        'depends' => [
            'emails_manager'
        ]
    ),

    "content" => array(
        USERTYPE_ADMIN => array(
            "code" => array("send_emails_to_friends.js"),
            "templates" => array("templates/send_emails_to_friends.xml"),
            "styles" => array("styles.css")
        )
    )

)


?>