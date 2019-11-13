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
    let types = ['income', 'expenses'];
    for (let type of types) {
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

    input.addEventListener('mouseover', (e) => {
        let id = e.target.attributes.manID.value;
        let inputs = document.querySelectorAll('input[manid="'+id+'"]');
        for (let input of inputs) input.style.background = '#c0ffb3';
    });

    input.addEventListener('mouseout', (e) => {
        let id = e.target.attributes.manID.value;
        let inputs = document.querySelectorAll('input[manid="'+id+'"]');
        for (let input of inputs) input.style.background = null;
    });

    return input;
}

drawMandatory();