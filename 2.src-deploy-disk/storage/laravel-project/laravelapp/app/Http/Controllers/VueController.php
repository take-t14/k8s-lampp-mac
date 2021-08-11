<?php

namespace App\Http\Controllers;

class VueController extends Controller
{
    public function __invoke()
    {
        return view('vue', [
            'packages' => $this->getPackages(),
        ]);
    }

    private function getPackages(): array
    {
        $path = public_path('packages.json');

        $contents = file_get_contents($path);

        return json_decode($contents, true);
    }
    public function test()
    {
        $_objVueController = (new \App\Http\Controllers\Api\VueController);
        $_aryPackages = ["csrfTest" => $_objVueController->csrfTest(), "get" => $_objVueController->get()];
        //$_aryPackages = [];
        return view('vue', [
            'packages' => $_aryPackages,
        ]);
    }
}
