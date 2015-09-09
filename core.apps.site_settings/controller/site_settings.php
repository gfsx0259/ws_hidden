<?

//TODO: security issue??

class dialog_controller_site_settings extends dialog_controller
{


    function run()
    {
        parent::run();

        if ($this->usertype < USERTYPE_ADMIN) return array("status" => "error");

        switch ($_REQUEST["act"]) {
            case "get_data":
                return array(
                    "status" => "ok",
                    "data" => $this->sites->getSiteInfo()
                );
                break;

            case "set_data":
                $p = unserialize(stripslashes($_REQUEST["data"]));
                if (!$p) return false;
                $this->sites->setValues($p);
                return "ok";
                break;
        }

    }


}

?>