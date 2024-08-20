 // Función de ejemplo para llamadas a la API (se puede ampliar según sea necesario)
  async function callApi(endpoint) {
    const numero_tarjeta = document.getElementById('tarjeta').value; // Obtener valor de la entrada

    const jsonData = {
      "numero_tarjeta": numero_tarjeta // Usar el valor de la variable "cuenta"
    };
    
    const jsonString = JSON.stringify(jsonData);

    try {
      const response = await fetch(`https://walletchallenge.onrender.com/wallet/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token') // Ejemplo de encabezado de autenticación
        },
        body: jsonString // Enviar body en string
      });
    
      const data = await response.json();
      const responseDiv = document.getElementById('responseCuentas');
      
      // Restablecer la clase antes de mostrar cualquier mensaje
      responseDiv.className = 'response';
      responseDiv.innerHTML = ''; // Limpiar contenido anterior
    
      if (response.ok) {
        responseDiv.innerHTML = getTablaCuentas(data); // Mostrar datos exitosos
      } else {
        responseDiv.className = 'error';
        responseDiv.innerHTML = `Error: ${data.detail || 'Error desconocido'}`; // Mostrar error de la respuesta
      }
    } catch (error) {
      const responseDiv = document.getElementById('responseCuentas'); // Asegúrate de seleccionar el mismo div
      responseDiv.className = 'error'; // Aplicar la clase de error
      responseDiv.innerHTML = `Error: ${error.message}`; // Mostrar mensaje de error
    }
    
};

function getTablaDatosUsuario(data){
  let table = '<table class="my-custom-table"><thead><tr><th>Clave</th><th>Valor</th></tr></thead><tbody>';
          
    // Mostrar claves principales
    for (let key in data) {
        if (key !== 'tarjetas') {
            table += `<tr><td>${key}</td><td>${data[key]}</td></tr>`;
        }
    }
    // Mostrar tarjetas si existen
    if (data.tarjetas && Array.isArray(data.tarjetas)) {
        data.tarjetas.forEach((tarjeta, index) => {
            table += `<tr><td>Tarjeta ${index + 1} - Descripción</td><td>${tarjeta.descripcion}</td></tr>`;
            table += `<tr><td>Tarjeta ${index + 1} - Número</td><td>${tarjeta.numero}</td></tr>`;
        });
    }
  
    table += '</tbody></table>'
    return table
}
  

function getTablaCuentas(data){
  let table = '<table class="my-custom-table"><thead><tr><th>Clave</th><th>Valor</th></tr></thead><tbody>';
          
    // Mostrar claves principales
    for (let key in data) {
        if (key !== 'cuentas') {
            table += `<tr><td>${key}</td><td>${data[key]}</td></tr>`;
        }
    }
    // Mostrar cuentas si existen
    if (data.cuentas && Array.isArray(data.cuentas)) {
        data.cuentas.forEach((cuentas, index) => {
            table += `<tr><td>Cuenta ${index + 1} - Número</td><td>${cuentas.numero_cuenta}</td></tr>`;
            table += `<tr><td>Cuenta ${index + 1} - Tipo</td><td>${cuentas.tipo}</td></tr>`;
        });
    }
  
    table += '</tbody></table>'
    return table
}