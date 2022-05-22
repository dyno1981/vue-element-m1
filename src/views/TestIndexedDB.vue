<template>
  <div>
    <h3>IndexedDB 체험하기</h3>
    <button @click="addPerson">person 추가하기</button>
    <ul>
      <li v-for="person in people" :key="person.id">
        {{ person }} <button @click="deletePerson(person.id)">삭제</button>
      </li>
    </ul>
  </div>
</template>

<script>
const DB_NAME = 'PeopleDB'
const DB_VERSION = 1

export default {
  name: 'TestIndexedDB',
  data() {
    return {
      db: null,
      people: [],
    }
  },
  created() {
    this.initializeData()
  },
  methods: {
    async initializeData() {
      this.db = await this.getDB()
      this.people = await this.getPeopleFromDB()
    },
    getDB() {
      // indexedDB는 비동기 이므로 Promise를 사용해야함
      // db에 열고 -> 해당 db객체를 가져옴
      return new Promise((resolve, reject) => {
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
    getPeopleFromDB() {
      // db의 트랙잭션이 people를 가리키도록 하고 -> cursor를 사용해 db의 데이터를 모두 가져옴
      return new Promise(resolve => {
        const people = []
        const transaction = this.db.transaction(['people'], 'readonly')
        const objStore = transaction.objectStore('people')
        const cursorRequest = objStore.openCursor()

        cursorRequest.onsuccess = e => {
          const cursor = e.target.result
          if (cursor) {
            people.push(cursor.value)
            cursor.continue()
          }
        }
        transaction.oncomplete = () => resolve(people)
      })
    },
    async addPerson() {
      const person = {
        name: 'person' + Math.floor(Math.random() * 100),
        age: Math.floor(Math.random() * 10) + 1,
      }
      await this._addPersonToDB(person)
      this.people = await this.getPeopleFromDB()
    },
    _addPersonToDB(person) {
      return new Promise(resolve => {
        const transaction = this.db.transaction(['people'], 'readwrite')
        const objStore = transaction.objectStore('people')
        objStore.add(person)
        transaction.oncomplete = () => resolve()
      })
    },
    async deletePerson(id) {
      await this._deletePersonFromDB(id)
      this.people = await this.getPeopleFromDB()
    },
    async _deletePersonFromDB(id) {
      return new Promise(resolve => {
        const transaction = this.db.transaction(['people'], 'readwrite')
        const objStore = transaction.objectStore('people')
        objStore.delete(id)
        transaction.oncomplete = () => resolve()
      })
    },
  },
}
</script>

<style scoped></style>
