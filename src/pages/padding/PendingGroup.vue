<template >
  <view>
    <template v-if="modal">
    <span v-if="rouletteItems.length === 0 && modal"> 该分组没有数据，快点添加吧~ </span>

    <view v-for="item in rouletteItems" :key="item.id" :style="{ backgroundColor: item.color }" class="item"
      @click="showOptions(item)">
      {{ item.name }}
      <view v-if="item.showOptions" class="options">

        <span @click.stop="deleteItem(item)">
          <box-icon name='message-square-x' color="red" size="20"></box-icon>
        </span>

        <span @click.stop="editItem(item)">
          <box-icon name='edit-alt' color="blue" size="20"></box-icon>
        </span>

      </view>
    </view>
    
    <view @click="showInsertModal">
      <button class="insert-btn">+</button>
    </view>


    <!-- 插入内容的模态框 -->
    <div v-if="showModal" class="modal">

      <div class="modal-content">
        <FormLayout layout="vertical">
        
      </FormLayout>
          <input type="text" v-model="newItem" placeholder="输入待插入的内容" />
        <div class="modal-buttons" style="margin-top: 5px;">
          <button class="cancel-btn" @click="cancelInsert">取消</button>
          <button class="confirm-btn" @click="insertItem">确认</button>
        </div>
      </div>
    </div>

    <div v-if="showUpdateModal" class="modal">
      <div class="modal-content">
        <input type="text" v-model="updateItem" placeholder="输入修改后的内容" />
        <div class="modal-buttons"  style="margin-top: 5px;">
          <button class="cancel-btn" @click="cancelUpdate">取消</button>
          <button class="confirm-btn" @click="updateItemApply">确认</button>
        </div>
      </div>
    </div>
  </template>
  </view>
</template>
<script>
import axios from 'axios';

export default {
  data() {
    return {
      rouletteItems: [],
      newItem: '',
      updateItem: '',
      itmeId: '',
      groupId: '',
      showModal: false,
      showUpdateModal: false,
      modal: false
    };
  },
  created() {
   
  },
  methods: {
    fetchRouletteItems(itemId) {
      axios.get('/api/getData',{
        params:{
          groupId:itemId
        }
      })
        .then(response => {
          this.rouletteItems = response.data.data.map(item => ({
            id: item.id,
            name: item.name,
            color: getRandomColor(),
            showOptions: false,
          }));
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
    },
    show(id){
      this.fetchRouletteItems(id);
      this.groupId = id;
      this.modal = true;
    },
    close(){
      this.modal = false;
    },
    showOptions(item) {
      this.rouletteItems.forEach(i => {
        if (i.id === item.id) {
          i.showOptions = !i.showOptions;
        } else {
          i.showOptions = false;
        }
      });
    },
    deleteItem(item) {
      if (confirm('确定要删除吗？')) {
        axios
          .post('/api/deleteData', { id: item.id })
          .then(response => {
            console.log('Item deleted:', response.data);
            this.fetchRouletteItems(this.groupId);
          })
          .catch(error => {
            console.error('Error deleting item:', error);
          });
      }
    },

    editItem(item) {
      this.itmeId = item.id;
      // 编辑操作
      this.showUpdateModal = true;
    },
    showInsertModal() {
      this.showModal = true;
    },
    cancelInsert() {
      this.showModal = false;
    },
  
    cancelUpdate() {
      this.showUpdateModal = false;
    },
    updateItemApply() {
      if(!this.updateItem){
        alert('请输入修改后的内容');
        return;
      }
      axios.post('/api/updateData', { name: this.updateItem, id: this.itmeId })
        .then(response => {
          console.log('Item updateData:', response.data);
          this.fetchRouletteItems(this.groupId);
          this.updateItem = '';
          this.showUpdateModal = false;
        })
        .catch(error => {
          console.error('Error updateData item:', error);
        });

    },
    insertItem() {
      if(!this.newItem){
        alert('请输入待插入的内容');
        return;
      }
      axios.post('/api/insertData', { name: this.newItem,groupId:this.groupId })
        .then(response => {
          console.log('Item inserted:', response.data);
          this.fetchRouletteItems(this.groupId);
          this.newItem = '';
          this.showModal = false;
        })
        .catch(error => {
          console.error('Error inserting item:', error);
        });
    },
    startLongPress(item) {
      this.longPressTimer = setTimeout(() => {
        this.showOptions(item);
      }, 500); // 设置长按时间，单位为毫秒
    },
    endLongPress() {
      clearTimeout(this.longPressTimer);
    },
  },
};

function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
</script>
<style scoped>
.item {
  display: inline-block;
  padding: 8px 16px;
  margin: 8px;
  border-radius: 8px;
  color: #fff;
  font-weight: bold;
  text-align: center;
  position: relative;
  cursor: pointer;
}

.options {
  position: absolute;
  top: -3px;
  right: -2px;
  display: flex;
}

.options button {
  margin-left: 4px;
}

.delete {
  background-color: #ff3b30;
}

.edit {
  background-color: #007bff;
}

.insert-btn {
  position: fixed;
  bottom: 80px;
  right: 20px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #007bff;
  color: #fff;
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
}


.back-btn {
  position: fixed;
  bottom: 80px;
  right: 370px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #007bff;
  color: #fff;
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background-color: #fff;
  padding: 16px;
  border-radius: 8px;
}

.modal input {
  margin-bottom: 8px;
  padding: 8px;
  width: 200px;
}

.modal-buttons {
  display: flex;
  justify-content: flex-end;
}

.modal-buttons button {
  padding: 8px -1px;
  margin-left: 8px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.cancel-btn {
  background-color: #ccc;
}

.confirm-btn {
  background-color: #007bff;
}
</style>