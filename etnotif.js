window.addEventListener('load', (event) => {
  // console.log({ event });

  const formNotif = document.getElementById('formNotif');
  const inpCantOrden = document.getElementById('inpCantOrden');
  const inpCantBase = document.getElementById('inpCantBase');
  const inpCantBuena = document.getElementById('inpCantBuena');
  const inpCantRest = document.getElementById('inpCantRest');
  const tbodyEtiq = document.getElementById('tbodyEtiq');
  const decimalInputs = document.querySelectorAll('.decimal');

  let cantBuena = 0, cantFabricada = 0, etiqs = [],
    cantOrden = 0, cantBase = 0;

  function buscaDatos(cantBuena) {
    let cantEtiq = etiqs.length;
    let cantNotificar = 0, cantPosterior = 0;

    if (cantEtiq > 0) {
      let i = (cantEtiq - 1);
      cantNotificar = decimalInput(cantBuena + etiqs[i].exced);
      cantPosterior = decimalInput(cantBuena + cantFabricada);

      if (cantPosterior <= cantOrden) {
        if (cantNotificar < cantBase) {
          etiqs[i].exced = cantNotificar;
        }
        else {
          etiqs[i].exced = 0;
        }
      }
    }
    else {
      cantPosterior = cantNotificar = decimalInput(cantBuena + cantFabricada);
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
      inpCantRest.value = decimalOutput(cantOrden - cantFabricada);

      // console.log({ cantPosterior });
      // console.log({ cantFabricada });
      // console.log({ etiqs });

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
      const cantExced = decimalInput(cantNotificar - cantBase);

      guardaEtiqueta(cantBase, cantExced);

      return imprimeEtiqueta(cantExced, cantPosterior);
    }
  }

  function guardaEtiqueta(menge, exced) {
    etiqs.push({
      contr: (etiqs.length + 1),
      menge: menge,
      exced: exced
    });
  }

  function muestraEtiquetas(etiqs) {
    let content = '';

    if (etiqs.length == 0) {
      return false;
    }

    etiqs.forEach(etiqueta => {
      content += (`
        <tr>
          <th align="center">${etiqueta.contr}</th>
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
      return '0.00';
    }

    value = decimalInput(value).toFixed(2);

    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  decimalInputs.forEach((input) => {
    input.addEventListener('input', (e) => {
      // Descarta todo lo que no sea dígito
      const value = e.target.value.replace(/\D/g, '');

      // Asigna valor formateado
      e.target.value = decimalOutput(value / 100);
    });
  });

  formNotif.addEventListener('submit', (event) => {
    event.preventDefault();

    cantOrden = decimalInput(inpCantOrden.value);
    cantBase = decimalInput(inpCantBase.value);
    cantBuena = decimalInput(inpCantBuena.value);

    if (cantOrden <= 0) {
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
      inpCantOrden.readOnly = true;
      inpCantBase.readOnly = true;

      if (buscaDatos(cantBuena)) {
        muestraEtiquetas(etiqs);
      }
    }
  });
});
