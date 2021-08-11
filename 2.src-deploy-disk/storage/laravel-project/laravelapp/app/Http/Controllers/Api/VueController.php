<?php
 
namespace App\Http\Controllers\Api;
 
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
 
class VueController extends Controller
{
    public function get()
    {
        return [
              ["key1" => "val1-1", "key2" => "val1-2", "key3" => "val1-3"]
            , ["key1" => "val2-1", "key2" => "val2-2", "key3" => "val2-3"]
            , ["key1" => "val3-1", "key2" => "val3-2", "key3" => "val3-3"]
            , ["key1" => csrf_token(), "key2" => \Session::get("name"), "key3" => "val4-3"]
        ];
    }
    public function csrfTest()
    {
        if (isset(request()->all()["name"])) {
            \Session::put('name', request()->all()["name"]);
        }
        $_strName = isset(request()->all()["name"]) ? request()->all()["name"] : "";
        $_strSName = null !== \Session::get("name") ? \Session::get("name") : "";
        return ["testResponse" => "success!!", "name" => $_strName, "name" => $_strSName];
    }
}
