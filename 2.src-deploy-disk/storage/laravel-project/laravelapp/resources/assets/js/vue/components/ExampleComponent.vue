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
                    test
                    <form action="/www/vue/test" method="POST">
                        <template v-for="(sVal, sKey) in datas">
                            <template v-for="(cVal, cKey) in sVal.color_id">
                                <template v-for="(mVal, mKey) in cVal.material_id">
                                    <input type="checkbox" v-bind:name="'color_material[' + cKey + '][' + mKey + ']'"
                                     v-model="datas[sKey].color_id[cKey].material_id[mKey].checked" v-on:click="onClick">
                                    <!-- v-model="colorMaterial[sKey][cKey][mKey]" value="on" v-on:click="onClick"> -->
                                    {{cVal.color_name}} {{mVal.material_name}}
                                </template>
                            </template>
                        </template>
                        <input type="submit" value="送信">
                    </form>
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
        data: function() {
            return {
                /*colorMaterial: {} */
                /*{
                    1 : {
                        1 : {
                            2 : true
                        },
                        2 : {
                            3 : false
                        }
                    },
                    2 : {
                        3 : {
                            4 : false
                        },
                        4 : {
                            5 : false
                        }
                    }
                },*/
                datas: {
                    1: {
                        "series_name" : "Vida",
                        "color_id" : {
                            1 : {
                                "color_name" : "ウォールナット",
                                "material_id" : {
                                    2 : {
                                        "material_name" : "ウォールナット材"
                                    }
                                }
                            },
                            2 : {
                                "color_name" : "オーク",
                                "material_id" : {
                                    3 : {
                                        "material_name" : "ナチュラルオーク材",
                                    }
                                }
                            }
                        }
                    },
                    2: {
                        "series_name" : "Solid",
                        "color_id" : {
                            3 : {
                                "color_name" : "ホワイトオーク",
                                "material_id" : {
                                    4 : {
                                        "material_name" : "ホワイトオーク材",
                                        "checked": true
                                    }
                                }
                            },
                            4 : {
                                "color_name" : "ダークオーク",
                                "material_id" : {
                                    5 : {
                                        "material_name" : "ダークオーク材"
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },/*
        created() {
            //console.log('created')
            this.colorMaterial = {}
            for (const sKey in this.datas) {
                this.colorMaterial[sKey] = {}
                for (const cKey in this.datas[sKey].color_id) {
                    this.colorMaterial[sKey][cKey] = {}
                    for (const mKey in this.datas[sKey].color_id[cKey].material_id) {
                        if (this.datas[sKey].color_id[cKey].material_id[mKey].checked) {
                            this.colorMaterial[sKey][cKey][mKey] = true
                        } else {
                            this.colorMaterial[sKey][cKey][mKey] = false
                        }
                    }
                }
            }
            //console.log(this.colorMaterial)
        },*/
        mounted() {
            console.log('Component mounted.')
            //console.log(this.colorMaterial)
            console.log(this.datas)
        },
        methods: {
            onClick: function () {
                console.log("click")
                console.log(this.datas)
                //console.log(this.colorMaterial)
            }
        }
    }
</script>
