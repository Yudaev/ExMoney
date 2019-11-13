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

    // Редактирование заполненых инпутов
    if (manID !== 'newincome' && manID !== 'newexpenses' && input.readOnly !== true) {
        input.addEventListener('blur', (e) => {
            let inputs = document.querySelectorAll('input[manid="' + manID + '"]');
            console.log(inputs);

            // Удаление редактируемых ячеек, если все данные удалены внутри обеих manid в первом условии
            if (inputs[0].value === '' && inputs[1].value === '') {
                for (let input of inputs) input.remove();
                mandatory.forEach( (item, index, object) => {
                    if (item.manID === manID) object.splice(index, 1);
                })
            } else if (e.target.type === 'text'){
                mandatory.forEach( (item) => {
                    if (item.manID === manID) item.name = e.target.value;
                })
            } else {
                mandatory.forEach( (item) => {
                    if (item.manID === manID) item.value = parseFloat(e.target.value);
                })
            }
        });
    }

    return input;
}

function getAllTypesMandatory(arr) {
    let types = [];
    for (let i = 0; i < arr.length; i++){
        if (!types.includes(arr[i].type)) types.push(arr[i].type);
    }
    return types;
}

drawMandatory();