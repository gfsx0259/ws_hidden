<?

    $config["js_apps"]["core.apps.upgrade_browser"] = array(

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

    )
?>