(function(){
    // all your code here
    var foo = async function() {

  const capa = document.querySelector('#ejemplo'); 
// console.log(capa.textContent);

// const getPosts = async () => {
//     const response = await fetch('https://jsonplaceholder.typicode.com/posts');
//     return await response.json();
//    }

//    const posts = await getPosts();

//    console.log(posts);

// Registering Service Worker

if('serviceWorker' in navigator) {
	navigator.serviceWorker.register('sw-3.js');
}; 


let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent the mini-infobar from appearing on mobile
  e.preventDefault();
  // Stash the event so it can be triggered later.
  deferredPrompt = e;
  // Update UI notify the user they can install the PWA
//   showInstallPromotion();
alert('aun no esta instalada')

});


capa.addEventListener('click', (e) => {
	// Hide the app provided install promotion
	// hideMyInstallPromotion();
	// Show the install prompt
	deferredPrompt.prompt();
	// Wait for the user to respond to the prompt
	deferredPrompt.userChoice.then((choiceResult) => {
	  if (choiceResult.outcome === 'accepted') {
		console.log('User accepted the install prompt');
	  } else {
		console.log('User dismissed the install prompt');
	  }
	});
  });


  window.addEventListener('appinstalled', (evt) => {
	// Log install to analytics
	console.log('Gracias por instalar nuestra app');
  });

  

/* DESPUES DE INSTALACION */

var imagesToLoad = document.querySelectorAll('img[data-src]');
var loadImages = function(image) {
	image.setAttribute('src', image.getAttribute('data-src'));
	image.onload = function() {
		image.removeAttribute('data-src');
	};
};


if('IntersectionObserver' in window) {


	var observer = new IntersectionObserver(function(items, observer) {
		items.forEach(function(item) {
			if(item.isIntersecting) {

      
          loadImages(item.target);
        //   console.log('vista');
          observer.unobserve(item.target);
          // deja de ser obserbado
   
      }
		});
	});
	
	imagesToLoad.forEach(function(img) {
		observer.observe(img);
	});
}
else {
	imagesToLoad.forEach(function(img) {
		loadImages(img);
	});
}


    };
    
    window.onload = foo;
    // ...
  })();
  
  