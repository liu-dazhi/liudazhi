<template>
  <view>
      <view
      v-show="item.showOptions"
        v-for="item in rouletteItems"
        :key="item.id"
        :style="{ backgroundColor: item.color }"
        class="item"
      >
        <view  @click="showNowModel(item)">
          <span >
            {{ item.name }}
          </span>
        </view>
        <view  @click="checkoutGroup(item)">
          <button class="checout-btn">选择</button>
          </view>
        </view>
      <view @click="showInsertModal">
        <button class="insert-btn">+</button>
      </view>

      <!-- 插入内容的模态框 -->
      <div v-if="showModal" class="modal">
        <div class="modal-content">
          <FormLayout layout="vertical"> </FormLayout>
          <input type="text" v-model="newItem" placeholder="输入分组名称" />
          <div class="modal-buttons" style="margin-top: 5px">
            <button class="cancel-btn" @click="cancelInsert">取消</button>
            <button class="confirm-btn" @click="insertItem">确认</button>
          </div>
        </div>
      </div>

      <div v-if="showUpdateModal" class="modal">
        <div class="modal-content">
          <input type="text" v-model="updateItem" placeholder="输入修改后的内容" />
          <div class="modal-buttons" style="margin-top: 5px">
            <button class="cancel-btn" @click="cancelUpdate">取消</button>
            <button class="confirm-btn" @click="updateItemApply">确认</button>
          </div>
        </div>
      </div>
    <PendingGroup ref="pendingGroup"></PendingGroup>
  </view>
</template>
<script>
import axios from "axios";
import PendingGroup from "./PendingGroup.vue";

export default {
  components: {
    PendingGroup,
  },
  data() {
    return {
      rouletteItems: [],
      newItem: "",
      updateItem: "",
      itmeId: "",
      showModal: false,
      showUpdateModal: false,
      nowModel: true,
      
    };
  },
  created() {
    this.fetchRouletteItems();
  },
  methods: {
    checkoutGroup(item){
      console.log(item.id)
      axios
        .post(`/api/group/checkGroup?groupId=${item.id}`)
        .then((res) => {
          if(res.data.code===200){
            alert("操作成功")
          }else{
            var char = '操作失败：' + res.data.message
            alert(char)
          }
        })
        .catch((error) => {
          var char = '操作失败：' + error.response.data.message
          alert(char)
        });
    },
    fetchRouletteItems() {
      axios
        .get("/api/group/getGroupData")
        .then((response) => {
          this.rouletteItems = response.data.data.map((item) => ({
            id: item.id,
            name: item.name,
            color: getRandomColor(),
            showOptions: true
          }));
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    },
    showNowModel(item) {
      this.rouletteItems.forEach((i) => {
        if (i.id !== item.id) {
          i.showOptions = !i.showOptions;
        } else {
          i.showOptions = true;
        }
      });
      if (this.nowModel) {
        this.$refs.pendingGroup.show(item.id);
      }else{
        this.$refs.pendingGroup.close();
      }
      this.nowModel = !this.nowModel
   
    },
    deleteItem(item) {
      if (confirm("确定要删除吗？")) {
        axios
          .post("/api/deleteData", { id: item.id })
          .then((response) => {
            console.log("Item deleted:", response.data);
            this.fetchRouletteItems();
          })
          .catch((error) => {
            console.error("Error deleting item:", error);
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
      if (!this.updateItem) {
        alert("请输入修改后的内容");
        return;
      }
      axios
        .post("/api/updateData", { name: this.updateItem, id: this.itmeId })
        .then((response) => {
          console.log("Item updateData:", response.data);
          this.fetchRouletteItems();
          this.updateItem = "";
          this.showUpdateModal = false;
        })
        .catch((error) => {
          console.error("Error updateData item:", error);
        });
    },
    insertItem() {
      if (!this.newItem) {
        alert("请输入待插入的内容");
        return;
      }
      axios
        .post("/api/insertData", { name: this.newItem })
        .then((response) => {
          console.log("Item inserted:", response.data);
          this.fetchRouletteItems();
          this.newItem = "";
          this.showModal = false;
        })
        .catch((error) => {
          console.error("Error inserting item:", error);
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
  const letters = "0123456789ABCDEF";
  let color = "#";
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
  width: 70%;
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

.checout-btn {
  position: absolute;
  bottom: 0px;
  right: -68px;
 
  height: 36px;
  background-color: #007bff;
  color: #fff;
  font-size: 15px;
  align-items: center;
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
