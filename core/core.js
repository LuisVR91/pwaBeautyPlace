(function(){
    // all your code here
    var foo = async function() {

  const capa = document.querySelector('#ejemplo'); 
console.log(capa.textContent);

const getPosts = async () => {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts');
    return await response.json();
   }

   const posts = await getPosts();

   console.log(posts);

    };
    
    window.onload = foo;
    // ...
  })();
  
  