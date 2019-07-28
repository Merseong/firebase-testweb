document.addEventListener('DOMContentLoaded', function()
{
	SpaceClicker.countMessage = document.getElementById('countMessage');
	SpaceClicker.countToMessage();
	console.log('done load');
});

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