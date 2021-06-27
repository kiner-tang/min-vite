<template>
    <h1 @click="addCount" :title="msg">{{count}}</h1>
</template>

<script>
export default {
    data(){
        return {
            count: 1,
            msg: "你好"
        }
    },
    methods: {
        addCount(){
            this.count++;
        }
    }
}
</script>