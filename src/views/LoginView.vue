<template>
	<div id="body">
		<div id="page" class="site">
			<div class="container">
				<div class="login">
					<div class="hero">
						<h1>Sign In to <br> Start Your Work</h1>
						<p>{{Msg}}</p>
					</div>
				</div>
				<div class="main">
					<form action="" onsubmit="return false">
						<p>
							<input type="text" v-model="username" placeholder="学号">
						</p>
						<p class="password">
							<input :type="type" v-model="pwd" placeholder="密码">
							<i @click="changeType()" :class="icon_class" aria-hidden="true"></i>
						</p>
						<p>
							<input type="button" @click="login(username,pwd)" class="submit" value="Sign In">
						</p>
					</form>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	data: () => ({
		Msg: '注册通道暂未开启, 若无账号请联系管理员获取',
		username: null,
		pwd: null,
		type: 'password',
		icon_class: 'fa fa-eye-slash',
	}),
	methods: {
		login(username, pwd) {
			alert("用户" + username);
		},
		changeType() {
			if (this.type === 'password') {
				this.type = 'text'
				this.icon_class='fa fa-eye'
			} else {
				this.type = 'password'
				this.icon_class = 'fa fa-eye-slash'
			}
			// alert(12)

		}
	}
}
</script>

<style scoped>
	*{
		margin:0;
		padding:0;
	}
	*,::before,::after{
		box-sizing: border-box;
	}
	#body{
		font-size: 16px;
		font-weight: 400;
		line-height: 1.8;
		color: #333333;
		background-color: #ffffff;

	}
	a{
		text-decoration: none;
		color: inherit;
		-webkit-tap-highlight-color: transparent;
	}
	ul{
		list-style: none;
	}
	h1{
		font-size: 3em;
		font-weight: 700;
		line-height: normal;
		color: black;
	}
	.site{
		display: flex;
	    align-items: center;
		justify-content: center;
		height: 100vh;
		/* background-color: red; */
	}
	.container{
		max-width: 1000px;
		/* background-color: darkblue; */
		width: 100%;
		padding: 0 30px;
		margin:0 auto;
		display:flex;
		flex-wrap: wrap;
	}
	.login{
		flex: 1 0 66.6666%;

	}
	.hero{
		position: relative;
		display: flex;
		flex-direction: column;
		gap:50px;
		padding:70px 0;
		background-color: rgba(0,0,0,0);
		z-index: 0;
	}
	
	.hero::before{
		content: '';
		position: absolute;
		top:15%;
		left:0;
		width:280px;
		height:100px;
		background: linear-gradient(150deg, #ffe9b3,#e83823);
		filter:blur(60px);
		z-index: -1;
	}
	.main{
		flex: 1 0 33.3333%;

	}
	.main form{
		display: flex;
		flex-direction: column;
		gap:30px;
	}
	.main form p{
		position: relative;
	}
	form input{
		font: inherit;
		font-size: 14px;
		width:100%;
		border: 0;
		outline: 0;
		line-height: 60px;
		border-radius: 10px;
		padding-left: 20px;
		box-shadow: #a36645 0 5px 5px -1px;

	}
	form input:hover{
		transition: all .5s;
		box-shadow: #a36645 0 3px 5px -1px;

	}
	input::placeholder{
		color: grey;
		font-size: inherit;
	}
	form input:not(.submit){
		background-color: hsl(43, 36%, 86%);
	}
	form .password i{
		position: absolute;
		top: calc(60px/2);
		right: 20px;
		margin-top: -8px;
		line-height: 1;
		cursor: pointer;
	}
	form input.submit{
		font-weight: 700;
		color:white;
		background-color: #a36645;
		box-shadow: #a36645 0 20px 30px -10px;
	}
	form input.submit:hover{
		
		box-shadow: #a36645 0 10px 30px -10px;
		transition: all .5s;
	}
</style>