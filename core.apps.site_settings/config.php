<?

    $config["js_apps"]["core.apps.site_settings"] = array(

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