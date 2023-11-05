<template>
  <div>
    <h1>Food</h1>
    <div v-for="index in 100" :key="index">
      <food-item/>
    </div>
  </div> 
</template>

<script></script>

<style>
  
  #app > div {
        border: dashed black 1px;
        display: inline-block;
        margin: 10px;
        padding: 10px;
        background-color: lightgreen;
    }

</style>                  