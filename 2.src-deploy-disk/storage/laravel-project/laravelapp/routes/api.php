<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

/*
Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});*/

Route::group(['middleware' => 'api'],function(){
    Route::post('login', 'Api\ApiLoginController@login');
    Route::post('logout', 'Api\ApiLoginController@logout')->name('logout');
    Route::get('user', function (Request $request) {
        return $request->user();
    });

    Route::get('get', 'Api\VueController@get');
    Route::post('get', 'Api\VueController@get');
    Route::post('csrf-test', 'Api\VueController@csrfTest');
});
