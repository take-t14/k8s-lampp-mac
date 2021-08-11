<template>
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-8">
                <div class="card">
                    <div class="card-header">Example Component</div>

                    <div class="card-body">
                        I'm an example component.
                    </div>
                    <div v-for="(val, key) in data" :key="key">
                        <div>{{ val.key1 }}</div>
                        <div>{{ val.key2 }}</div>
                        <div>{{ val.key3 }}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            data: Array
        },
        mounted() {
            console.log('Component mounted.')
        }
    }
</script>
