<?
$config["js_apps"]["core.apps.layout_ecommerce_checkout"] = array(

    'general' => array(
        'title' => 'Layout ecommerce checkout',
        'name' => 'layout_ecommerce_checkout',//should be like 3th part of folder
        'version' => '1.0.0',
        'category' => CATEGORY_HIDDEN,
        'description' => '',
        'depends' => [
            'ecommerce'
        ]
    ),


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