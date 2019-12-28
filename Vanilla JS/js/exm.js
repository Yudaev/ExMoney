let mandatory = [
    {
        manID: 1,
        type: 'income',
        name: 'Зарплата',
        value: 55000
    },
    {
        manID: 2,
        type: 'income',
        name: 'Родители на ДР',
        value: 5000
    },
    {
        manID: 3,
        type: 'expenses',
        name: 'Аренда',
        value: 30000
    },
    {
        manID: 4,
        type: 'expenses',
        name: 'ЖКХ',
        value: 2000
    },
    {
        manID: 5,
        type: 'expenses',
        name: 'Транспорт',
        value: 3000
    }
];


function drawMandatory() {
    for (let type of getAllTypesMandatory(mandatory)) {
        let mandBlock = document.getElementsByClassName(type)[0],
            form = document.createElement('form'),
            sum = 0,
            textPlaceholder = (type === 'income') ? '+ Описание дохода' : '+ Описание расхода',
            numberPlaceholder = (type === 'income') ? '+ Сумма дохода' : '+ Сумма расхода';
        form.setAttribute('action', '#');
        form.setAttribute('method', 'post');
        mandBlock.appendChild(form);

        for (let i = 0; i < mandatory.length; i++){
            if (mandatory[i].type === type) {
                sum += mandatory[i].value;

                form.appendChild(createInput('text', mandatory[i].manID, textPlaceholder, false, mandatory[i].name));
                form.appendChild(createInput('number', mandatory[i].manID, numberPlaceholder, '0.01', mandatory[i].value));
            }
        }

        form.appendChild(createInput('text', 'new' + type, textPlaceholder, false,''));
        form.appendChild(createInput('number', 'new' + type, numberPlaceholder, '0.01', ''));

        form.appendChild(createInput('text', type, false, false,'Итого', true));
        form.appendChild(createInput('number', type, false, false, sum, true));
    }

}

function createInput(type, manID, placeholder, step, value, readonly) {
    let input = document.createElement('input');

    if (readonly) input.readOnly = true;
    input.setAttribute('type', type);
    if (manID) input.setAttribute('manID',manID);
    if (placeholder) input.setAttribute('placeholder',placeholder);
    if (step) input.setAttribute('step', step);
    input.setAttribute('value',value);

    // Стиль выделения ячеек с одинаковым manid
    input.addEventListener('mouseover', () => {
        let inputs = document.querySelectorAll('input[manid="'+manID+'"]');
        for (let input of inputs) input.style.background = '#c0ffb3';
    });

    input.addEventListener('mouseout', () => {
        let inputs = document.querySelectorAll('input[manid="'+manID+'"]');
        for (let input of inputs) input.style.background = null;
    });

    if (input.readOnly !== true) {
        // Редактирование заполненых редактируемых инпутов
        // input - применяет изменения на каждый новый символ в инпуте
        // blur - применяет когда теряется фокус с поля
        if (manID !== 'newincome' && manID !== 'newexpenses'){
                input.addEventListener('blur', (e) => {
                let inputs = document.querySelectorAll('input[manid="' + manID + '"]');

                // Удаление редактируемых ячеек, если все данные удалены внутри обеих manid в первом условии
                if (inputs[0].value === '' && inputs[1].value === '') {
                    for (let input of inputs) input.remove(); // inputs удаляются только когда потерян фокус
                    mandatory.forEach( (item, index, object) => {
                        if (item.manID === manID) object.splice(index, 1);
                        calculateTotalAmount(item.type)
                    })
                } else if (e.target.type === 'text'){
                    mandatory.forEach( (item) => {
                        if (item.manID === manID) item.name = e.target.value;
                    })
                } else {
                    mandatory.forEach( (item) => {
                        if (item.manID === manID) {
                            console.log(isNaN(parseFloat(e.target.value)));
                            item.value = isNaN(parseFloat(e.target.value)) ? 0 : parseFloat(e.target.value);
                            calculateTotalAmount(item.type);
                        }
                    })
                }
            });
        } else {
            let tick = true;
            input.addEventListener('input', (e) => {
                //console.log(e);
                //getUniqueManId(mandatory);
                if (e.target.value.length === 1 && tick) {
                    tick = false;
                    let form = e.target.parentNode,
                        curManId = e.target.attributes.manid.value;
                    let inputs = document.querySelectorAll('input[manid="'+curManId+'"]'),
                        textPlaceholder = (curManId.replace('new', '') === 'income') ? '+ Описание дохода' : '+ Описание расхода',
                        numberPlaceholder = (curManId.replace('new', '')  === 'income') ? '+ Сумма дохода' : '+ Сумма расхода';

                    for (let input of inputs) input.setAttribute('manid', getUniqueManId(mandatory));
                    //console.log(form.length);
                    form.insertBefore(createInput('text', curManId, textPlaceholder, false,''),
                                      form[form.length - 2]);
                    form.insertBefore(createInput('number', curManId, numberPlaceholder, '0.01', ''),
                                      form[form.length - 2]);
                } else if (e.target.value.length === 0) {
                    tick = true;
                }
            });
        }

        // Обработка нажатий кнопок в инпутах
        input.addEventListener("keypress", (e) => {
            //console.log(e);
            switch (e.keyCode) {
                case 13:  // Обработка нажатий Enter
                    if(e.target.attributes.type.value === 'text') {
                        let input = document.querySelector('input[manid="' + manID + '"][type="number"]');
                        input.focus();
                    } else if(e.target.attributes.type.value === 'number' &&
                              !getAllTypesMandatory(mandatory).includes(e.target.attributes.manid.value.replace('new', ''))) {
                        mandatory.forEach( (item) => {
                            if (item.manID === manID) {
                                let input = document.querySelector('input[manid="new' + item.type + '"][type="text"]');
                                input.focus();
                            }
                        });
                    } else {
                        console.log(3333);
                    }
                    break;
            }
        })
    }

    return input;
}

function checkavAilabilityNamesAndValues(arr, manID) {
    arr.forEach( (item) => {
        if (item.manID === manID) {
            if (item.value === 0 && item.name === '') return false;
        }
    });
    return true;
}

function getAllTypesMandatory(arr) {
    let types = [];
    for (let i = 0; i < arr.length; i++){
        if (!types.includes(arr[i].type)) types.push(arr[i].type);
    }
    return types;
}

function getUniqueManId(arr) {
    let manID = [];
    for (let i = 0; i < arr.length; i++){
        manID.push(arr[i].manID);
    }
    for (let i = 1; i < 99999; i++) {
        if (!manID.includes(i)) return i;
    }
    return console.error('ERROR: getUniqueManId не нашел уникальный manID');
}

function calculateTotalAmount(type) {
    let sum = 0,
        input = document.querySelector('[type="number"][manid="' + type + '"]');
    mandatory.forEach((item) => {
        if (item.type === type) sum += item.value
    });
    input.value = sum;
}

drawMandatory();

// let test = document.querySelector('input[manid="2"]');
// test.focus(1);
// console.log(test);


let mainParent = document.getElementsByClassName('main-parent')[0];

mainParent.addEventListener('click', (e) => {
    console.log(e);
});