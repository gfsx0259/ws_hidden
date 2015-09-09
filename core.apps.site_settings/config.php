<?

$config["js_apps"]["core.apps.site_settings"] = array(

    'general' => array(
        'title' => 'Site settings',
        'name' => 'site_settings',//should be like 3th part of folder
        'version' => '1.0.0',
        'category' => CATEGORY_HIDDEN,
        'description' => ''
    ),

    "content" => array(
        USERTYPE_ADMIN => array(
            "code" => array("site_settings.js"),
            "templates" => array(
                "templates/site_settings.xml",
                "templates/site_settings_ads.xml",
                "templates/site_settings_analytics.xml",
                "templates/site_settings_emails.xml",
                "templates/site_settings_header.xml",
                "templates/site_settings_footer.xml",
                "templates/site_settings_rss.xml",
                "templates/site_settings_timezone.xml",
                "templates/site_settings_misc.xml"
            ),
            "styles" => array(
                "styles.css"
            )
        )
    )

)


?>