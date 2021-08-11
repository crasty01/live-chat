<template>
  <router-view />
</template>

<script>
export default {};
</script>

<style lang="scss">
html {
  background-color: #09090b;
  font-family: 'Roboto';
}
body {
  display: grid;
  place-content: center;
  margin: 0;
  //padding: 1rem;
  padding: calc((100vh - 38px) / 2) 0;
}
* {
  box-sizing: border-box;
  font-family: inherit;
}
</style>
