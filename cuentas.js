// Función de ejemplo para llamadas a la API
async function callApi(endpoint) {
  const numero_tarjeta = document.getElementById('tarjeta')?.value.trim() || '';
  const numero_cuenta = document.getElementById('cuenta')?.value.trim() || '';

  const local = "http://127.0.0.1:1976/wallet/";
  const prod = "https://walletchallenge-back.onrender.com/wallet/";

  let jsonData = {};
  let responseDiv = document.getElementById('responseCuentas');

  // Definir body y div de respuesta según endpoint
  if (endpoint === 'cuentas') {
    jsonData = {
      numero_tarjeta: numero_tarjeta
    };
    responseDiv = document.getElementById('responseCuentas');
  } else if (endpoint === 'saldo') {
    jsonData = {
      numero_cuenta: numero_cuenta
    };
    responseDiv = document.getElementById('responseSaldo');
  } else {
    responseDiv.className = 'error';
    responseDiv.innerHTML = `Error: endpoint no soportado (${endpoint})`;
    return;
  }

  // Validaciones básicas antes de llamar
  if (endpoint === 'cuentas' && !numero_tarjeta) {
    responseDiv.className = 'warning';
    responseDiv.innerHTML = 'Advertencia: debe ingresar un número de tarjeta';
    return;
  }

  if (endpoint === 'saldo' && !numero_cuenta) {
    responseDiv.className = 'warning';
    responseDiv.innerHTML = 'Advertencia: debe ingresar un número de cuenta';
    return;
  }

  const jsonString = JSON.stringify(jsonData);

  try {
    const response = await fetch(`${prod}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      },
      body: jsonString
    });

    const data = await response.json();

    // Restablecer clase y limpiar contenido anterior
    responseDiv.className = 'response';
    responseDiv.innerHTML = '';

    if (response.ok) {
      if (endpoint === 'cuentas') {
        responseDiv.innerHTML = getTablaCuentas(data);
      } else if (endpoint === 'saldo') {
        responseDiv.innerHTML = getTablaSaldo(data, numero_cuenta);
      }
    } else {
      responseDiv.className = 'error';
      responseDiv.innerHTML = `Error: ${data.detail || 'Error desconocido'}`;
    }
  } catch (error) {
    responseDiv.className = 'error';
    responseDiv.innerHTML = `Error: ${error.message}`;
  }
}

function getTablaDatosUsuario(data) {
  let table = '<table class="my-custom-table"><thead><tr><th>Clave</th><th>Valor</th></tr></thead><tbody>';

  // Mostrar claves principales
  for (let key in data) {
    if (key !== 'tarjetas' && key !== 'access_token') {
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

  table += '</tbody></table>';
  return table;
}

function getTablaCuentas(data) {
  let table = '<table class="my-custom-table"><thead><tr><th>Clave</th><th>Valor</th></tr></thead><tbody>';

  // Mostrar claves principales
  for (let key in data) {
    if (key !== 'cuentas') {
      table += `<tr><td>${key}</td><td>${data[key]}</td></tr>`;
    }
  }

  // Mostrar cuentas si existen
  if (data.cuentas && Array.isArray(data.cuentas)) {
    data.cuentas.forEach((cuenta, index) => {
      table += `<tr><td>Cuenta ${index + 1} - Número</td><td>${cuenta.numero_cuenta}</td></tr>`;
      table += `<tr><td>Cuenta ${index + 1} - Tipo</td><td>${cuenta.tipo}</td></tr>`;
    });
  }

  table += '</tbody></table>';
  return table;
}

function getTablaSaldo(data, numero_cuenta) {
  let table = '<table class="my-custom-table"><thead><tr><th>Clave</th><th>Valor</th></tr></thead><tbody>';

  table += `<tr><td>Número de cuenta</td><td>${numero_cuenta}</td></tr>`;
  table += `<tr><td>Saldo</td><td>${data.saldo}</td></tr>`;

  table += '</tbody></table>';
  return table;
}
