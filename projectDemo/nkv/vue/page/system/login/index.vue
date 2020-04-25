<template>
	<div class="login_container">
		<div class="login_box">
			<div class="avatar_box">
				<img src="../../../assets/images/system/logo.png">
			</div>
			<el-form ref="loginFormRef" :model="loginForm" :rules="rules" lable-width="0" class="login_form">
				<el-form-item prop="AID">
					<el-input v-model="loginForm.AID" prefix-icon="iconfont iconaccount"></el-input>
				</el-form-item>
				<el-form-item prop="Password">
					<el-input v-model="loginForm.Password" type="password" prefix-icon="iconfont iconpassword"></el-input>
				</el-form-item>
				<el-form-item class="btns">
					<el-button type="primary" @click="login">登陆</el-button>
					<el-button type="info" @click="resetLoginForm()">重置</el-button>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script>
	import JsEncrypt from 'jsencrypt'
	import models from '@v/models'
	export default{
		data(){
			return {
				loginForm:{
					AID:'',
					Password:''
				},
				rules:{
					AID:[
						{
							required:true,
							message:'请输入账号！',
							trigger:'blur'
						},{
							min:3,
							max:10,
							message:'用户名长度不得小于3，大于10'
						}
					],
					Password:[
						{
							required:true,
							message:'请输入密码！',
							trigger:'blur'
						},{
							min:6,
							max:15,
							message:'密码长度不得小于5，大于15'
						}
					]
				}
			}
		},
		methods:{
			resetLoginForm(){
				this.$refs.loginFormRef.resetFields();
			},
			login(){
				this.$refs.loginFormRef.validate((valid)=>{
					if(!valid) return;
					models.getPublicKey({
						success:(publicKey)=>{
							let encryptor=new JSEncrypt();
							encryptor.setPublicKey(publicKey);
							let rsaPassWord=encryptor.encrypt(this.loginForm.Password, "base64", "utf8");
							models.loginConfirm({
								data:{
									AID:this.loginForm.AID,
									Password:rsaPassWord
								},
								success:(data)=>{
									this.$router.replace('/home')
								},
								error:(err)=>{
									this.$message.error(err.message)
								}
							})
						},
						error:(err)=>{
							this.$message.error(err.message)
						}
					});
				})
			}
		}
	}
</script>

<style lang='less' scoped>
	.login_container{
		background-color: #2b4b6b;
		height:100%;
	}
	.login_box{
		background-color: #fff;
		width: 60vw;
		height: 50vh;
		position: absolute;
		top:50%;
		left:50%;
		transform: translate(-50%,-50%);
		border-radius: 1rem;
		
		.avatar_box{
			width:15vw;
			height:15vw;
			border:0.1rem solid #eee;
			border-radius:50%;
			padding:1vh;
			box-shadow: 0 0 1rem #ddd;
			position: absolute;
			left: 50%;
			transform: translate(-50%, -50%);
			background-color: #fff;
			z-index: 2;
			img{
				width: 100%;
				height: 100%;
				border-radius: 50%;
				background-color: #eee;
			}
		}
		.btns{
			display: flex;
			justify-content: flex-end;
		}
		.login_form{
			position: absolute;
			bottom:0;
			width: 100%;
			padding: 0 1.2rem;
		}
	}
</style>