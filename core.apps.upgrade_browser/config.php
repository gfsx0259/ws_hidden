<?php

$config["js_apps"]["core.apps.upgrade_browser"] = array(

    'general' => array(
        'title' => 'Upgrade browser',
        'name' => 'upgrade_browser',//should be like 3th part of folder
        'version' => '1.0.0',
        'category' => CATEGORY_HIDDEN,
        'description' => ''
        //depends and running by desktop, but it's core widget
    ),

    "content" => array(
        USERTYPE_ADMIN => array(
            "code" => array("upgrade_browser.js"),
            "templates" => array(
                "upgrade_browser_box.xml",
                "upgrade_browser.xml",
            ),
            "styles" => array("styles.css")
        ),
        USERTYPE_CONTRIBUTOR => array(
            "code" => array("upgrade_browser.js"),
            "templates" => array(
                "upgrade_browser_box.xml",
                "upgrade_browser.xml",
            ),
            "styles" => array("styles.css")
        ),
        USERTYPE_GUEST => array(
            "code" => array("upgrade_browser.js"),
            "templates" => array(
                "upgrade_browser_box.xml",
                "upgrade_browser.xml",
            ),
            "styles" => array("styles.css")
        )
    )

);