// No necesitas importar Ajv, ya que lo cargaste en el HTML
const loginForm = document.getElementById('login-form');
console.log('¿Existe el elemento login-form?', !!loginForm);

document.getElementById('login-form').addEventListener('submit', async function(event) {
    event.preventDefault();
  
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
  
    try {
      const response = await fetch('https://walletchallenge.onrender.com/wallet/sesion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });
      
      const data = await response.json();

      const schema = {
        "$schema": "http://json-schema.org/draft-07/schema#",
        "title": "Generated schema for Root",
        "type": "object",
        "properties": {
          "access_token": {
            "type": "string",
            "pattern": "^[A-Za-z0-9-_]{20,40}\\.[A-Za-z0-9-_]{20,200}\\.[A-Za-z0-9-_]{43,64}$"
         },
          "token_type": {
            "type": "string",
            "pattern": "^bearer$"
          },
          "access_token_expires": {
            "type": "string",
            "pattern": "^\\d+$"
          },
          "tarjetas": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "descripcion": {
                  "type": "string",
                  "pattern": "^[A-Z\\s]{1,40}$"
                },
                "numero": {
                  "type": "string",
                  "pattern": "^[0-9]{10,15}$"
                }
              },
              "required": [
                "descripcion",
                "numero"
              ]
            }
          }
        },
        "required": [
          "access_token",
          "token_type",
          "access_token_expires",
          "tarjetas"
        ]
      };

      const responseDiv = document.getElementById('response');
      responseDiv.innerHTML = ''; // Limpiar contenido anterior
      
      if (response.ok) {
        const ajv = new window.Ajv();
        const validate = ajv.compile(schema);
        const valid = validate(data);
        
        if (valid) {
          // Si la validación del esquema es exitosa
          console.log("Response JSON es válido.");
          localStorage.setItem('DatosUsuario', JSON.stringify(data));
          localStorage.setItem('token', data.access_token);
          responseDiv.className = 'success';
          responseDiv.innerHTML = 'Login Exitoso, redirigiendo a la página principal...'
          setTimeout(() => {
            window.location.href = 'home.html';
          }, 1500); 
        } else {
          console.log("Response JSON no cumple con el esquema:", validate.errors);
          responseDiv.innerHTML = `<p>Response JSON no cumple con el esquema:</p><pre>${JSON.stringify(validate.errors, null, 2)}</pre>`;
        }
      } else {
        // Si el login falla
        responseDiv.className = 'error';
        responseDiv.innerHTML = `Error: ${data.detail || 'Error desconocido'}`;
      }
    } catch (error) {
      const responseDiv = document.getElementById('response');
      responseDiv.className = 'error';
      responseDiv.innerHTML = `Error: ${error.message}`;
    }
});