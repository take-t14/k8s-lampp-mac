<!doctype html>
<html lang="<?php echo e(app()->getLocale()); ?>">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Laravel + Vue server side rendering example</title>
        <link rel="stylesheet" href="/www/public/vue/css/app.css">
        <script defer src="/www/public/vue/js/entry-client.js"></script>
    </head>
    <body class="bg-paper font-sans leading-normal text-grey-darkest border-t-4 border-orange-light">
        <?php echo ssr('js/vue/entry-server.js')
            // Share the packages with the server script through context
            ->context('packages', $packages)
            // If ssr fails, we need a container to render the app client-side
            ->fallback('<div id="app"></div>')
            ->render(); ?>


        <script>
            // Share the packages with the client script through a JS variable
            window.packages = <?php echo json_encode($packages, 15, 512) ?>
        </script>

        <footer class="max-w-md mx-auto px-8 mt-12 mb-4 text-xs text-grey-light">
            Created by <a href="https://spatie.be" target="_blank" class="text-grey" >spatie.be</a>
            using <a href="https://github.com/spatie/laravel-server-side-rendering" target="_blank" class="text-grey">spatie/laravel-server-side-rendering</a>
        </footer>
    </body>
</html>
<?php /**PATH /mnt/src/laravel-project/laravelapp/resources/views/vue.blade.php ENDPATH**/ ?>