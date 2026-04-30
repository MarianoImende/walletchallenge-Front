const loginForm = document.getElementById('login-form');

const schema = {
  type: "object",
  additionalProperties: false,

  properties: {
    access_token: {
      type: "string",
      pattern: "^[a-zA-Z0-9]{20,40}\\.[a-zA-Z0-9]+\\.[a-zA-Z0-9_-]+$"
    },

    token_type: {
      type: "string",
      pattern: "^bearer$"
    },

    access_token_expires: {
      type: "integer",
      minimum: 1
    },

    tarjetas: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,

        properties: {
          descripcion: {
            type: "string",
            pattern: "^[A-Z\\s]{1,30}$"
          },
          numero: {
            type: "string",
            pattern: "^[0-9]{12,19}$"
          },
          estado: {
            type: "string",
            pattern: "^(activa|bloqueada|pausada)$"
          }
        },

        required: [
          "descripcion",
          "numero",
          "estado"
        ]
      }
    }
  },

  required: [
    "access_token",
    "token_type",
    "access_token_expires",
    "tarjetas"
  ]
};

document.getElementById('login-form').addEventListener('submit', async function(event) {
    event.preventDefault();
  
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
  
    const local = "http://127.0.0.1:1976/wallet/sesion"
    const prod = "https://walletchallenge-back.onrender.com/wallet/sesion"

    try {
      const response = await fetch(prod, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        const responseDiv = document.getElementById('response');
        responseDiv.innerHTML = ''; // Limpiar contenido anterior
        
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
          }, 3000); 
        } else {
          console.log("Response JSON no cumple con el esquema esperado:", validate.errors);
          responseDiv.className = 'error';
          responseDiv.innerHTML = `<p>Response JSON no cumple con el esquema esperado:</p><pre>${JSON.stringify(validate.errors, null, 2)}</pre>`;
        }
      } else {
        // Si el login falla
        const responseDiv = document.getElementById('response');
        responseDiv.className = 'error';
        responseDiv.innerHTML = `Error: ${data.detail || 'Error desconocido'}`;
      }
    } catch (error) {
      const responseDiv = document.getElementById('response');
      responseDiv.className = 'error';
      responseDiv.innerHTML = `Error: ${error.message}`;
    }
});
