<?
$config["js_apps"]["core.apps.layout_ecommerce_checkout"] = array(
    "content" => array(

        USERTYPE_ADMIN => array(
            "code" => array("layout_ecommerce_checkout.js")
        ),

        USERTYPE_CONTRIBUTOR => array(
            "code" => array("layout_ecommerce_checkout.js")
        ),

        USERTYPE_GUEST => array(
            "code" => array("layout_ecommerce_checkout.js")
        )
    )
);
?>