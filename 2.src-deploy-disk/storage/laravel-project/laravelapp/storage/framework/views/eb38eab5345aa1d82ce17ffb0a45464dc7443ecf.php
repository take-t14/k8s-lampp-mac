<html>
    <head>
        <title>My server side rendered app</title>
        <link rel="stylesheet" href="<?php echo e(mix('css/app.css')); ?>">
        <script defer src="<?php echo e(mix('js/vue/entry-client.js')); ?>">
    </head>
    <body>
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
        <main class="py-4">
            <?php echo $__env->yieldContent('content'); ?>
        </main>
    </body>
</html>
<?php /**PATH /var/www/html/public/laravel-project/laravelapp/resources/views/layouts/app.blade.php ENDPATH**/ ?>