<template>
  <div class="media">
    <el-row class="media-wrapper" :class="{'page-content':!isLayer,'border-wrapper':isLayer}">
      <el-col :span="20" class="picture-main">
        <el-row class="title-row">
          <el-col :span="6" class="title-block">{{currentSelectPicGroup.groupName}}&nbsp;
            <!-- <el-popover ref="groupNameEdit" popper-class="group-name-edit" placement="right" trigger="click" v-model="isVisible__groupNameEdit__popover">
            <div class="title">编辑名称</div>
            <div class="input-name">
              <el-input placeholder="请输入分组名称" v-model="groupName__edit"></el-input>
            </div>
            <div class="operate-btn">
              <el-button type="primary" @click="confirmEditGroup">确认</el-button>
              <el-button @click="isVisible__groupNameEdit__popover = false">取消</el-button>
            </div>
          </el-popover>
          <el-tooltip class="item" effect="dark" content="编辑名称" placement="bottom">
            <i class="el-icon-edit title-icon-edit" v-popover:groupNameEdit v-show="currentSelectPicGroup.id > 2"></i>
        </el-tooltip> -->
    </el-col>
    <el-col :span="18" class="upload-block">
      <span>提示：图片大小不超过3M</span>
      <el-upload ref="upload" class="upload" :action="storageSiteUrl + '/xk-api/media/v1/picture'" :on-preview="handlePreview" :on-remove="handleRemove" :show-file-list="false" :file-list="fileList" :before-upload="handleBeforeUpload" :data="uploadExtraData" :on-success="handleUploadSuccess" :on-error="handleUploadError" :on-change="handleUploadChange" :multiple="true">
        <el-button type="primary">点击上传</el-button>
          <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
        </el-upload>
      </el-col>
  </el-row>
  <el-row class="operate-row">
    <el-col :span="4" class="all-selected-block">
      <el-checkbox v-model="allChecked" :indeterminate="allChecked_indeterminate" @change="allCheckedCallBack()" :disabled="JSON.stringify(picList) == '[]' ? true : false">全选</el-checkbox>
    </el-col>
    <el-col :span="20" class="other-block">
      <el-tooltip placement="bottom" effect="light" popper-class="pic-move-container" :manual="true" v-model="isVisible__movePicDialog__multi">
        <el-button type="primary" :disabled="isDisabled__multiOperate" @click="showMovePicDialog__multi()">移动分组</el-button>
        <el-row class="content" slot="content">
          <div class="title">
            移动至分组：
          </div>
          <div class="group-list">
            <span class="group-list-item" v-for="(item2, index2) in picGroupList" v-if="index2 != 0 && currentSelectPicGroup.id != item2.id"><el-radio class="radio" v-model="picGroupId__selectToMove__multi" :label="item2.id">{{item2.group_name}}</el-radio></span>
          </div>
          <div class="operate-btn">
            <el-button type="primary" @click="confirmMovePic__multi()">确认</el-button>
            <el-button @click="hiddenMovePicDialog__multi()">取消</el-button>
          </div>
        </el-row>
      </el-tooltip>
      <el-tooltip placement="bottom" effect="light" popper-class="pic-delete-container" :manual="true" v-model="isVisible__deletePicDialog__multi">
        <el-button type="primary" :disabled="isDisabled__multiOperate" @click="showDeletePicDialog__multi()">删除</el-button>
        <el-row class="content" slot="content">
          <div class="text">
            您确定要删除选中的图片吗？
          </div>
          <div class="operate-btn">
            <el-button type="primary" @click="confirmDeletePic__multi()">确认</el-button>
            <el-button @click="hiddenDeletePicDialog__multi()">取消</el-button>
          </div>
        </el-row>
      </el-tooltip>
    </el-col>
  </el-row>
  <el-row class="content-area">
    <el-row class="content-empty-row" v-if="JSON.stringify(picList) == '[]'">哎呀，好像没有可以显示的图片哦~</el-row>
    <el-row class="content-row" type="flex" justify="start" v-else v-for="(row, idx) in picList" :key="idx">
      <el-col :span="pageItemValue" :offset="1" class="content-item" v-for="(item, index) in row" :key="index">
        <div :class="'item-img img-h' + itemHeightVal">
          <img class="lists" :title="item.pic_name.substring(0,(item.pic_name.length-4))" v-if="isLayer" :src="item.pic_url" @click="checkedPic(item.id)">
          <img class="lists" :title="item.pic_name.substring(0,(item.pic_name.length-4))" v-else :src="item.pic_url" @click="showPicDetailDialog(item.id)">
          <el-dialog title="图片详情" class="image-dialog" :class="{'is-up-to':isLayer}" size="small" top="5%" :visible.sync="isVisible__picDetaiDialog">
            <el-row>
              <el-col :span="15" class="image-origin">
                <img :src="picInfo.pic_url">
              </el-col>
              <el-col :span="9" class="image-info">
                <p class="image-name"><span class="label">文件名：</span>{{picInfo.pic_origin_name}}</p>
                <p class="image-type"><span class="label">文件类型：</span>{{picInfo.pic_type}}</p>
                <p class="image-type"><span class="label">文件大小：</span>{{(picInfo.pic_size/1024).toFixed(2) + 'KB'}}</p>
                <p class="image-type"><span class="label">分辨率：</span>{{picInfo.pic_width && picInfo.pic_height ? picInfo.pic_width + 'X' + picInfo.pic_height : ''}}</p>
                <p class="image-type"><span class="label">上传者：</span>{{picInfo.user_login}}</p>
                <p class="image-type"><span class="label">上传于：</span>{{picInfo.create_date}}</p>
                <p class="image-type"><span class="label">更新于：</span>{{picInfo.update_date}}</p>
                <hr style="border-top:1px solid #bbb;margin-bottom:20px;">
                <p class="image-url"><span class="label-large">url：</span>
                  <el-input class="input" :value="picInfo.pic_url" :readonly="true"></el-input>
                </p>
                <p class="image-title"><span class="label-large">名称：</span>
                  <el-input class="input" v-model="picName__edit"></el-input>
                </p>
                <p class="image-decs"><span class="label-large">描述：</span>
                  <el-input class="input" type="textarea" v-model="picDesc__edit" placeholder="请输入描述内容,不超过100个字" :maxlength="150"></el-input>
                </p>
                <p class="image-to-save">
                  <el-button type="primary" @click="saveEditPic(picInfo.id)">保存</el-button>
                </p>
              </el-col>
            </el-row>
          </el-dialog>
        </div>
        <p class="item-title">{{item.pic_name}}</p>
        <p class="item-checked">
          <el-checkbox v-model="picArr[item.id].isChecked" @change="getAllCheckedStatus(item.id)">{{item.pic_group_name}}</el-checkbox>
        </p>
        <p class="item-operate">
          <el-tooltip placement="bottom" effect="light" popper-class="pic-edit-container" :manual="true" v-model="picArr[item.id].isVisible__editPicDialog">
            <el-tooltip class="item" effect="dark" content="编辑名称" placement="top-start"><i class="el-icon-edit" @click="showEditPicDialog(item.id)"></i></el-tooltip>
            <el-row class="content" slot="content">
              <div class="title">编辑名称</div>
              <div class="input-name">
                <el-input placeholder="请输入图片名称" v-model="picName__edit"></el-input>
              </div>
              <div class="operate-btn">
                <el-button type="primary" @click="confirmEditPic(item.id)">确认</el-button>
                <el-button @click="hiddenEditPicDialog(item.id)">取消</el-button>
              </div>
            </el-row>
          </el-tooltip>
          <el-tooltip placement="bottom" effect="light" popper-class="pic-move-container" :manual="true" v-model="picArr[item.id].isVisible__movePicDialog">
            <el-tooltip class="item" effect="dark" content="移动分组" placement="top"><i class="el-icon-picture" @click="showMovePicDialog(item.id)"></i></el-tooltip>
            <el-row class="content" slot="content">
              <div class="title">
                移动至分组：
              </div>
              <div class="group-list">
                <span class="group-list-item" v-for="(item2, index2) in picGroupList" v-if="index2 != 0 && item.pic_group_id != item2.id"><el-radio class="radio" v-model="picGroupId__selectToMove" :label="item2.id">{{item2.group_name}}</el-radio></span>
              </div>
              <div class="operate-btn">
                <el-button type="primary" @click="confirmMovePic(item.id)">确认</el-button>
                <el-button @click="hiddenMovePicDialog(item.id)">取消</el-button>
              </div>
            </el-row>
          </el-tooltip>
          <el-tooltip placement="bottom" effect="light" popper-class="pic-delete-container" :manual="true" v-model="picArr[item.id].isVisible__deletePicDialog">
            <el-tooltip class="item" effect="dark" content="删除" placement="top-end"><i class="el-icon-delete" @click="showDeletePicDialog(item.id)"></i></el-tooltip>
            <el-row class="content" slot="content">
              <div class="text">
                您确定要删除这张图片吗？
              </div>
              <div class="operate-btn">
                <el-button type="primary" @click="confirmDeletePic(item.id)">确认</el-button>
                <el-button @click="hiddenDeletePicDialog(item.id)">取消</el-button>
              </div>
            </el-row>
          </el-tooltip>
        </p>
      </el-col>
    </el-row>
  </el-row>
  <el-row class="pagination-row" v-show="isVisible__pagination">
    <el-pagination layout="total, sizes, prev, pager, next, jumper" :total="pagination.total" :page-size="pagination.size" :page-sizes="pagination.sizes"
      :current-page="pagination.curPage" @current-change="pageChangeCallBack" @size-change="handleSizeChange">
    </el-pagination>
  </el-row>
  <el-row class="confirm-selected-row" v-show="isVisible__confirmSelected && isLayer">
    <el-button type="primary" size="large" @click="confirmSelected" :disabled="isDisabled_confirmSelected">确认</el-button>
    <el-button size="large" @click="confirmCancel">取消</el-button>
  </el-row>
  </el-col>
  <el-col :span="4" class="picture-group">
    <ul class="group-ul">
      <li :class="{'is-selected':item.id == currentSelectPicGroup.id}" v-for="(item, index) in picGroupList" :data-id="item.id" @click="selectPicGroup(item.id, item.group_name)">{{item.group_name}}
        <span class="picture-count">({{item.group_pic_count}})</span>
        <el-popover popper-class="group-name-edit" placement="bottom" trigger="click" v-model="picGroupList[index].isVisible__groupNameEdit__popover">
          <div class="title">编辑名称</div>
          <div class="input-name">
            <el-input placeholder="请输入分组名称" v-model="groupName__edit"></el-input>
          </div>
          <div class="operate-btn">
            <el-button type="primary" @click="confirmEditGroup(index)">确认</el-button>
            <el-button @click="picGroupList[index].isVisible__groupNameEdit__popover = false">取消</el-button>
          </div>
          <i class="el-icon-edit group-icon-edit" slot="reference" @click.stop></i>
        </el-popover>
              <!-- <el-tooltip class="item" effect="dark" content="编辑名称" placement="bottom">
            </el-tooltip> -->
            <i class="el-icon-delete" @click.stop="deletePicGroup(item.id)"></i>
          </li>
          <el-tooltip placement="bottom" effect="light" popper-class="group-add-container" :manual="true" v-model="isVisible__addPicGroupDialog">
            <li @click="showAddPicGroupDialog"><i class="el-icon-plus"></i>新建分组</li>
            <el-row class="content" slot="content">
              <div class="title">创建分组</div>
              <div class="input-name">
                <el-input placeholder="请输入分组名称" v-model="groupName__add"></el-input>
              </div>
              <div class="operate-btn">
                <el-button type="primary" @click="confirmAddPicGroup">确认</el-button>
                <el-button @click="hiddenAddPicGroupDialog">取消</el-button>
              </div>
            </el-row>
          </el-tooltip>
        </ul>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  // import url from '../assets/js/port.js'
  export default {
    data() {
      return {
        picArr: [], // 图片对象数组，操作各个图片的数据驱动来源
        pageItemValue: 5,
        itemHeightVal: '1',
        picList: '', // 图片列表
        picGroupList: [], //图片分组列表
        fileList: [],
        isVisible__addPicGroupDialog: false, // 新增图片分组的弹框是否显示
        groupName__add: '', // 新增图片分组的名称
        uploadExtraData: { // 上传图片时额外的参数对象
          user_id: 1,
          user_login: 'admin',
          pic_group_id: 1,
          pic_group_name: '全部图片'
        },
        loadingObj: {}, // el-loading实例对象
        picName__edit: '', //当前输入的图片编辑名称
        picDesc__edit: '', //当前输入的图片描述内容
        groupName__edit: '', //当前输入的图片分组名称
        // isVisible__groupNameEdit__popover: false, // 是否显示分组名称编辑弹框
        currentSelectPicGroup: {}, // 当前选择的分组（所在的分组）
        picGroupId__selectToMove: '', // 选择将图片要移动到的分组id
        picGroupId__selectToMove__multi: '', // 选择将多个图片要移动到的分组id
        allChecked: false, // 全选是否已经选中
        allChecked_indeterminate: false, // 全选是否为indeterminate状态
        isVisible__movePicDialog__multi: false, // 是否显示多选移动分组框
        isVisible__deletePicDialog__multi: false, // 是否显示多选删除框
        pagination: { // 分页的配置
          total: 0, //图片分组中所有的图片总数
          size: 8, // 每页显示的个数
          curPage: 1, // 当前页码
          rowItem: 4, // 一行显示个数
          sizes: [8, 18, 32], // 每页显示条数
        },
        isVisible__pagination: false, // 分页栏是否显示
        isVisible__confirmSelected: false, // 确认选择图片操作栏是否显示
        isVisible__picDetaiDialog: false, //单张图片的显示浮层是否显示
        picInfo: {}, //单张图片的详细信息对象
        storageSiteUrl: 'http://kkd.demo.kaensoft.com'
      }
    },
    props: {
      isLayer: {
        default: false, // 是否以被调用的浮层显示
        // type: Boolean,
      },
      onlyPng: {
        default: false, // 只能传png
        // type: Boolean,
      },
      // storageSiteUrl: {
      //   default: url.imgbase
      // }
    },
    computed: {
      isDisabled__multiOperate() {
        let isDisabled = true
        this.picArr.forEach((val, idx) => {
          if(val.isChecked == true) {
            isDisabled = false
          }
        })
        return isDisabled
      },
      isDisabled_confirmSelected() {
        return this.isDisabled__multiOperate
      }
    },
    watch: {
      currentSelectPicGroup(val) {
        this.uploadExtraData.pic_group_id = val.id
        this.uploadExtraData.pic_group_name = val.groupName
      },
      // 全选是否已经选中
      allChecked(val) {
        if(val == true) {
          this.picArr.forEach((val, idx) => {
            val.isChecked = true
          })
        } else {
          this.picArr.forEach((val, idx) => {
            val.isChecked = false
          })
        }
      },
    },
    methods: {

      handlePreview(file, fileList) {
        // console.log(file, fileList);
      },
      handleRemove(file) { // 当图片在handleBeforeUpload钩子中被阻止，会回调这个方法
        console.log('move');
      },
      handleBeforeUpload(file) {
        let $this = this
        return new Promise((resolve, reject) => {
          if(file.size / 1024 / 1024 > 3) {
            reject('上传的图片大小超过3M')
          }
          let reader = new FileReader()
          reader.onload = function() {
            let image = new Image()
            image.onload = function() {
              let width = image.width
              let height = image.height
              $this.$set($this.uploadExtraData, 'pic_width', width) // 图片的宽度
              $this.$set($this.uploadExtraData, 'pic_height', height) // 图片的高度
              $this.$set($this.uploadExtraData, 'store_id', JSON.parse(localStorage.getItem('user_shop')).store_id) // 图片的高度
              if(width == 0 || height == 0) {
                reject()
              } else {
                resolve()
              }
            }
            image.src = reader.result
          }
          reader.readAsDataURL(file)
        }).then(() => {
          $this.thisLoadingInit('努力上传中...')
        }).catch(function(err) { // es6语法简写不支持arguments拿取参数
          $this.$message({
            message: arguments[0] ? arguments[0] : '图片上传已被取消~',
            type: 'warning'
          })
          reject()
        })

        // let $this = this
        // this.loadingObj = $this.$loading({
        //   target: '.menu-main',
        //   text: '处理中...',
        //   customClass: 'loading-style'
        // })
        // //
        // var promise = new Promise((resolve, reject) => {
        //   jQuery.ajax({
        //     type: 'GET',
        //     url: this.storageSiteUrl + '/xk-api/media/v1/picture',
        //     data: {
        //       exec_picture_exist: true,
        //       picture_origin_name: file.name
        //     },
        //     success(res) {
        //       console.log(res)
        //       resolve(res); // resolve()
        //     },
        //     error(error) {
        //       reject(error); // resolve()
        //       console.log(error);
        //     }
        //   })
        // })
        //
        // return promise.then((res) => {
        //   $this.loadingObj.close()
        //
        //   if (res.erron == 0) { // 表示媒体库已经存在该同名的图片，那么提示用户是否选择覆盖上传
        //     return $this.$confirm('媒体库已经存在同名的图片，选择继续上传将覆盖同名图片，是否继续?', '温馨提示', {
        //       confirmButtonText: '确定',
        //       cancelButtonText: '取消',
        //       type: 'warning'
        //     }).then(() => {
        //       $this.$set($this.uploadExtraData, 'exec_cover_upload', true) // 区别与正常的上传，这是同名覆盖上传操作
        //       $this.loadingObj = $this.$loading({
        //         target: '.menu-main',
        //         text: '努力上传中...',
        //         customClass: 'loading-style'
        //       })
        //     }).catch(() => {
        //       $this.$message({
        //         message: '图片上传已被取消~',
        //         type: 'warning'
        //       })
        //       reject() // 调用 promise对象的catch方法，让它可以阻止图片上传,其实就是抛出一个错误
        //     })
        //   } else {
        //     $this.loadingObj = $this.$loading({
        //       target: '.menu-main',
        //       text: '努力上传中...',
        //       customClass: 'loading-style'
        //     })
        //   }
        // }).catch((err) => {
        //   reject() // 最后真正阻止中断图片上传的reject方法
        // })
      },
      handleUploadSuccess(response, file, fileList) {
        // this.uploadExtraData.exec_cover_upload = '' // 重置为正常的上传操作，非覆盖上传
        let $this = this
        if(response.erron == 0) { // 上传成功刷新图片列表到最新
          new Promise((resolve, reject) => {
            $this.getPicList(resolve)
            $this.getPicGroupList(resolve)
          }).then(() => {
            $this.$message({
              message: '图片上传成功~',
              type: 'success'
            })
            $this.isVisible__pagination = true
            $this.isVisible__confirmSelected = true
            $this.loadingObj.close()
          })
        }
      },
      handleUploadError(response, file, fileList) {
        this.loadingObj.close()
        this.$message({
          message: response.message,
          type: 'success'
        })
      },
      handleUploadChange(file, fileList, data) {},
      // 确认从多媒体对话框中选择一张图片
      confirmSelected() {
        let picArr__isChecked = Array()
        let i = 0
        let onlyPng = Boolean(this.onlyPng)
        let $this = this
        $this.picArr.forEach((val, idx) => {
          if(val.isChecked == true) {
            // ‘打印设置’中店铺店子印章只能上传png图
            const isPNG = val.pic_type === 'image/png';
            if (onlyPng == true) {
              if (!isPNG) {
                $this.$message.error('电子印章图片需要背景透明，只支持PNG格式的图片');
                return
              }
            }
            picArr__isChecked[i] = val
            i++
          }
        })
        $this.$emit('confirm-selected', picArr__isChecked)
        $this.$emit('hidden-media-dialog', false);
      },
      // 确认关闭多媒体对话框
      confirmCancel() {
        this.$emit('hidden-media-dialog', false);
      },
      // 点击选择一个图片分组
      selectPicGroup(id, groupName) {
        this.allChecked = false // 修复从一个分组到另一分组，全选未重置bug
        this.allChecked_indeterminate = false // 修复从一个分组到另一分组，全选未重置bug
        this.picArr.forEach((val, idx) => { // 修复一个分组到另一分组，被选中的图片对象未重置bug
          val.isChecked = false
        })
        this.currentSelectPicGroup = {
          id: id,
          groupName: groupName
        }
        // 获取该分组的图片列表
        let $this = this
        new Promise((resolve, reject) => {
          $this.thisLoadingInit('努力加载中...')
          $this.getPicList(resolve)
        }).then((res) => {
          if(res.erron == 0) {
            $this.isVisible__pagination = true
            $this.isVisible__confirmSelected = true
          } else {
            $this.isVisible__pagination = false
            $this.isVisible__confirmSelected = false
          }
          $this.loadingObj.close()
        }).catch(() => {
          $this.loadingObj.close()
        })
      },
      // 编辑图片分组名称
      editPicGroup(index) {
        // console.log(this.picGroupList[index].isVisible__groupNameEdit__popover) // 输出了 false
        // // this.$set(this.picGroupList[index], 'isVisible__groupNameEdit__popover', 2)
        // console.log(this.picGroupList[index].isVisible__groupNameEdit__popover) // 输出了 true
        // console.log(this.picGroupList[index]) // 输出的对象中 isVisible__groupNameEdit__popover 为 false
      },
      // 确认编辑分组名称
      confirmEditGroup(index) {
        let $this = this
        this.picGroupList[index].isVisible__groupNameEdit__popover = false
        let picGroupId = this.picGroupList[index].id
        this.thisLoadingInit()
        new Promise((resolve, reject) => {
          jQuery.ajax({
            type: 'PUT',
            url: $this.storageSiteUrl + '/xk-api/media/v1/picture_group/' + picGroupId,
            data: {
              exec_group_name_edit: true,
              update_obj: {
                group_name: this.groupName__edit,
                store_id: JSON.parse(localStorage.getItem('user_shop')).store_id//当前的store_id
              }
            },
            success(res) {
              $this.groupName__edit = '' // 重置分组编辑名称为空
              if(res.erron == 0) {
                $this.getPicGroupList(resolve) // 刷新图片分组列表
                $this.getPicList(resolve) // 刷新图片分组列表
              } else if(res.erron == 2) {
                reject(res.message)
              } else {
                reject()
              }
            },
            error(err) {
              reject()
            }
          })
        }).then(() => {
          $this.$message({
            message: '编辑分组名称成功啦~',
            type: 'success'
          })
          $this.loadingObj.close()
        }).catch(function(err) {
          $this.$message({
            message: arguments[0] ? arguments[0] + '~' : '编辑分组名称失败，请稍后再试~',
            type: 'warning'
          })
          $this.loadingObj.close()
        })
      },
      // 删除图片分组
      deletePicGroup(id) {
        let $this = this
        let deleteId = id
        this.$confirm('此操作将永久删除该分组, 是否继续?', '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // $this.loadingObj = $this.$loading({
          //   target: '.menu-main',
          //   text: '处理中...',
          //   customClass: 'loading-style'
          // })
          $this.thisLoadingInit()
          jQuery.ajax({
            type: 'DELETE',
            url: $this.storageSiteUrl + '/xk-api/media/v1/picture_group/' + id,
            data: {
              store_id: JSON.parse(localStorage.getItem('user_shop')).store_id//当前的store_id
            },
            success(res) {
              if(res.erron == 0) {
                // let picGroupList = $this.picGroupList
                // let newPicGroupList = picGroupList.filter(function(val, idx) {
                //   if (val.id == deleteId) { // 如果分组列表中的对象id等于要删除的id，那么将这个对象过滤掉
                //     return false
                //   }
                //   return true
                // })
                // $this.picGroupList = newPicGroupList
                new Promise((resolve, reject) => {
                  $this.currentSelectPicGroup = {
                    id: 1,
                    groupName: '全部图片'
                  }
                  $this.getPicGroupList(resolve)
                  $this.getPicList(resolve)
                }).then(() => {
                  $this.$message({
                    message: '删除分组成功啦~',
                    type: 'success'
                  })
                })
              } else {
                $this.$message({
                  message: '删除分组失败，请稍后再试~',
                  type: 'error'
                })
              }
              $this.loadingObj.close()
            },
            error(error) {
              console.log(error);
            }
          })
        }).catch(() => {
          // this.$message({
          //   type: 'info',
          //   message: '已取消删除'
          // });
        });
      },
      showAddPicGroupDialog() {
        this.isVisible__addPicGroupDialog = true
      },
      hiddenAddPicGroupDialog() {
        this.isVisible__addPicGroupDialog = false
      },
      confirmAddPicGroup() {
        if(this.groupName__add) {
          let $this = this
          this.isVisible__addPicGroupDialog = false
          this.loadingObj = this.$loading({
            target: '.menu-main',
            text: '处理中...',
            customClass: 'loading-style'
          })
          jQuery.ajax({
            type: 'POST',
            url: this.storageSiteUrl + '/xk-api/media/v1/picture_group/',
            data: {
              create_obj: {
                user_id: 1, // 先写死
                user_login: 'admin', // 先写死
                group_name: this.groupName__add,
                store_id: JSON.parse(localStorage.getItem('user_shop')).store_id//当前的store_id
              }
            },
            success(res) {
              if(res.erron == 0) {
                $this.$message({
                  message: '新建分组成功啦~',
                  type: 'success'
                })
                $this.picGroupList.push(res.data)
              } else if(res.erron == 2) {
                $this.$message({
                  message: '分组名称不能重复~',
                  type: 'warning'
                })
              } else {
                $this.$message({
                  message: '新建分组失败，请稍后再试~',
                  type: 'error'
                })
              }
              $this.groupName__add = ''
              $this.loadingObj.close()
            },
            error(error) {
              this.$message({
                message: '网络异常！',
                type: 'warning'
              })
            }
          })
        } else {
          this.$message({
            message: '新建分组名称不能为空哦~',
            type: 'warning'
          })
        }
      },
      // 点击全选回调方法
      allCheckedCallBack() {
        this.allChecked_indeterminate = false
      },
      // 点击图片使图片变为选中状态
      checkedPic(id) {
        this.getAllCheckedStatus(id)
      },
      // 监测选中的图片对象的变化
      getAllCheckedStatus(id) {
        let $this = this
        let isLayer = Boolean(this.isLayer)
        let isCheckedArr = Array()
        let isNotCheckedArr = Array()
        if(isLayer == true) {
          this.picArr.forEach((val, idx) => {
            if(idx == id) {
              $this.picArr[idx].isChecked = true
              isCheckedArr[idx] = val
            } else {
              $this.picArr[idx].isChecked = false
              isNotCheckedArr[idx] = val
            }
          })
        } else {
          this.picArr.forEach((val, idx) => {
            if(val.isChecked == true) {
              isCheckedArr[idx] = val
            }
            if(val.isChecked == false) {
              isNotCheckedArr[idx] = val
            }
          })
        }
        if(isCheckedArr.length == 0) { // 没有被选中的图片
          this.allChecked = false
          this.allChecked_indeterminate = false
          return
        }
        if(isNotCheckedArr.length == 0) { // 图片都被选中了
          this.allChecked = true
          this.allChecked_indeterminate = false
          return
        }
        if(isCheckedArr.length > 0 && isCheckedArr.length) { // 图片部分被选中了
          this.allChecked_indeterminate = true
          return
        }
      },
      // 显示多选移动分组框
      showMovePicDialog__multi() {
        this.isVisible__movePicDialog__multi = true
      },
      // 隐藏多选移动分组框
      hiddenMovePicDialog__multi() {
        this.isVisible__movePicDialog__multi = false
      },
      // 确认多选移动分组
      confirmMovePic__multi() {
        this.isVisible__movePicDialog__multi = false
        // this.loadingObj = this.$loading({
        //   target: '.menu-main',
        //   text: '处理中...',
        //   customClass: 'loading-style'
        // })
        this.thisLoadingInit()
        let $this = this
        let picIdArr__move = Array()
        let i = 0
        this.picArr.forEach((val, idx) => {
          if(val.isChecked == true) {
            picIdArr__move[i] = val.id
            i++
          }
        })
        jQuery.ajax({
          type: 'PUT',
          url: this.storageSiteUrl + '/xk-api/media/v1/picture/0',
          data: {
            exec_batch_move: true,
            pic_id_arr: picIdArr__move,
            pic_group_id: this.picGroupId__selectToMove__multi,
            store_id: JSON.parse(localStorage.getItem('user_shop')).store_id//当前的store_id
          },
          success(res) {
            if(res.erron == 0) {
              new Promise((resolve, reject) => {
                $this.getPicList(resolve)
                $this.getPicGroupList(resolve)
              }).then(() => {
                $this.$message({
                  message: '图片移动分组成功~',
                  type: 'success'
                })
                if(JSON.stringify($this.picList == '[]')) {
                  $this.isVisible__pagination = false
                  $this.isVisible__confirmSelected = false
                }
                $this.loadingObj.close()
              })
            } else {
              $this.$message({
                message: '图片移动分组成功失败~',
                type: 'error'
              })
              $this.loadingObj.close()
            }
          },
          error(error) {
            console.log(error);
          }
        })
      },
      // 显示多选删除框
      showDeletePicDialog__multi() {
        this.isVisible__deletePicDialog__multi = true
      },
      // 隐藏多选删除框
      hiddenDeletePicDialog__multi() {
        this.isVisible__deletePicDialog__multi = false
      },
      // 确认多选删除
      confirmDeletePic__multi() {
        this.isVisible__deletePicDialog__multi = false
        // this.loadingObj = this.$loading({
        //   target: '.menu-main',
        //   text: '处理中...',
        //   customClass: 'loading-style'
        // })
        this.thisLoadingInit()
        let $this = this
        let picIdArr__delete = Array()
        let i = 0
        this.picArr.forEach((val, idx) => {
          if(val.isChecked == true) {
            picIdArr__delete[i] = val.id
            i++
          }
        })
        jQuery.ajax({
          type: 'DELETE',
          url: this.storageSiteUrl + '/xk-api/media/v1/picture/0',
          data: {
            exec_batch_delete: true,
            pic_id_arr: picIdArr__delete,
            store_id: JSON.parse(localStorage.getItem('user_shop')).store_id//当前的store_id
          },
          success(res) {
            if(res.erron == 0) {
              new Promise((resolve, reject) => {
                $this.getPicList(resolve)
                $this.getPicGroupList(resolve)
              }).then(() => {
                $this.$message({
                  message: '图片删除成功~',
                  type: 'success'
                })
                $this.allChecked = false // 重置多选框状态
                $this.allChecked_indeterminate = false // 重置多选框状态
                // if (JSON.stringify($this.picList) == '[]') {
                //   $this.isVisible__pagination = false // 分页栏隐藏
                //   $this.isVisible__confirmSelected = false // 确认选择栏隐藏
                // }
                $this.loadingObj.close()
              })
            } else {
              $this.$message({
                message: '图片删除失败~',
                type: 'error'
              })
              $this.loadingObj.close()
            }
          },
          error(error) {
            console.log(error);
          }
        })
      },
      // 显示图片的详细信息浮层
      showPicDetailDialog(id) {
        let $this = this
        this.isVisible__picDetaiDialog = true
        this.picArr.forEach((val, idx) => {
          if(idx == id) {
            $this.picInfo = val
            $this.picName__edit = val.pic_name
            $this.picDesc__edit = val.pic_desc
          }
        })
      },
      // 显示图片名称编辑框
      showEditPicDialog(id) {
        this.picArr[id].isVisible__editPicDialog = true
      },
      // 隐藏图片名称编辑框
      hiddenEditPicDialog(id) {
        this.picArr[id].isVisible__editPicDialog = false
      },
      // 确认图片编辑名称
      confirmEditPic(id) {
        if(this.picName__edit == '') {
          this.$message({
            message: '图片名称不能为空~',
            type: 'warning'
          })
          return
        }
        let $this = this
        let $id = id
        this.picArr[$id].isVisible__editPicDialog = false
        this.loadingObj = this.$loading({
          target: '.menu-main',
          text: '处理中...',
          customClass: 'loading-style'
        })
        jQuery.ajax({
          type: 'PUT',
          url: this.storageSiteUrl + '/xk-api/media/v1/picture/' + id,
          data: {
            update_obj: {
              pic_name: this.picName__edit,
              store_id: JSON.parse(localStorage.getItem('user_shop')).store_id//当前的store_id
            }
          },
          success(res) {
            if(res.erron == 0) {
              $this.picArr[id].pic_name = $this.picName__edit
              $this.$message({
                message: '图片名称编辑成功~',
                type: 'success'
              })
            } else {
              $this.$message({
                message: '图片名称编辑失败~',
                type: 'error'
              })
            }
            $this.picName__edit = '' // 编辑成功后重置输入的编辑名称为空
            $this.loadingObj.close()
          },
          error(error) {
            console.log(error);
          }
        })
      },
      // 显示移动分组框
      showMovePicDialog(id) {
        this.picArr[id].isVisible__movePicDialog = true
      },
      // 隐藏移动分组框
      hiddenMovePicDialog(id) {
        this.picArr[id].isVisible__movePicDialog = false
      },
      // 确认移动分组
      confirmMovePic(id) {
        let $this = this
        this.loadingObj = this.$loading({
          target: '.menu-main',
          text: '处理中...',
          customClass: 'loading-style'
        })
        jQuery.ajax({
          type: 'PUT',
          url: this.storageSiteUrl + '/xk-api/media/v1/picture/' + id,
          data: {
            exec_move_pic_group: true, //执行移动图片分组操作
            pic_group_id: this.picGroupId__selectToMove,
            store_id: JSON.parse(localStorage.getItem('user_shop')).store_id//当前的store_id
          },
          success(res) {
            if(res.erron == 0) {
              new Promise((resolve, reject) => {
                $this.getPicList(resolve)
                $this.getPicGroupList(resolve)
              }).then(() => {
                $this.$message({
                  message: '移动图片分组成功~',
                  type: 'success'
                })
                $this.loadingObj.close()
              })
            } else {
              $this.$message({
                message: '移动图片分组失败~',
                type: 'error'
              })
              $this.loadingObj.close()
            }
          },
          error(error) {
            console.log(error);
          }
        })

      },
      // 显示图片删除框
      showDeletePicDialog(id) {
        this.picArr[id].isVisible__deletePicDialog = true
      },
      // 隐藏图片删除框
      hiddenDeletePicDialog(id) {
        this.picArr[id].isVisible__deletePicDialog = false
      },
      // 确认图片删除
      confirmDeletePic(id) {
        let $this = this
        this.picArr[id].isVisible__deletePicDialog = false
        this.loadingObj = this.$loading({
          target: '.menu-main',
          text: '处理中...',
          customClass: 'loading-style'
        })
        jQuery.ajax({
          type: 'DELETE',
          url: this.storageSiteUrl + '/xk-api/media/v1/picture/' + id,
          data: {
            store_id: JSON.parse(localStorage.getItem('user_shop')).store_id//当前的store_id
          },
          success(res) {
            if(res.erron == 0) {
              new Promise((resolve, reject) => {
                $this.getPicList(resolve)
                $this.getPicGroupList(resolve)
              }).then(() => {
                $this.$message({
                  message: '图片删除成功~',
                  type: 'success'
                })
                $this.loadingObj.close()
              })
            } else {
              $this.$message({
                message: '图片删除失败~',
                type: 'error'
              })
              $this.loadingObj.close()
            }
          },
          error(error) {
            console.log(error);
          }
        })
      },
      // 保存单个图片信息的修改
      saveEditPic(id) {
        let $this = this
        this.thisLoadingInit()
        jQuery.ajax({
          type: 'PUT',
          url: this.storageSiteUrl + '/xk-api/media/v1/picture/' + id,
          data: {
            update_obj: {
              pic_name: this.picName__edit,
              pic_desc: this.picDesc__edit,
              store_id: JSON.parse(localStorage.getItem('user_shop')).store_id//当前的store_id
            }
          },
          success(res) {
            if(res.erron == 0) {
              $this.picArr[id].pic_name = $this.picName__edit
              $this.picArr[id].pic_desc = $this.picDesc__edit
              $this.$message({
                message: '图片名称编辑成功~',
                type: 'success'
              })
            } else {
              $this.$message({
                message: '图片名称编辑失败~',
                type: 'error'
              })
            }
            $this.isVisible__picDetaiDialog = false
            $this.picName__edit = '' // 编辑成功后重置输入的编辑名称为空
            $this.picDesc__edit = '' // 编辑成功后重置输入的描述内容为空
            $this.loadingObj.close()
          },
          error(error) {
            console.log(error);
          }
        })
      },
      // 改变分页的回调
      pageChangeCallBack(currentPage) {
        this.pagination.curPage = currentPage
        this.thisLoadingInit('努力加载中...')
        new Promise((resolve, reject) => {
          this.getPicList(resolve)
        }).then(() => {
          this.loadingObj.close()
        })
      },
      // 改变分页条数
      handleSizeChange(val) {
        this.picList = ''
        this.pagination.size = val
        if (val == 8) {
          this.pageItemValue = 5
          this.pagination.rowItem = 4
          this.itemHeightVal = '1'
        } else if (val == 18) {
          this.pageItemValue = 3
          this.pagination.rowItem = 6
          this.itemHeightVal = '2'
        } else {
          this.pageItemValue = 2
          this.pagination.rowItem = 8
          this.itemHeightVal = '3'
        }
        this.thisLoadingInit('努力加载中...')
        new Promise((resolve, reject) => {
          this.getPicList(resolve)
        }).then(() => {
          this.loadingObj.close()
        })
      },
      // 获取图片分组列表
      getPicGroupList(resolve) {
        let $this = this
        jQuery.ajax({
          type: 'GET',
          url: this.storageSiteUrl + '/xk-api/media/v1/picture_group',
          data: {
            // store_id: JSON.parse(localStorage.getItem('user_shop')).store_id//当前的store_id
            store_id: '1'
          },
          success(res) {
            if(res.erron == 0) {
              $this.picGroupList = res.data
              if(JSON.stringify($this.currentSelectPicGroup) == '{}') {
                $this.currentSelectPicGroup = { // 列表的第一个分组项默认作为第一次加载的选中项
                  id: res.data[0].id,
                  groupName: res.data[0].group_name
                }
              }
              $this.picGroupList.forEach((val, idx) => {
                $this.$set(val, 'isVisible__groupNameEdit__popover', false) // 分组名称编辑弹框是否显示
              })
              resolve()
            }else{
              resolve()
            }
          },
          error(error) {
            console.log(error);
          }
        })
      },
      // 获取图片列表
      getPicList(resolve) {
        let $this = this
        jQuery.ajax({
          type: 'GET',
          url: this.storageSiteUrl + '/xk-api/media/v1/picture',
          data: {
            exec_picture_row_order: true, // 表示图片为有序按规则的获取
            exec_picture_pagination: true, // 图片分页获取
            row_item: this.pagination.rowItem, // 表示图片一行显示4个
            page_item: this.pagination.size, // 表示图片一页显示8个
            page_num: this.pagination.curPage, // 表示图片第一页的列表数据
            pic_group_id: this.currentSelectPicGroup.id, // 当前选择的图片分组id
            store_id: JSON.parse(localStorage.getItem('user_shop')).store_id//当前的store_id
          },
          success(res) {
            if(res.erron == 0) {
              $this.picList = res.data // picList中的数据用于展示
              let picArr = Array()
              res.data.forEach(function(value, index) {
                value.forEach(function(val, idx) {
                  picArr[val.id] = val
                })
              })
              $this.picArr = picArr // picArr中的数据用于操作
              $this.picArr.forEach(function(val, idx) {
                $this.$set(val, 'isVisible__editPicDialog', false) // 图片对象的名称编辑框是否显示
                $this.$set(val, 'isVisible__movePicDialog', false) // 图片对象的移动分组框是否显示
                $this.$set(val, 'isVisible__deletePicDialog', false) // 图片对象的删除框是否显示
                $this.$set(val, 'isChecked', false) // 图片对象是否被选中
              })
              $this.isVisible__pagination = true // 显示分页栏
              $this.isVisible__confirmSelected = true // 显示确认选择
            } else {
              $this.picList = Array() // picList中的数据用于展示
              $this.picArr = Array()
              $this.isVisible__pagination = false // 隐藏分页栏
              $this.isVisible__confirmSelected = false // 隐藏确认选择
            }
            $('.item-img').height($('.item-img').width())
            // $this.$nextTick(function() {
            //   $('.item-img').height($('.item-img').width())
            // })
            $this.pagination.total = parseInt(res.pagination_data.total) // 分页所需数据，total必须是数字类型
            resolve(res)
          },
          error(error) {
            console.log(error);
          }
        })
      },
      //
      thisLoadingInit(loadigText) {
        this.loadingObj = this.$loading({
          body: true,
          text: arguments[0] ? arguments[0] : '处理中...',
          customClass: 'loading-style'
        })
      },
    },
    created() {
      let $this = this
      new Promise((resolve, reject) => {
        $this.getPicGroupList(resolve)
      }).then((val) => {
        new Promise((resolve, reject) => {
          $this.getPicList(resolve)
        }).then((res) => {
          if(res.erron == 0) {
            $this.isVisible__pagination = true
            $this.isVisible__confirmSelected = true
          } else {
            $this.isVisible__pagination = false
            $this.isVisible__confirmSelected = false
          }
          $this.loadingObj.close()
        })
      }).catch((error) => {
        console.log(error)
      })
    },
    mounted() {
      this.thisLoadingInit('努力加载中...')
    }
  }
</script>

<style lang="scss" scoped>
// @import "~/assets/css/components/media.css"; // 引入无效
  .media {
    height: 100%;
    .page-content {
      padding: 0;
    }
    .border-wrapper {
      border: 1px solid #ccc;
    }
    .media-wrapper {
      height: 100%;
      .picture-main {
        height: 100%;
        position: relative;
        background-color: #fff;
        .title-row {
          display: flex;
          align-items: center;
          padding: 0px 10px;
          height: 46px;
          line-height: 46px;
          background: #fff;
          .title-block {
            font-size: 16px;
            font-weight: bold;
            cursor: default;
            &:hover .title-icon-edit {
              display: inline-block;
              color: #20a0ff;
              cursor: pointer;
            }
            & .title-icon-edit {
              display: none;
            }
          }
          .upload-block {
            text-align: right;
                position: absolute;
                top: 50px;
                z-index: 999;
                right: 0;
            .upload {
              display: inline-block;
            }
          }
        }
        .operate-row {
          display: flex;
          align-items: center;
          padding: 0px 10px;
          height: 46px;
          line-height: 46px;
          background: #f4f5f9;
          border-bottom: 1px solid #e7e7eb;
        }
        .content-area {
          position: absolute;
          top: 92px;
          left: 0;
          right: 0;
          bottom: 130px;
          overflow-y: auto;
          .content-empty-row {
            background: #fff;
            text-align: center;
            padding: 100px 0;
            font-size: 24px;
            color: #999;
          }
          .content-row {
            padding: 10px 0;
            background: #fff;
            .content-item {
              text-align: center;
              border: 1px solid #ccc;
              .img-h1{
                height: 220px;
              }
              .img-h2{
                height: 160px;
              }
              .img-h3{
                height: 110px;
              }
              .item-img{
                position: relative;
                .lists {
                  position: absolute;
                  top: 50%;
                  left: 50%;
                  transform: translate(-50%, -50%);
                  width: auto;
                  height: auto;
                  max-width: 100%;
                  max-height: 100%;
                  /*min-width: 150px;
                  max-width: 100%;
                  height: 220px;*/
                  display: block;
                  margin: 0 auto;
                  cursor: pointer;
                  &:hover {
                    opacity: 0.5;
                  }
                }
              }
              .image-dialog {
                font-size: 14px;
                &.is-up-to {
                  z-index: 2050;
                }
                .image-origin {
                  &>img {
                    min-width: 150px;
                    max-width: 100%;
                    height: 220px;
                    display: block;
                    margin: 0 auto;
                    cursor: pointer;
                    &:hover {
                      opacity: 0.5;
                    }
                  }
                }
                .image-info {
                  padding-left: 20px;
                  text-align: left;
                  font-size: 12px;
                  .image-name {
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                  }
                  .image-to-save {
                    margin-top: 20px;
                    text-align: right;
                  }
                  .label {
                    font-weight: bold;
                    color: #333;
                  }
                  .label-large {
                    font-weight: bold;
                    font-size: 14px;
                  }
                }
              }
              p {
                margin: 0;
              }
              p.item-title {
                // width: 180px;
                margin: 0 auto;
                padding: 0 20px;
                line-height: 25px;
                font-weight: bold;
                border-top: 1px solid #ccc;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
              p.item-checked {
                line-height: 25px;
                padding: 0 20px;
                // color: #aaa;
                label {
                  width: 100%;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                  // padding: 0 20px;
                }
              }
              p.item-operate {
                display: flex;
                justify-content: space-around;
                align-items: center;
                height: 30px;
                border-top: 1px solid #ccc;
                background: #f4f5f9;
                i {
                  display: inline-block;
                  height: 30px;
                  line-height: 30px;
                  padding: 0 10px;
                  cursor: pointer;
                  &:hover {
                    background: #ddd;
                    color: #20a0ff;
                  }
                }
              }
            }
            /*调整布局*/
            .content-item:first-child {
              margin-left: 2.0833%;
            }
          }
        }
        .pagination-row {
          position: absolute;
          bottom: 80px;
          right: 10px;
          left: 10px;
          padding: none;
          background: #fff;
          text-align: right;
        }
        .confirm-selected-row {
          position: absolute;
          bottom: 20px;
          right: 10px;
          left: 10px;
          text-align: center;
          background: #fff;
        }
      }
      .picture-group {
        position: absolute;
        top: 0;
        bottom: 60px;
        right: 0;
        border-left: 1px solid #ccc;
        overflow-y: auto;
        background: #fff;
        .group-ul {
          width: 100%;
          padding-bottom: 20px;
          li {
            width: 100%;
            word-break: break-all;
            padding: 8px 5px 8px 10px;
            cursor: pointer;
            &:hover {
              background: #f4f5f9;
              &:nth-child(n+3)>i.el-icon-delete {
                position: absolute;
                right: 5px;
                line-height: 36px;
                display: inline-block;
              }
              &>i.el-icon-delete:hover,
              &:nth-child(n+3) .group-icon-edit:hover {
                color: #20a0ff;
              }
              &:nth-child(n+3) .group-icon-edit {
                position: absolute;
                right: 25px;
                line-height: 36px;
                display: inline-block;
              }
            }
            &>span.picture-count {
              color: #aaa;
              font-size: 12px;
            }
            & .group-icon-edit,
            &>i.el-icon-delete {
              font-size: 14px;
              color: #666;
              display: none;
            }
          }
          li.is-selected {
            background: #eef1f6;
          }
        }
      }
    }
  }
  .media-layer{
    .media {
      height:100%;
      padding-bottom: 0px;
    }
  }
</style>