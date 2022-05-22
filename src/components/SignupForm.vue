<template>
  <div class="contents">
    <div class="form-wrapper form-wrapper-sm">
      <form @submit.prevent="submitForm" class="form">
        <div>
          <label for="username">id: </label>
          <input id="username" type="text" v-model="username" />
        </div>
        <div>
          <label for="password">pw: </label>
          <input id="password" type="text" v-model="password" />
        </div>
        <div>
          <label for="nickname">nickname: </label>
          <input id="nickname" type="text" v-model="nickname" />
        </div>
        <button type="submit" class="btn">회원 가입</button>
      </form>
      <p class="log">{{ logMessage }}</p>
    </div>
  </div>
</template>

<script>
const DB_NAME = 'SignupDB'
const DB_VERSION = 1

export default {
  name: 'SignupForm',
  data() {
    return {
      // form values
      username: '',
      password: '',
      nickname: '',
      // log
      logMessage: '',
      db: null,
    }
  },
  methods: {
    async initializeData() {
      this.db = await this.getIndexedDB()
    },
    async getIndexedDB() {
      return new Promise((resolve, reject) => {
        // indexedDB는 비동기 이므로 Promise를 사용해야함
        // db에 열고 -> 해당 db객체를 가져옴
        const request = window.indexedDB.open(DB_NAME, DB_VERSION)
        //  새로운 데이터 베이스 만들 때 발생하는 이벤트

        const transaction = this.db?.transaction(['people'])
        if (!transaction) {
          request.onupgradeneeded = e => {
            const db = e.target.result
            db.createObjectStore('people', {
              autoIncrement: true,
              keyPath: 'id',
            })
          }
        }
        request.onerror = e => reject(e)
        request.onsuccess = e => resolve(e.target.result)
      })
    },
    // async submitForm() {
    //   const userData = {
    //     username: this.username,
    //     password: this.password,
    //     nickname: this.nickname,
    //   }
    //   const { data } = await registerUser(userData)
    //   console.log(data.username)
    //   this.logMessage = `${data.username} 님이 가입되었습니다`
    //   this.initForm()
    // },
    initForm() {
      this.username = ''
      this.password = ''
      this.nickname = ''
    },
  },
}
</script>

<style scoped></style>
