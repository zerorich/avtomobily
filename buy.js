let selectedCar;

async function displayCarDetails() {
    await initializeDatabase();
    const urlParams = new URLSearchParams(window.location.search);
    const carId = parseInt(urlParams.get('id'));

    if (carId) {
        const car = await getCarById(carId);
        if (car) {
            selectedCar = car;
            const carDetails = document.getElementById('car-details');
            carDetails.innerHTML = `
                <h3>${car.brand} ${car.model}</h3>
                <img src="${car.imageUrl}" alt="${car.brand} ${car.model}" style="max-width: 300px;">
                <p>${car.description}</p>
                <p>Год выпуска: ${car.year}</p>
                <p>Цена: $${car.price}</p>
            `;
        } else {
            alert('Автомобиль не найден');
        }
    } else {
        alert('Не указан ID автомобиля');
    }
}

document.getElementById('buy-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    if (!selectedCar) {
        alert('Пожалуйста, выберите автомобиль');
        return;
    }

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;

    const order = {
        carId: selectedCar.id,
        customerName: name,
        customerEmail: email,
        customerPhone: phone,
        orderDate: new Date().toISOString()
    };

    try {
        await addOrder(order);
        alert('Заказ успешно оформлен!');
        window.location.href = 'index.html';
    } catch (error) {
        alert('Ошибка при оформлении заказа: ' + error);
    }
});

displayCarDetails();
