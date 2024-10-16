let db;

const dbName = "AutoMarketDB";
const storeName = "cars";

function initDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(dbName, 1);

        request.onerror = (event) => reject("Ошибка открытия базы данных");

        request.onsuccess = (event) => {
            db = event.target.result;
            resolve(db);
        };

        request.onupgradeneeded = (event) => {
            db = event.target.result;
            const objectStore = db.createObjectStore(storeName, { keyPath: "id", autoIncrement: true });
            objectStore.createIndex("brand", "brand", { unique: false });
            objectStore.createIndex("model", "model", { unique: false });
        };
    });
}

function addCar(car) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([storeName], "readwrite");
        const objectStore = transaction.objectStore(storeName);
        const request = objectStore.add(car);

        request.onerror = (event) => reject("Ошибка добавления автомобиля");
        request.onsuccess = (event) => resolve(event.target.result);
    });
}

function getAllCars() {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([storeName], "readonly");
        const objectStore = transaction.objectStore(storeName);
        const request = objectStore.getAll();

        request.onerror = (event) => reject("Ошибка получения автомобилей");
        request.onsuccess = (event) => resolve(event.target.result);
    });
}

// Инициализация базы данных и добавление начальных данных
async function initializeDatabase() {
    await initDB();
    const cars = await getAllCars();
    if (cars.length === 0) {
        await addCar({ brand: "Tesla", model: "Model S", year: 2022, price: 89990, description: "Электрический седан премиум-класса", imageUrl: "https://example.com/tesla_model_s.jpg" });
        await addCar({ brand: "BMW", model: "X5", year: 2023, price: 62500, description: "Роскошный среднеразмерный кроссовер", imageUrl: "https://example.com/bmw_x5.jpg" });
        await addCar({ brand: "Toyota", model: "Camry", year: 2023, price: 27000, description: "Надежный семейный седан", imageUrl: "https://example.com/toyota_camry.jpg" });
        console.log("Начальные данные добавлены в базу данных");
    }
}