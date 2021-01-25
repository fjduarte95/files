window.addEventListener('load', (event) => {
  // console.log({ event });
  
  const arrayAlpnr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
  const base36 = arrayAlpnr.length;
  const alpnrForm = document.getElementById('alpnr_form');
  const alpnrInp1 = document.getElementById('alpnr_inp1');
  const alpnrInp2 = document.getElementById('alpnr_inp2');
  const alpnrTest = document.getElementById('alpnr_test');
  
  // Conversión alfanumérico - decimal
  function AlpnrToDecim(alpnr) {
    // console.log({ alpnr });

    let decim = 0;
    const length = alpnr.length;
  
    for (let i = 0; i < length; i++) {
      let pos1 = (length - (i + 1));
      let char = alpnr.charAt(pos1).toUpperCase();
      let pos2 = arrayAlpnr.indexOf(char);
  
      if (pos2 !== -1) {
        decim += (pos2 * (base36 ** i));
      }
      else {
        console.error('Valor no alfanumérico');
  
        return 0;
      }
    }
  
    return parseFloat(decim); // decim;
  }
  
  // Conversión decimal - alfanumérico 
  function DecimToAlpnr(decim) {
    // console.log({ decim });
    
    let alpnr = '';

    if (decim == 0) {
      return '0';
    }
  
    for (let i = decim; i > 0; i = parseInt(i / base36)) {
      alpnr = arrayAlpnr[(i % base36)] + alpnr;
    }

    return alpnr;
  }
  
  // Calcula diferencia entre alfanuméricos
  function DiffBetweenAlpnr(alpnr1, alpnr2) {
    const decim1 = AlpnrToDecim(alpnr1);
    const decim2 = AlpnrToDecim(alpnr2);
  
    return Math.abs(decim2 - decim1);
  }
  
  // Adición de alfanumérico
  function AddToAlpnr(alpnr, value) {
    const decim = AlpnrToDecim(alpnr);
  
    return DecimToAlpnr(Math.abs(decim + value));
  }
  
  // Sustracción de alfanumérico
  function SubtracFromAlpnr(alpnr, value) {
    const decim = AlpnrToDecim(alpnr);
  
    return DecimToAlpnr(Math.abs(decim - value));
  }
  
  // Conversión hexadecimal a decimal
  function HexadToDecim(hex) {
    // console.log({ hex });
    
    let decim = 0;
    const length = hex.length;
  
    for (let i = 0; i < length; i++) {
      let pos1 = (length - (i + 1));
      let char = hex.charAt(pos1).toUpperCase();
      let pos2 = arrayHex.indexOf(char);
  
      if (pos2 !== -1) {
        decim += (pos2 * (base16 ** i));
      }
      else {
        console.error('Valor no hexadecimal');
  
        return;
      }
    }
  
    return decim;
  }
  
  // Conversión decimal a hexadecimal
  function DecimToHexad(decim) {
    // console.log({ decim });
    
    let hex = '';
  
    for (let i = decim; i > 0; i = parseInt(i / base16)) {
      hex = arrayHex[i % base16] + hex;
    }
  
    if (hex == '') {
      console.error('Valor no numérico');

      return;
    }
    else {
      return hex;
    }
  }

  // Convierte a formato de salida 
  function DecimalOutput(value) {
    if (value == 0) {
      return '0.00';
    }

    if (typeof value == 'number') {
      value = value.toFixed(2);
    }

    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  // Convierte a formato de entrada
  function DecimalInput(value) {
    if (value == 0) {
      return 0;
    }

    if (typeof value == 'number') {
      value = value.toFixed(2);
    }

    return parseFloat(value.replace(/,/g, ''));
  }

  function test(alpnr1, alpnr2) {
    let decim1 = 0, alpnrA = '', 
        decim2 = 0, alpnrB = '';

    console.clear();

    if (alpnr1 !== 0) {
      decim1 = AlpnrToDecim(alpnr1);
      alpnrA = DecimToAlpnr(decim1);
      console.log({ alpnr1 }, { decim1 }, { alpnrA });
    }
    
    if (alpnr2 !== 0) {
      decim2 = AlpnrToDecim(alpnr2);
      alpnrB = DecimToAlpnr(decim2);
      console.log({ alpnr2 }, { decim2 }, { alpnrB });
    }
    
    if (decim1 > 0 && decim2 > 0) {
      const diffr = DiffBetweenAlpnr(alpnr1, alpnr2);
      console.log({ alpnr1 }, { alpnr2 }, { diffr });
      
      const addition = AddToAlpnr(alpnr1, diffr);
      console.log({ alpnr1 }, { diffr }, { addition });
      
      const subtraction = SubtracFromAlpnr(alpnr2, diffr);
      console.log({ alpnr2 }, { diffr }, { subtraction });
    }
  }

  // alpnrForm.addEventListener('submit', (event) => {
  //   event.preventDefault();
    
  //   test(alpnrInp1.value, alpnrInp2.value);
  // });
  
  alpnrInp1.addEventListener('input', (event) => {
    test(event.target.value, alpnrInp2.value);
  });
  
  alpnrInp2.addEventListener('input', (event) => {
    test(alpnrInp1.value, event.target.value);
  });

  // test('5ZSMBH0T1N', 'PLA4FK27UW'); // OK
  // test('368TO9GKU5', 'RQ58FC4UI3'); // OK
  // test('DEVK9A1W7M', 'DEVK9A276X'); // OK
  // test('DEVK9A139V', 'DEVK9A276K'); // OK
  // test('1111111111', 'ZZZZZZZZZZ'); // JS limit
  // test('11111111111', 'ZZZZZZZZZZZ'); // Error
});