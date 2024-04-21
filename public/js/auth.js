const miFormulario = document.querySelector('form'); 

const url = 'http://localhost:8080/api/auth/';

miFormulario.addEventListener('submit', ev => {
    ev.preventDefault();
    const formData = {};

    for (let el of miFormulario.elements){
        if( el.name.length > 0)
            formData[el.name] = el.value
    }

    fetch(url+'login',{
        method: 'POST',
        headers:{
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then( data => data.json())
    .then( data => {
       if(data.msg != 'OK'){
          return console.error(data.msg);
       }
       localStorage.setItem('email', data.usuario.correo)
       localStorage.setItem('token', data.token)
       window.location = 'chat.html';
    })    
    .catch(err => {
        console.log(err)
    });
})

      function handleCredentialResponse(response) {
        // Google Token : ID_TOKEN
        
        const body = { id_token: response.credential }
        fetch(url+'google',{
           method: 'POST',
           headers:{
             'Content-Type': 'application/json'
           },
           body: JSON.stringify(body)

        })
          .then( data => data.json())
          .then( data => {
             localStorage.setItem('email', data.usuario.correo);
             localStorage.setItem('token', data.token);
             window.location = 'chat.html';
          })
          
          .catch(console.warn);
      }

      const button = document.getElementById('google_signout');
      button.onclick = () => {
        google.accounts.id.disableAutoSelect()
        google.accounts.id.revoke(localStorage.getItem('email'), done =>{
          localStorage.clear();
          location.reload(); 
        })
      }  