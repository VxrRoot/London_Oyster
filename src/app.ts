// Elements
const balance = document.querySelector('.balance');
const addMoneyBtn = document.querySelector('.add-money');
const closeModalAddMoneyBtn = document.querySelector('.close-add-money-modal');

const startTravelBtn = document.querySelector('.start-travel-btn');
const modalStartTravel = document.querySelector('.travel-to-modal');
const closeModalStartTravel = document.querySelector('.close-travel-modal');

const modalAddMoney = document.querySelector('.modal-add-money');
const addCashBtn = document.querySelectorAll('.add-cash')
const currentStationWrapper = document.querySelector('.current-station')

const goTorwardNextBtn = document.querySelector('.go-torward-next');
const goTorwardPrevBtn = document.querySelector('.go-torward-prev');
const getOffBtn = document.querySelector('.get-off-btn')

const travelByBusBtn = document.querySelector('.travel-by-bus')
const modalTravelByBus = document.querySelector('.travel-by-bus-modal');
const closeModalTravelByBus = document.querySelector('.close-travel-by-bus');
const btnsTravelByBusTo = document.querySelectorAll('.travel-by-bus-to');

// data

const zones = [
    {name: "Holborn", zones: 1},
    {name: "Eral's Court 1'", zones: 1},
    {name: "Eral's Court 2'", zones: 2},
    {name: "Wimbledon", zones: 2},
    {name: "Hammersmith", zones: 3},
]

// Variables

let currentBalance: number = 0;

let currentStation: number = 0;

let nextStation: number | null;

let prevStation: number | null;

let traveledZones: number[] = [];

const maxFare: number = 3.2;

const busFare: number = 1.8;

// Functionality

const setCurrentBalance = (value: number) => {
    console.log(`Value to minus`, value)
    currentBalance -= value;
    console.log(`BALANCE:`, currentBalance);
    currentBalance = currentBalance > 0 ? currentBalance : 0;
    currentBalance = Number(currentBalance.toFixed(1))
    balance.innerHTML = `${currentBalance}$`;
}

const calculateTicketPrice = (traveledZonesToPay: number[]) => {
    let priceToPay = 0;

    if(traveledZonesToPay.length === 1 && traveledZonesToPay.includes(1)) {
        priceToPay = 2.5;
    } else if (traveledZonesToPay.length === 2 && traveledZonesToPay.includes(1)) {
        priceToPay = 3;
    } else if (traveledZonesToPay.length === 2 && !traveledZonesToPay.includes(1)) {
        priceToPay = 2.25;
    } else if (traveledZonesToPay.length === 3) {
        priceToPay = 3.2;
    } else if (traveledZonesToPay.length === 1 && !traveledZonesToPay.includes(1)) {
        priceToPay = 2;
    }

    setCurrentBalance(priceToPay);

    if(traveledZonesToPay.length === 0 ) {
        alert("You didn't make the trip, welcome back")
        return;
    }

    alert(`Your trip took place in zones ${traveledZonesToPay} and you paid ${priceToPay}$`);
}

const handleGetOut = () => {
    modalStartTravel.setAttribute('style', 'display: none')
    calculateTicketPrice(traveledZones);
    traveledZones = [];
}

const handleExitStation = () => {
    console.log(traveledZones);
    if(traveledZones.length === 0) return;
    modalStartTravel.setAttribute('style', 'display: none')
    let priceToPay = maxFare;
    setCurrentBalance(priceToPay)
    traveledZones = [];
    alert(`You left the station without validation of a ticket, so you have to paid ${maxFare}, don't do it again!`)
}

const setStationsInfo = (actualStation: number) => {
    nextStation = actualStation < zones.length - 1 ? actualStation + 1 : null
    prevStation = actualStation > 0 ? actualStation - 1 : null

    currentStationWrapper.innerHTML = `Current Station: ${zones[actualStation].name}`;

    goTorwardNextBtn.innerHTML = nextStation ? `Go Torwards: ${zones[nextStation].name}` : 'End Line';

    goTorwardPrevBtn.innerHTML = prevStation !== null ? `Go Torwards: ${zones[prevStation].name}` : 'End Line';
}

const startTravel = (station: number, type: string) => {
    console.log("start Travel");

    if(!(currentBalance >= maxFare)) {
        alert("Not enough money!!! Add some money and try again...")
        return;
    };

    if(!traveledZones.includes(zones[currentStation].zones)) traveledZones.push(zones[currentStation].zones)
    
    if ( type === 'next') {
        currentStation += 1
        if(!traveledZones.includes(zones[currentStation].zones)) traveledZones.push(zones[currentStation].zones)
        if(currentStation === zones.length - 1) alert("END STATION, Please leave the Train and start your travel again!");
    } else if (type === 'prev') {
        currentStation -= 1
        if(!traveledZones.includes(zones[currentStation].zones)) traveledZones.push(zones[currentStation].zones)
        if(currentStation === 0) alert("END STATION, Please leave the Train and start your Travel again!") 
    }

    console.log(`current station ${currentStation}`);
    console.log(`traveled zones ${traveledZones}`);

    setStationsInfo(currentStation);
}

goTorwardNextBtn.addEventListener('click', () => startTravel(currentStation, "next"));

goTorwardPrevBtn.addEventListener('click', () => startTravel(currentStation, "prev"));

getOffBtn.addEventListener('click', () => handleGetOut())

addCashBtn.forEach(item => {
   item.addEventListener('click', () => {

      const moneyValue = item.attributes[1].value

      currentBalance += Number(moneyValue);

      balance.innerHTML = `${currentBalance}$`

      modalAddMoney.setAttribute('style', 'display: none')
   })
});

const openModal = (button: Element, modal: Element) => {
   button.addEventListener('click', () => {
      modal.setAttribute('style', 'display: flex');
   })
}

const closeModal = (button: Element, modal: Element) => {
   button.addEventListener('click', () => {
      modal.setAttribute('style', 'display: none')
   })
}

btnsTravelByBusTo.forEach(element => {
    element.addEventListener('click', () => {
        const station = Number(element.getAttribute('station'));
        if (currentBalance >= busFare) {
            currentStation = station;
            setCurrentBalance(busFare);
            console.log(currentStation);
            setStationsInfo(currentStation);
            alert(`You traveled to: ${element.innerHTML}, WELCOME`)
        } else {
            alert("Not enought money!");
        }
    })
});

openModal(addMoneyBtn, modalAddMoney);
closeModal(closeModalAddMoneyBtn, modalAddMoney);

openModal(startTravelBtn, modalStartTravel);
closeModal(closeModalStartTravel, modalStartTravel);

openModal(travelByBusBtn, modalTravelByBus);
closeModal(closeModalTravelByBus, modalTravelByBus);

closeModalStartTravel.addEventListener("click" , () => handleExitStation())

setStationsInfo(currentStation);



