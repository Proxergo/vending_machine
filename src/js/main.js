import '../css/style.css';


/*Массив обьектов денег. Кол-во(quantity) определяется случайным образом в указанном диапозоне. 
Количество можно изменять*/

const currency = [
    {name: 'sum1', value: 1, quantity: rndInt(0, 15)},
    {name: 'sum5', value: 5, quantity: rndInt(0, 8)},
    {name: 'sum10', value: 10, quantity: rndInt(0, 6)},
    {name: 'sum50', value: 50, quantity: rndInt(0, 5)},
    {name: 'sum100', value: 100, quantity: rndInt(0, 4)},
    {name: 'sum500', value: 500, quantity: rndInt(0, 3)},
    {name: 'sum1000', value: 1000, quantity: rndInt(0, 2)},
];

/*Массив обьектов продуктов. Количество продуктов(quantity) определяется случайным образом при загрузке страницы.
Значения можно изменять*/
const productsList = [
    {name: 'Газировка', price: 100, quantity: rndInt(0, 5)},
    {name: 'Орешки', price: 50, quantity: rndInt(0, 7)},
    {name: 'Вода', price: 30, quantity: rndInt(0, 5)},
    {name: 'Шоколадка', price: 44, quantity: rndInt(0, 8)},    
    {name: 'Чипсы', price: 80, quantity: rndInt(0, 5)},
    {name: 'Булочка', price: 28, quantity: rndInt(1, 7)},
    {name: 'Кофе', price: 130, quantity: rndInt(0, 5)},
    {name: 'Жвачка', price: 1, quantity: rndInt(20, 50)},
];

// Класс для создания и последующего создания "карточки" продукта
class Product {
    constructor(args) {
        this.name = args.name;
        this.price = args.price;
        this.quantity = args.quantity;
    }

    getProductHTML(){
        if (this.quantity === 0) {
            return `<button class="product empty" type="button">
                <p class='product_name'>${this.name}</p>
                <span>Цена: </span><p class='product_price'>${this.price}</p></span>
                <span>Кол-во: <p class='product_quantity'>${this.quantity}</p></span>
            </button>`
        } else {
            return `<button class="product" type="button">
                        <p class='product_name'>${this.name}</p>
                        <span>Цена: <p class='product_price'>${this.price}</p></span>
                        <span>Кол-во: <p class='product_quantity'>${this.quantity}</p></span>
                    </button>`
        }
    }        
   
    loadProduct(args){
        let html = '';
        const content = document.querySelector('.products_box');
        html = this.getProductHTML(args);
        content.insertAdjacentHTML('beforeend', html);
    }
};

// Класс для создания и "наполнения" автомата деньгами

class Money {
    constructor(args) {
        this.name   = args.name;        
        this.value  = args.value;
        this.quantity = args.quantity;
    }

    getMoneyHTML(){
        return `<span class="banknote">${this.value}&#8381: Кол-во=
                    <span id="${this.name}">${this.quantity}</span>
                </span>`
    }
       
    loadMoney(args){
        let html = '';        
        html = this.getMoneyHTML(args);
        cashMachine.insertAdjacentHTML('beforeend', html);
    }
           
}




/*Обработчик события при загрузке DOM. Рендеринг кнопок с товаром, привязка обработчиков событий, 
 сохранение количества денег в sessionStorage,присвоение селекторов в момент построения дерева*/
document.addEventListener('DOMContentLoaded',()=> {    

    const sum1 = document.querySelector('#sum1');
    const sum5 = document.querySelector('#sum5');
    const sum10 = document.querySelector('#sum10');
    const sum50 = document.querySelector('#sum50');
    const sum100 = document.querySelector('#sum100');
    const sum500 = document.querySelector('#sum500');
    const sum1000 = document.querySelector('#sum1000');

    for (let i = 0; i < productsList.length; i++) {
        let temporary =  new Product(productsList[i]);
        temporary.loadProduct(temporary);
    }

    for (let i = 0; i < currency.length; i++) {
        let temporary =  new Money(currency[i]);
        temporary.loadMoney(temporary);
    }
    
    sessionStorage.setItem('currency', JSON.stringify(currency));

    document.querySelectorAll('.product').forEach(element => {
        element.addEventListener('click', ()=> { 
            getProduct(element);           
        })
    });

});

const amount = document.querySelector('.current_amount'),
    cashReturn = document.querySelector('.cash_return'),
    logHelper = document.querySelectorAll('.log_helper>p'),
    cashMachine = document.querySelector('.cash_machine');

let value = 0;          //Переменная для хранения баланса внесённых денег
let marker = 1;         //Переключатель




//Рандомизатор значений в указанном диапозоне. Для продуктов и денег
function rndInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

//Получение значеня баланса и выведение на экран
function getValue(element) {
    value += Number(element.textContent);
    amount.textContent = ('Внесено: '+value);    
}

//Учёт внесенных денег. Счётчик и баланс
function getCash(element) {
    let y = +element.textContent; 

    if (y === 50) {        
        let i = sum50.textContent;
        i = Number(i)+1;
        sum50.textContent = i;
        currency[3].quantity = i;
    } else if (y === 100) {
        let i = sum100.textContent;
        i = Number(i)+1;
        sum100.textContent = i;
        currency[4].quantity = i;
    } else if (y === 500) {
        let i = sum500.textContent;
        i = Number(i)+1;
        sum500.textContent = i;
        currency[5].quantity = i;
    } else if (y === 1000) {
        let i = sum1000.textContent;
        i = Number(i)+1;
        sum1000.textContent = i;
        currency[6].quantity = i;
    }
    
}

//Сброс баланса внесённых денег. Изменение подсказки на экране
function resetAmount() {
    value = 0;
    amount.textContent = 'Внесено: 0';
}


//Сброс счётчика банкнот до состояния к моменту загрузке страницы
function defaultCash() {
    let currentCurrency = JSON.parse(sessionStorage.getItem('currency'))
    let temp = cashMachine.querySelectorAll('.banknote>span');
    for (let i = 0; i < currentCurrency.length; i++) {
        temp[i].textContent = currentCurrency[i].quantity;       
    }
}

//Изменение окна с подсказками
function logChange(p1, p2) {    
    logHelper[0].textContent = p1;
    logHelper[1].textContent = p2;
}


//Выдача товара. Отрабатыает в момент нажатия кнопки с товаром и сразу выдаёт товар. Изменяет баланс и количество товара
function getProduct(element) {    
    let quantity = element.querySelector('.product_quantity').innerHTML;
    let price = element.querySelector('.product_price').innerHTML;
    if (Number(quantity) === 0) {
        logChange("Извините товар закончился", "Выберите другой товар");  
    } else if (Number(quantity) === 1 && value >= +price) {
        element.querySelector('.product_quantity').innerHTML = Number(quantity) - 1;
        element.classList.add('empty');
        value = value - Number(price);
        amount.innerHTML = 'Остаток: ' + value;
        marker = 2;
    } else if (value >= +price) {                
        element.querySelector('.product_quantity').innerHTML = Number(quantity) - 1;
        value = value - Number(price);
        amount.innerHTML = 'Остаток: ' + value;
        marker = 2;
    } else {
        logChange("Недостаточно средств", "Внесите необходимую сумму")
    }
}


//Выдача сдачи деньгами. Обратный перебор чтобы сперва выдавало крупными банкнотами
function getChange() {

    function temp(i) {
        if (value>currency[i].value && currency[i].quantity > 0) {            
            currency[i].quantity = currency[i].quantity - 1;
            value = value - currency[i].value;
            if (currency[i].quantity > 0) {
                getChange();
            }         
        }
    }

    for (let i = currency.length-2; i >= 0; i--) {  
        temp(i);
        let bank = document.querySelectorAll('.cash_machine>span>span');
        for (let k = 0; k < bank.length; k++) {
            bank[k].textContent = currency[k].quantity;
        }
        
        amount.innerHTML = 'Остаток: '+ value;   
    }
}


//Выдача сдачи товаром, если нельзя расплатиться деньгами полностью
function getProductChange() {
    document.querySelectorAll('.product').forEach(element => {
        
        let quantity = element.querySelector('.product_quantity');
        
        if (+quantity.innerHTML > 0) {
            for (let i = 0; +quantity.innerHTML >= i; i++) {
                getProduct(element);
            }
        }
    })

}


/* Обработчик событий кнопки сброса/возврата денег. Изменение подсказки на дисплее.
Применение маркера для блокировки возможности вернуть деньги, если уже был куплен товар*/
cashReturn.addEventListener('click', () => { 
    if (marker === 1) {
        defaultCash();
        resetAmount();
        logChange('Добро пожаловать!', 'Пожалуйста внесите депозит'); 
    } else if (marker === 2) {
        logChange('После покупки товара', 'можно только забрать сдачу');
    }
      
});

// Внесение наличных. Изменение счётчика. Изменение подсказки на дисплее
document.querySelectorAll(".cash").forEach(element => {
    element.addEventListener('click', () => {
        getValue(element);
        getCash(element);
        logChange('Выберите товар', 'из списка слева');
    } )
});


//Событие при нажатии кнопки получения сдачи
document.querySelector('.get_change').addEventListener('click', () =>{    
    getChange();
    for (let i = 0; i<productsList.length; i++) {
        if (productsList[i].quantity>0) {
            getProductChange(); 
            continue
        } else {
            break
        }
    }
    getProductChange();
    if (value > 0) {            
        logChange('Приносим свои извинения', 'Мы не можем выплатить сдачу полностью')
    } else {
        logChange('Спасибо за покупку','Приходите к нам еще')
    }
});