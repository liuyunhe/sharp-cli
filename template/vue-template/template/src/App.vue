<script setup>
<%_ if (data.mode === 'api') { _%>
console.log('request api')
<%_ } _%>
</script>

<template>
  <%_ if(data.mode === 'api') { _%>
  <div>request api</div>
  <%_ } else { _%>
  <div>default</div>
  <%_ } _%>
</template>

<style scoped>

</style>
