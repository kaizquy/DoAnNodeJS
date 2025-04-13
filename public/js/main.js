// public/js/main.js

document.addEventListener('DOMContentLoaded', () => {
    // Khởi tạo sự kiện khi trang tải xong
    fetchCars();
    setupSearchAndFilter();
  });
  
  // Hàm tải danh sách xe từ API
  async function fetchCars(query = '') {
    try {
      const response = await fetch(`/cars?${query}`);
      const cars = await response.json();
      renderCarList(cars);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách xe:', error);
    }
  }
  
  // Hàm hiển thị danh sách xe lên trang
  function renderCarList(cars) {
    const container = document.getElementById('carList');
    container.innerHTML = ''; // Xóa nội dung cũ
    cars.forEach(car => {
      const carDiv = document.createElement('div');
      carDiv.className = 'car-item';
      carDiv.innerHTML = `
        <h3>${car.name}</h3>
        <p>Giá: ${car.price.toLocaleString()} VND</p>
        <p>Hãng: ${car.make} - Model: ${car.model} (${car.year})</p>
        <p>Mô tả: ${car.description}</p>
      `;
      container.appendChild(carDiv);
    });
  }
  
  // Hàm thiết lập sự kiện tìm kiếm và lọc
  function setupSearchAndFilter() {
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchBtn');
    const categoryFilter = document.getElementById('categoryFilter');
    const priceFilter = document.getElementById('priceFilter');
  
    searchButton.addEventListener('click', () => {
      const query = buildQuery({
        name: searchInput.value,
        category: categoryFilter.value,
        price: priceFilter.value
      });
      fetchCars(query);
    });
  
    searchInput.addEventListener('input', () => {
      const query = buildQuery({
        name: searchInput.value,
        category: categoryFilter.value,
        price: priceFilter.value
      });
      fetchCars(query);
    });
  
    categoryFilter.addEventListener('change', () => {
      const query = buildQuery({
        name: searchInput.value,
        category: categoryFilter.value,
        price: priceFilter.value
      });
      fetchCars(query);
    });
  
    priceFilter.addEventListener('change', () => {
      const query = buildQuery({
        name: searchInput.value,
        category: categoryFilter.value,
        price: priceFilter.value
      });
      fetchCars(query);
    });
  }
  
  // Hàm tạo query string cho API từ các giá trị tìm kiếm và lọc
  function buildQuery({ name, category, price }) {
    const query = [];
  
    if (name) query.push(`name=${name}`);
    if (category) query.push(`category=${category}`);
    if (price) query.push(`price=${price}`);
  
    return query.join('&');
  }

  import { getAllCategories } from './api.js';

  document.addEventListener("DOMContentLoaded", async () => {
  const categoryFilter = document.getElementById('categoryFilter');
  const categories = await getAllCategories(); // API trả về danh sách danh mục

  categories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat._id;
    option.textContent = cat.name;
    categoryFilter.appendChild(option);
  });
});

import { getAllCars, getFeaturedCars } from './api.js';

async function renderCars() {
  const featuredList = document.getElementById("featuredCarList");
  const allList = document.getElementById("carList");

  const featured = await getFeaturedCars();
  const allCars = await getAllCars();

  featuredList.innerHTML = featured.map(renderCarCard).join('');
  allList.innerHTML = allCars.map(renderCarCard).join('');
}

function renderCarCard(car) {
  return `
    <div class="car-card">
      <img src="${car.imageUrl}" alt="${car.model}">
      <h3>${car.make} ${car.model}</h3>
      <p>Giá: ${car.price.toLocaleString()} VND</p>
      <button class="btn" onclick="addToCart('${car._id}')">Thêm vào giỏ</button>
    </div>
  `;
}


  