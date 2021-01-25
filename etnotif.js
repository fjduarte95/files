window.addEventListener('load', (event) => {
  // console.log({ event });

  const formNotif = document.getElementById('formNotif');
  const inpOrdProd = document.getElementById('inpOrdProd');
  const inpCantOrden = document.getElementById('inpCantOrden');
  const inpCantBase = document.getElementById('inpCantBase');
  const inpCantBuena = document.getElementById('inpCantBuena');
  const inpCantFabric = document.getElementById('inpCantFabric');
  const tbodyEtiq = document.getElementById('tbodyEtiq');
  const amountInputs = document.querySelectorAll('.amount');
  
  let cantBuena = 0, cantFabricada = 0, arrayEtiquetas = [];
  let ordenProd = '', cantOrden = 0, cantBase = 0;

  function buscaDatos(cantBuena) {
    let cantEtiq = arrayEtiquetas.length;
    let cantNotificar = 0, cantPosterior = 0;

    if (cantEtiq > 0) {
      let i = (cantEtiq - 1);
      cantNotificar = decimalInput(cantBuena + arrayEtiquetas[i].exced);
      cantPosterior = decimalInput(cantBuena + cantFabricada);

      if (cantPosterior <= cantOrden) {
        if (cantNotificar < cantBase) {
          arrayEtiquetas[i].exced = cantNotificar;
        }
        else {
          arrayEtiquetas[i].exced = 0;
        }
      }
    }
    else {
      cantPosterior = cantNotificar = (cantBuena + cantFabricada);
    }

    if (cantFabricada == cantOrden) {
      alert('Orden de producción completa');

      // console.error('Orden de producción completa');

      return false;
    }
    else if (cantPosterior > cantOrden) {
      alert('Cantidad a Notificar excede Cantidad de la Orden');

      // console.error('Cantidad a Notificar excede Cantidad de la Orden');

      return false;
    } else {
      cantFabricada = imprimeEtiqueta(cantNotificar, cantPosterior);
      inpCantFabric.value = decimalOutput(cantFabricada);

      // console.log({ cantPosterior });
      // console.log({ cantFabricada });
      // console.log({ arrayEtiquetas });

      return true;
    }
  }

  function imprimeEtiqueta(cantNotificar, cantPosterior) {
    if (cantNotificar < cantBase) {
      if (cantPosterior == cantOrden) {
        if (cantNotificar > 0) {
          guardaEtiqueta(cantNotificar, 0);
        }
      }

      return cantPosterior;
    }
    else {
      const cantExced = (cantNotificar - cantBase);

      guardaEtiqueta(cantBase, cantExced);

      return imprimeEtiqueta(cantExced, cantPosterior);
    }
  }

  function guardaEtiqueta(menge, exced) {
    const contr = arrayEtiquetas.length + 1;
    
    const etiqueta = {
      contr: contr,
      menge: menge,
      exced: exced
    };

    arrayEtiquetas.push(etiqueta);
  }

  function muestraEtiquetas(arrayEtiquetas) {
    let content = '';

    if (arrayEtiquetas.length == 0) {
      return false;
    }

    arrayEtiquetas.forEach(etiqueta => {
      content += (`
        <tr>
          <th align="right">${etiqueta.contr}</th>
          <td align="right">${decimalOutput(etiqueta.menge)}</td>
          <td align="right">${decimalOutput(etiqueta.exced)}</td>
        </tr>
      `);
    });

    tbodyEtiq.innerHTML = content;

    return true;
  }

  // Convierte a formato de entrada
  let decimalInput = (value) => {
    if (value == 0) {
      return 0;
    }

    if (typeof value == 'string') {
      value = (value.replace(/,/g, '') * 1);
    }

    return parseFloat(value.toFixed(2));
  }
  
  // Convierte a formato de salida 
  let decimalOutput = (value) => {
    if (value == 0) {
      return "0.00";
    }

    value = decimalInput(value).toFixed(2);

    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  amountInputs.forEach((input) => {
    input.addEventListener('change', () => {
      let value = decimalInput(input.value);

      input.value = decimalOutput(value / 100);
    });
  });

  formNotif.addEventListener('submit', (event) => {
    event.preventDefault();

    ordenProd = inpOrdProd.value;
    cantOrden = decimalInput(inpCantOrden.value);
    cantBase  = decimalInput(inpCantBase.value);
    cantBuena = decimalInput(inpCantBuena.value);

    if (ordenProd == 0) {
      alert('Orden de Producción no válida');
      inpOrdProd.focus();
    }
    else if (cantOrden <= 0) {
      alert('Cantidad a Producir no válida');
      inpCantOrden.focus();
    }
    else if (cantBase <= 0) {
      alert('Cantidad Base no válida');
      inpCantBase.focus();
    }
    else if (cantBuena <= 0) {
      alert('Cantidad a Notificar no válida');
      inpCantBuena.focus();
    }
    else {
      inpOrdProd.readOnly = true;
      inpCantOrden.readOnly = true;
      inpCantBase.readOnly = true;

      if (buscaDatos(cantBuena)) {
        muestraEtiquetas(arrayEtiquetas);
      }
    }
  });
});