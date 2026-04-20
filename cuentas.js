// Función de ejemplo para llamadas a la API

async function consultarSaldoDesdeCuenta(numeroCuenta) {
  const cuentaInput = document.getElementById('cuenta');
  if (cuentaInput) {
    cuentaInput.value = numeroCuenta;
  }

  await callApi('saldo');
}

async function callApi(endpoint) {
  const numero_tarjeta = document.getElementById('tarjeta')?.value.trim() || '';
  const numero_cuenta = document.getElementById('cuenta')?.value.trim() || '';

  const prod = "https://walletchallenge-back.onrender.com/wallet/";

  let jsonData = {};
  let responseDiv = null;
  let sectionName = '';

  // Definir body, div y sección según endpoint
  if (endpoint === 'cuentas') {
    jsonData = { numero_tarjeta: numero_tarjeta };
    responseDiv = document.getElementById('responseCuentas');
    sectionName = 'cuentas';
} else if (endpoint === 'saldo') {
  jsonData = { numero_cuenta: numero_cuenta };
  responseDiv = document.getElementById('saldoInline');
  sectionName = 'cuentas';
} else {
    alert(`Endpoint no soportado todavía: ${endpoint}`);
    return;
  }

  // Validaciones básicas
  if (endpoint === 'cuentas' && !numero_tarjeta) {
    responseDiv.className = 'warning';
    responseDiv.innerHTML = 'Advertencia: debe ingresar un número de tarjeta';
    openSection(sectionName);
    return;
  }

  if (endpoint === 'saldo' && !numero_cuenta) {
    responseDiv.className = 'warning';
    responseDiv.innerHTML = '';
    responseDiv.innerHTML = 'Advertencia: debe ingresar un número de cuenta';
    openSection(sectionName);
    return;
  }

  // Mostrar loading
  responseDiv.className = 'response';
  responseDiv.innerHTML = 'Cargando...';
  openSection(sectionName);

  try {
    const response = await fetch(`${prod}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      },
      body: JSON.stringify(jsonData)
    });

    let data = null;
    const contentType = response.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      data = { detail: text || 'Respuesta no JSON del servidor' };
    }

    responseDiv.className = 'response';
    responseDiv.innerHTML = '';

    if (response.ok) {
      if (endpoint === 'cuentas') {
        responseDiv.innerHTML = getTablaCuentas(data);
      } else if (endpoint === 'saldo') {
        responseDiv.innerHTML = getTablaSaldo(data, numero_cuenta);
      }
      openSection(sectionName);
    } else {
      responseDiv.className = 'error';
      responseDiv.innerHTML = `Error: ${data.detail || 'Error desconocido'}`;
      openSection(sectionName);
    }

  } catch (error) {
    responseDiv.className = 'error';
    responseDiv.innerHTML = `Error de red o conexión: ${error.message}`;
    openSection(sectionName);
  }
}

/*
function getTablaDatosUsuario(data) {
  let table = '<table class="my-custom-table"><thead><tr><th>Clave</th><th>Valor</th></tr></thead><tbody>';

  // Mostrar claves principales
  for (let key in data) {
    if (key !== 'tarjetas' && key !== 'access_token'  && key !== 'access_token_expires'  && key !== 'token_type') {  
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
*/
function getTablaDatosUsuario(data) {
  let table = `
    <table class="my-custom-table">
      <thead>
        <tr>
          <th>Clave</th>
          <th>Valor</th>
        </tr>
      </thead>
      <tbody>
  `;

  // Claves principales
  for (let key in data) {
    if (key !== 'tarjetas' && key !== 'access_token' && key !== 'access_token_expires' && key !== 'token_type') {
      table += `<tr><td>${key}</td><td>${data[key]}</td></tr>`;
    }
  }

  // Tarjetas (agrupadas mejor)
  if (data.tarjetas && Array.isArray(data.tarjetas)) {
    data.tarjetas.forEach((tarjeta, index) => {
      table += `
        <tr class="tarjeta-row">
          <td>Tarjeta ${index + 1}</td>
          <td>${tarjeta.descripcion} · ${tarjeta.numero}</td>
        </tr>
      `;
    });
  }

  table += '</tbody></table>';
  return table;
}

function getTablaCuentas(data) {
  let html = '<div class="cuentas-grid">';

  if (data.cuentas && Array.isArray(data.cuentas)) {
    data.cuentas.forEach((cuenta, index) => {
      html += `
        <div class="cuenta-card">
          <div class="cuenta-card-header">Cuenta ${index + 1}</div>
          <div class="cuenta-tipo">${cuenta.tipo}</div>
          <div class="cuenta-numero">${cuenta.numero_cuenta}</div>
          <button 
            class="cuenta-action-button"
            onclick="consultarSaldoDesdeCuenta('${cuenta.numero_cuenta}')"
            data-testid="saldo-cuenta-${index + 1}">
            Ver saldo
          </button>
        </div>
      `;
    });
  } else {
    html += `
      <div class="warning">
        No se encontraron cuentas para la tarjeta seleccionada.
      </div>
    `;
  }

  html += '</div>';
  return html;
}
/*
function getTablaCuentas(data) {
  let html = '<div class="cuentas-grid">';

  if (data.cuentas && Array.isArray(data.cuentas)) {
    data.cuentas.forEach((cuenta, index) => {
      html += `
        <div class="cuenta-card">
          <div class="cuenta-card-header">Cuenta ${index + 1}</div>
          <div class="cuenta-tipo">${cuenta.tipo}</div>
          <div class="cuenta-numero">${cuenta.numero_cuenta}</div>
        </div>
      `;
    });
  } else {
    html += `
      <div class="warning">
        No se encontraron cuentas para la tarjeta seleccionada.
      </div>
    `;
  }

  html += '</div>';
  return html;
}
*/

/*
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
*/

/*
function getTablaSaldo(data, numero_cuenta) {
  let table = '<table class="my-custom-table"><thead><tr><th>Clave</th><th>Valor</th></tr></thead><tbody>';

  table += `<tr><td>Número de cuenta</td><td>${numero_cuenta}</td></tr>`;
  table += `<tr><td>Saldo</td><td>${data.saldo}</td></tr>`;

  table += '</tbody></table>';
  return table;
}
*/
function getTablaSaldo(data, numero_cuenta) {
  return `
    <div class="saldo-card">
      <h3>Saldo disponible</h3>
      <div class="saldo-cuenta">Cuenta ${numero_cuenta}</div>
      <p>$ ${data.saldo}</p>
    </div>
  `;
}

async function logout() {
  const token = localStorage.getItem('token');

  if (!token) {
    window.location.href = 'index.html';
    return;
  }

  try {
    const response = await fetch('https://walletchallenge-back.onrender.com/wallet/logout', {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    let data = {};
    const contentType = response.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      data = await response.json();
    }

    if (response.ok) {
      console.log(data[" message"] || 'Has cerrado sesión exitosamente');

      localStorage.removeItem('token');
      localStorage.removeItem('DatosUsuario');

      window.location.href = 'index.html';
    } else {
      alert(`Error al cerrar sesión: ${data.detail || 'Error desconocido'}`);
    }

  } catch (error) {
    alert(`Error de red al cerrar sesión: ${error.message}`);
  }
}
