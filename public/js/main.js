function FirebaseEnter()
{
	this.init();
	this.initEvent();
}

FirebaseEnter.prototype.init = function()
{
	this.auth = firebase.auth();
	this.liGoogleBtn = document.getElementById('liGoogleBtn');
	this.liEmailJoin = document.getElementById('liEmailJoin');
	this.dvAuth = document.getElementById('dvAuth');
	this.dvLogOut = document.getElementById('dvLogOut');
	this.liEmailBtn = document.getElementById('liEmailBtn');
	this.liLogOut = document.getElementById('liLogOut');
}

FirebaseEnter.prototype.initEvent = function()
{
	this.auth.onAuthStateChanged(this.onAuthChange.bind(this));
	this.liGoogleBtn.addEventListener('click', this.onGoogleBtnClick.bind(this));
	this.liEmailBtn.addEventListener('click', this.onEmailBtnClick.bind(this));
	this.liEmailJoin.addEventListener('click', this.createEmailUser.bind(this));
	this.liLogOut.addEventListener('click', this.logOut.bind(this));
}

FirebaseEnter.prototype.logOut = function()
{
	if (confirm('Logout?'))
	{
		if (this.database)
		{
			this.database.goOffline();
		}
		this.auth.signOut();
	}
}

FirebaseEnter.prototype.onAuthChange = function(user)
{
	if (user)
	{
		console.log('user로그인');
		this.setLogin();
	}
	else
	{
		console.log('로그아웃');
		this.setLogOut();
	}
}

FirebaseEnter.prototype.setLogin = function()
{
	EnterClicker.isEnable = false;
	EnterClicker.countToMessage();

	this.database = firebase.database();
	this.database.goOnline();
	var tempCount = 0;
	var dataObjRef = this.database.ref('/user-count/' + this.auth.currentUser.uid);
	dataObjRef.once('value').then(function(snapshot)
	{
		if (!snapshot.exists())
		{
			console.log('load data from database: ', snapshot.key);
			tempCount = snapshot.child('count').val();
		}
		else
		{
			console.log('make new data', fbEnter.auth.currentUser.uid);
			fbEnter.database.ref('/user-count/' + fbEnter.auth.currentUser.uid).set(
				{
					username: fbEnter.auth.currentUser.displayName,
					count: 0
				}
			);
		}
	}).then(function()
	{
		EnterClicker.count = tempCount;
		EnterClicker.isEnable = true;
		EnterClicker.countToMessage();
	});
	
	this.dvAuth.style.display = 'none';
	this.dvLogOut.style.display = 'block';
	document.getElementById('welcomeUser').innerHTML = '환영합니다, ' + this.auth.currentUser.displayName;
}

FirebaseEnter.prototype.setLogOut = function()
{
	EnterClicker.count = 0;
	EnterClicker.countToMessage();
	this.dvAuth.style.display = 'block';
	this.dvLogOut.style.display = 'none';
	document.getElementById('welcomeUser').innerHTML = '환영합니다.';
}

FirebaseEnter.prototype.onEmailBtnClick = function()
{
	var email = document.getElementById('userEmail').value.trim();
	var password = document.getElementById('password').value.trim();
	if(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email) && password.length > 0)
	{ // 유효성 체크
		var cbSignInEmail = function() 
		{
			return  this.auth.signInWithEmailAndPassword(email, password)
				.then(function()
				{
					console.log('이메일 로그인 성공');
				})
				.catch(function(error) 
				{
					console.error('이메일 로그인 과정 에러', error);
					switch(error.code)
					{
						case "auth/invalid-email":
							alert('유효하지 않은 메일입니다');
							break;
						case "auth/user-disabled":
							alert('사용이 정지된 유저 입니다.')
							break;
						case "auth/user-not-found":
							alert('사용자를 찾을 수 없습니다.')
							break;
						case "auth/wrong-password":
							alert("잘못된 패스워드 입니다.");
							break;
					}
				});
		}
		this.auth.setPersistence(firebase.auth.Auth.Persistence.SESSION)
			.then(cbSignInEmail.bind(this));
	}
}

FirebaseEnter.prototype.createEmailUser = function(){
	var userName = document.getElementById('userName').value.trim();
	var email = document.getElementById('userEmail').value.trim();
	var password = document.getElementById('password').value.trim();
	// 유효성 검증
	if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))
	{
		var cbCreateUserWithEmail = function(user){
			console.log('이메일 가입 성공 : ', JSON.stringify(user));
			//프로필 업데이트 - 이메일 가입시 유저이름 파라미터를 보내지 않으므로 가입 성공 후 처리
			firebase.auth().currentUser.updateProfile({
				displayName: userName,
			}).then(function() {
				console.log('userName 업데이트 성공')
			}).catch(function(error) {
				console.error('userName 업데이트 실패 : ', error );
			});
			/*
			//인증 메일 발송
			this.auth.useDeviceLanguage(); // 이메일 기기언어로 세팅
			user.sendEmailVerification().then(function() {
				console.log('인증메일 발송 성공')
			}).catch(function(error) {
				console.error('인증메일 발송 에러', error);
			});*/
		}
		var cbAfterPersistence = function(){
			return this.auth.createUserWithEmailAndPassword(email, password)
				.then(cbCreateUserWithEmail.bind(this))
				.catch(function(error) {
					console.error('이메일 가입시 에러 : ', error);
					switch(error.code){
						case "auth/email-already-in-use":
							alert('이미 사용중인 이메일 입니다.');
							break;
						case "auth/invalid-email":
							alert('유효하지 않은 메일입니다');
							break;
						case "auth/operation-not-allowed":
							alert('이메일 가입이 중지되었습니다.');
							break;
						case "auth/weak-password":
							alert("비밀번호를 6자리 이상 필요합니다");
							break;
					}
				});
		}
		this.auth.setPersistence(firebase.auth.Auth.Persistence.SESSION)
			.then(cbAfterPersistence.bind(this))
			.catch(function(error) {
				console.error('인증 상태 설정 중 에러 발생' , error);
			});	
	}
}

FirebaseEnter.prototype.onGoogleBtnClick = function()
{
	var googleProvider = new firebase.auth.GoogleAuthProvider();
	this.auth.setPersistence(firebase.auth.Auth.Persistence.SESSION)
	.then(this.signInWithPopup.bind(this, googleProvider))
	.catch(function(error)
	{
		console.error('인증 상태 설정 중 에러 발생', error);
	});
}

FirebaseEnter.prototype.signInWithPopup = function(provider) 
{
	return  this.auth.signInWithPopup(provider).then(function(result) 
	{
		console.log('로그인 성공')
	}).catch(function(error) 
	{
		alert('로그인에 실패하였습니다');
		console.error('로그인 에러',error);
	});
}

FirebaseEnter.prototype.syncCount = function(_count)
{
	if (this.auth.currentUser)
	{
		var currentDataRef = this.database.ref('/user-count/' + this.auth.currentUser.uid);
		return currentDataRef.update({count: _count});
	}
}

document.addEventListener('DOMContentLoaded', function()
{
	window.fbEnter = new FirebaseEnter();

	EnterClicker.countMessage = document.getElementById('countMessage');
	EnterClicker.countToMessage();
	console.log('done load');
})
/*
<div id="message">
	<h2>Welcome</h2>
	<h1>Firebase Hosting Setup Complete</h1>
	<p>You're seeing this because you've successfully setup Firebase Hosting. Now it's time to go build something extraordinary!</p>
	<a target="_blank" href="https://firebase.google.com/docs/hosting/">Open Hosting Documentation</a>
</div>
<p id="load">Firebase SDK Loading&hellip;</p>

document.addEventListener('DOMContentLoaded', function() {
	// // 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥
	// // The Firebase SDK is initialized and available here!
	//
	// firebase.auth().onAuthStateChanged(user => { });
	// firebase.database().ref('/path/to/ref').on('value', snapshot => { });
	// firebase.messaging().requestPermission().then(() => { });
	// firebase.storage().ref('/path/to/ref').getDownloadURL().then(() => { });
	//
	// // 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥

	try {
		let app = firebase.app();
		let features = ['auth', 'database', 'messaging', 'storage'].filter(feature => typeof app[feature] === 'function');
		document.getElementById('load').innerHTML = `Firebase SDK loaded with ${features.join(', ')}`;
	} catch (e) {
		console.error(e);
		document.getElementById('load').innerHTML = 'Error loading the Firebase SDK, check the console.';
	}
});
*/