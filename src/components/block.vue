<template>
  <v-container>
    <v-alert type="error" :value="true">
      로그인이 필요한 페이지 입니다.
    </v-alert>
    <v-btn color="info" block @click="$router.push('/')">로그인 하러 가기</v-btn>
  </v-container>
</template>