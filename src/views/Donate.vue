<template>
  <div  id="donatePage">
    <div class="title_donate">Donate Book</div>
    <!-- case: user has no any pending request -->
    <div v-show="!isReqSent" class="ctn_label">
      <div class="ctn_form">
        <form action="" class="box_form">

          <div class="box_E-book_name">
            <label>E-Book Name</label>
            <input :maxlength="56" type="text" v-model="DonateReq.name"  placeholder="enter e-book name"/>
          </div>

          <div class="box_ISBN">
            <label>ISBN</label>
            <input :maxlength="56" type="text" v-model="DonateReq.ISBN"  placeholder="optional"/>
          </div>

          <div class="box_category">
            <label>Category</label>
            <input :maxlength="56" type="text" v-model="DonateReq.category"  placeholder="optional"/>
          </div>

          <div class="box_Author">
            <label>Author</label>
            <input :maxlength="56" type="text" v-model="DonateReq.author"  placeholder="optional"/>
          </div>

          <div class="box_Publisher">
            <label>Publisher</label>
            <input :maxlength="56" type="text" v-model="DonateReq.publisher"  placeholder="optional"/>
          </div>

          <div class="box_description">
            <label>book_description</label>
            <input :maxlength="879" type="text" v-model="DonateReq.book_description"  placeholder="optional"/>
          </div>

          <div class="box_image_URL">
              <label >Image URL</label>
              <input type="text" v-model="DonateReq.image"  placeholder="optional"/>
          </div>

        </form>
      </div>

      <div class="add_Ebook_file">
          <h1>Add E-Book File</h1>
          <div class="box_chooseFile">
            <input type="file" name="file" id="file" ref="file" accept="application/pdf" @change="onChangeFileUpload()">
          </div>
          <div @click="submitForm()" class="submit_box">Submit</div> 
      </div>
    </div>

    <!--case: user already has pending request  -->
    <div v-show="isReqSent" class="ctn_Successful">
        <strong>Please, Wait for your current request to be checked.</strong>
        <div v-if="currentReq.image != ''" class="box_image_Successful">
          <img :src="currentReq.image" alt="">
        </div>
        <div class="ctn_content_donate">
          <div>username  | {{currentReq.username}}</div>
          <div>E-Book Name | {{currentReq.name}}</div>
          <div>category | {{currentReq.category}}</div>
          <div>author | {{currentReq.author}}</div>
          <div>publisher | {{currentReq.publisher}}</div>
          <div>book_description | {{currentReq.book_description}}</div>
          <!-- <div>img URL: {{currentReq.image}}</div> -->
          <div>file name | {{currentReq.realFileName}}</div>
          <div>time sent | {{ gettime(currentReq.time_sent) }} : {{ new Date(currentReq.time_sent).toLocaleTimeString('en-US', {
          hour: 'numeric', minute: 'numeric', hour12: true }).toString() }}</div>
        </div>  
    </div>

  </div>
</template>

<script>
import axios from 'axios'
// import { bookHandler } from '../../mixins/MixinFunction';

export default {
  name:'donatePage',
  components: {
      
  },
  data() {
    return {
      isReqSent: false,
      DonateReq:{
        username:"",
        ISBN:"",
        name:"",
        book_description:"",
        category:"",
        image:"",
        author:"no information",        
        publisher:"",
        status: "",
        realFileName:"",
        filename:"",
        time_sent:"",
        time_resolved:""
      },
      file: '',
      currentReq: '',
      allRequest:null
      
    }
  },
  methods: {
    gettime(itemTime) {
      let str = new Date(itemTime).toString().split(' ')
      return str[0] + ', ' + str[1] + ' ' + str[2] + ' ' + str[3]
    },
    onChangeFileUpload(){
        this.file = this.$refs.file.files[0]
    },
    async getPendingRequest() {
        let username = JSON.parse(localStorage.getItem('user_info'))?.username
        // await axios.get(`http://localhost:3000/donate/${username}`)
        await axios.get(`http://localhost:3000/donateAll`)
        .then((res) => res.data)
        .then(data => {
            
            this.allRequest = data.filter(r=>r.status == 'pending' && r.username==username)
        })
        .catch((error) => {
            console.log(error);
        });
    },

    async getAllRequest() {
        // let username = JSON.parse(localStorage.getItem('user_info'))?.username
        // await axios.get(`http://localhost:3000/donate/${username}`)
        await axios.get(`http://localhost:3000/donateAll`)
        .then((res) => res.data)
        .then(data => {
            
            this.allRequest = data
        })
        .catch((error) => {
            console.log(error);
        });
    },
    async submitForm(){
      this.DonateReq.realFileName = this.file.name
      let username = JSON.parse(localStorage.getItem('user_info'))?.username

      await this.getAllRequest()

      if (this.allRequest != null){
        if (this.allRequest.filter(r=>r.realFileName == this.DonateReq.realFileName).length != 0) {
          alert(`This file is already existed in the database or may be denied before!`)
        }
        else if (this.allRequest.filter(r=>r.name == this.DonateReq.name).length != 0) {
          alert(`This book name is already existed in database! Your book might be existed in the database or please change your book's name.`)
        }else {
          // get resolved donated requests (file is existed in db)
          let filtered = []
          if (this.allRequest != null)
            filtered = this.allRequest.filter((ele) => ele.realFileName == this.DonateReq.realFileName)
          
          // no file
          if (filtered.length == 0) {
            let formData = new FormData();
            formData.append('file', this.file);
            await axios.post(`http://localhost:3000/upload/${username}`,
                    formData,
                    {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                  }
            )
            .then(async (data) => {
              this.DonateReq.username = username
              this.DonateReq.status = "pending"
              this.DonateReq.filename = data.data.file.filename 
              this.DonateReq.time_sent = new Date()
              await axios.post(`http://localhost:3000/donate/${username}`, this.DonateReq)
              .then(response => {
                    console.log('response: ', response)
                    this.isReqSent = true
                    this.CheckIfReqWasSent()
              })
              .catch(error => console.log(error))
            })
          }else{
            this.DonateReq.username = username
            this.DonateReq.status = "pending"
            this.DonateReq.filename = filtered[0].filename
            this.DonateReq.time_sent = new Date()
            await axios.post(`http://localhost:3000/donate/${username}`, this.DonateReq)
            .then(response => {
                  console.log('response: ', response)
                  this.isReqSent = true
                  this.CheckIfReqWasSent()
            })
            .catch(error => console.log(error))
          }
          alert(`donation request is sent successfully!`)
        }
        
      }
    },
    async CheckIfReqWasSent() {
      let username = JSON.parse(localStorage.getItem('user_info'))?.username
      await axios
        .get(`http://localhost:3000/donate/${username}`)
        .then((res) => res.data)
        .then((data) => {
          const filtered = data.filter((ele) => ele.status == "pending")
          if (filtered.length != 0) {
            this.currentReq = filtered[0]
            this.isReqSent = true
          }else{
            this.isReqSent = false
          }
        })
    }
    
  },
  mounted() {
    this.CheckIfReqWasSent()
    
    setTimeout(() => {
        let box_image_Successful = document.getElementsByClassName('box_image_Successful')[0]
        if (box_image_Successful)
          box_image_Successful.style.height = `${box_image_Successful.clientWidth}px`
    }, 100)
  },
  watch: {
    isReqSent() {
      setTimeout(() => {
        let box_image_Successful = document.getElementsByClassName('box_image_Successful')[0]
        box_image_Successful.style.height = `${box_image_Successful.clientWidth}px`
      }, 100)
    }
  }
  
}
</script>

<style>
   @import '../assets/css/donate.css';
</style>
