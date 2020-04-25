<template>
	<div id="app">
		<el-row>
			<el-col :span="1" class="grid">
				<el-button type="primary" @click="showAdd" icon="el-icon-circle-plus-outline" size="mini" round>新增</el-button>
			</el-col>
		</el-row>
		<br />
		<el-table :data="users" border style="width: 100%" stripe ref="multipleTable" tooltip-effect="dark">
			<el-table-column label="序号" type="index" width="80px" align="center">
				<template slot-scope="scope">
					<span>{{(page - 1) * size + scope.$index + 1}}</span>
				</template>
			</el-table-column>
			<el-table-column prop="AID" label="账号"></el-table-column>
			<el-table-column prop="Name" label="用户名"></el-table-column>
			<el-table-column prop="Email" label="邮箱"></el-table-column>
			<el-table-column prop="MobilePhone" label="电话"></el-table-column>
			<el-table-column prop="HeadPortrait" label="头像" align="center">
				<template slot-scope="scope">
					<img :src="scope.row.HeadPortrait" style="width:3em;" />
				</template>
			</el-table-column>
			<el-table-column prop="Status" label="状态" :formatter="formatterStatus"></el-table-column>
			<el-table-column label="编辑" width="100">
				<template slot-scope="scope">
					<el-button type="primary" icon="el-icon-edit" size="mini" @click="editUser(scope.row)">编辑</el-button>
				</template>
			</el-table-column>
			<el-table-column label="删除" width="100">
				<template slot-scope="scope">
					<el-button type="danger" icon="el-icon-delete" size="mini" @click="delUser(scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :page-sizes="[5, 10, 20]"
		 :page-size="size" style="float:right" layout="total, sizes, prev, pager, next, jumper" :total="total">
		</el-pagination>
		<el-dialog :title="currentSelUser.OID?'修改用户':'新增用户'" style="text-align:left !important" :visible.sync="dialogVisible"
		 :before-close="handleClose">
			<el-form ref="userEditForm" :model="currentSelUser" label-width="80px" :rules="rules">
				<el-form-item label="账号" prop="AID">
					<el-input v-model="currentSelUser.AID" placeholder="请输入账号"></el-input>
				</el-form-item>
				<el-form-item label="用户名">
					<el-input v-model="currentSelUser.Name" placeholder="请输入用户名"></el-input>
				</el-form-item>
				<el-form-item label="头像">
					<el-upload class="avatar-uploader" action="/system.files.upload" :show-file-list="false" :on-success="handleAvatarSuccess"
					 :before-upload="beforeAvatarUpload" style="min-width:6em;">
						<img v-if="currentSelUser.HeadPortrait" :src="currentSelUser.HeadPortrait" class="avatar">
						<i v-else class="el-icon-plus avatar-uploader-icon"></i>
					</el-upload>
				</el-form-item>
				<el-form-item label="手机号">
					<el-input v-model="currentSelUser.MobilePhone" placeholder="请输入手机号"></el-input>
				</el-form-item>
				<el-form-item label="邮箱">
					<el-input v-model="currentSelUser.Email" placeholder="请输入邮箱"></el-input>
				</el-form-item>
				<el-form-item label="角色">
					<el-select-tree placeholder="请选择" default-expand-all :data="roles" v-model="currentSelUser.RoleOID"></el-select-tree>
				</el-form-item>
				<el-form-item label="状态">
					<el-select v-model="currentSelUser.Status" placeholder="请选择">
					    <el-option
							v-for="item in countStatusArr"
							:key="item.id"
							:label="item.text"
							:value="item.id">
					    </el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button type="success" @click="addOrUpdateUser()">提交</el-button>
				<el-button type="primary" @click="dialogVisible = false">取消</el-button>
			</span>
		</el-dialog>
		<el-dialog title="提示" style="text-align:left !important" :visible.sync="delDialogVisible" :before-close="handleClose">
			<span>你确定要删除吗?</span>
			<span slot="footer" class="dialog-footer">
				<el-button @click="deleteUser()">提交</el-button>
				<el-button type="primary" @click="delDialogVisible = false">取消</el-button>
			</span>
		</el-dialog>
		<el-dialog :visible.sync="headPortraitDialogVisible">
			<img width="100%" :src="currentSelUser.HeadPortrait" alt="">
		</el-dialog>
	</div>
</template>

<script>
	import ElSelectTree from 'el-select-tree';
	import axios from "axios";
	import qs from "qs";
	import {
		optUsers,
		getPublicKey
	} from '@v/api/account';
	import {
		getOrgRoles
	} from '@v/api/roles';
	import {
		plainArrfromParent2TreeArr
	} from '@v/utils/arrPlain2TreeArr';
	export default {
		data() {
			return {
				dialogVisible: false,
				delDialogVisible: false,
				total: 0,
				size: 5,
				page: 1,
				users: [],
				currentSelUser: {},
				roles: [],
				headPortraitDialogVisible: false,
				countStatusArr: [{
					id: 1,
					text: '正常',
					color: '#02ff3b'
				}, {
					id: 2,
					text: '删除',
					color: '#f00'
				}, {
					id: 3,
					text: '异常',
					color: '#00f'
				}],
				rules:{
					AID:[{ validator:(rule,value,cb)=>{
						if(!value){
							cb(new Error('请输入账号！'))
						}else if(value.length<5 || value.length>20){
							cb(new Error('账号长度需在5-20之间！'))
						}else if(!new RegExp('^[a-zA-Z0-9_]+$','g').test(value)){
							cb('账号必须由英文、数字或下划线组成!')
						}else{
							cb()
						}
					},
					trigger: 'blur' }]
				}
			};
		},
		components: {
			ElSelectTree
		},
		watch: {
			//2.x版本的bug 以前用1.x发现没有 假如现在是第三页，只有一条数据了。将其删除，就没有第三页了。应该跳到第二页展示出5条数据。
			//可是数据没有展示。原因是获取list的时候page参数没有改变。依然是3
			total() {
				if (this.total == (this.page - 1) * this.size && this.total != 0) {
					this.page -= 1;
					this.loadUserData()
				}
			}
		},
		methods: {
			formatterStatus(val) {
				let text = this.countStatusArr[this.countStatusArr.length - 1]['text'];
				this.countStatusArr.map((item) => {
					if (item['id'] == val['Status']) {
						text = item['text'];
					}
				});
				return text;
			},
			handleAvatarSuccess(res, file) {
				this.currentSelUser['HeadPortrait'] = res['data'][0]
			},
			beforeAvatarUpload(file) {
				const isJPG = file.type === 'image/jpeg';
				const isLt2M = file.size / 1024 / 1024 < 2;
				if (!isJPG) {
					this.$message.error('上传头像图片只能是 JPG 格式!');
				}
				if (!isLt2M) {
					this.$message.error('上传头像图片大小不能超过 2MB!');
				}
				return isJPG && isLt2M;
			},
			handleClose(done) {
				done();
			},
			handleSizeChange(val) {
				this.size = val
				this.loadUserData()
			},
			handleCurrentChange(val) {
				this.page = val;
				this.loadUserData();
			},
			addLable(arr) {
				arr.forEach((item) => {
					item['label'] = item['title'];
					if (item['children']) {
						this.addLable(item['children'])
					}
				})
			},
			async loadOrgRoles() {
				const result = await getOrgRoles();
				for (var i = 0; i < result.length; i++) {
					result[i]['key'] = 'Org_' + result[i]['OrgOID'];
					result[i]['value'] = 'Org_' + result[i]['OrgOID'];
					result[i]['selectable'] = false;
					!result[i]['children'] && (result[i]['children'] = []);
					if (result[i]['RoleOID']) {
						result[i]['children'].push({
							id: result[i]['RoleOID'],
							value: result[i]['RoleOID'],
							title: result[i]['RoleName']
						});
					}
				}
				const orgData = plainArrfromParent2TreeArr('OrgOID', 'OrgOIDParent', result, 'OrgName');
				this.addLable(orgData);
				this.roles = orgData;
			},
			async loadUserData() {
				let obj = {
					action: 'query',
					page: this.page,
					rows: this.size
				};
				const data = await optUsers(obj);
				this.total = data.total;
				this.users = data['rows'];
			},
			addOrUpdateUser() {
				this.$refs['userEditForm'].validate((valid)=>{
					console.log(valid)
					// if(valid){
					// 	const OID = this.currentSelUser.OID;
					// 	const result = await optUsers({
					// 		action: OID ? 'update' : 'add',
					// 		delta: [this.currentSelUser]
					// 	});
					// 	if (result) {
					// 		this.loadUserData();
					// 		this.dialogVisible = false;
					// 		this.currentSelUser = {};
					// 		this.$message({
					// 			message: (OID ? '更新' : '新增') + '成功！',
					// 			type: "success"
					// 		});
					// 	}
					// }else{
					// 	console.log(valid)
					// 	return false;
					// }
				})
			},
			delUser(row) {
				this.delDialogVisible = true;
				this.currentSelUser = row;
			},
			async deleteUser() {
				const result = await optUsers({
					action:'delete',
					delta:[this.currentSelUser['OID']]
				});
				if(result){
					this.delDialogVisible = false;
					this.loadUserData();
					this.$message({
						message: '删除成功！',
						type: "success"
					});
				}
			},
			showAdd() {
				this.currentSelUser = {};
				this.dialogVisible = true;
			},
			editUser(row) {
				this.currentSelUser = row;
				this.dialogVisible = true;
			}
		},
		mounted() {
			this.loadUserData();
			this.loadOrgRoles();
		}
	};
</script>
<style>
	.avatar-uploader .el-upload {
		border: 1px dashed #d9d9d9;
		border-radius: 6px;
		cursor: pointer;
		position: relative;
		overflow: hidden;
		min-width: 50%;
	}

	.avatar-uploader .el-upload:hover {
		border-color: #409EFF;
	}

	.avatar-uploader-icon {
		font-size: 28px;
		color: #8c939d;
		height: 150px;
		line-height: 150px;
		text-align: center;
	}

	.avatar {
		height: 150px;
		display: block;
	}
</style>
