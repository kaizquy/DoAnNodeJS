// // cookie.js

// /**
//  * Lưu giá trị vào cookie
//  * @param {string} name - Tên cookie
//  * @param {string} value - Giá trị của cookie
//  * @param {number} days - Số ngày cookie sẽ tồn tại
//  */
// function setCookie(name, value, days) {
//     const d = new Date();
//     d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));  // Cộng thêm số ngày
//     const expires = "expires=" + d.toUTCString();  // Định dạng thời gian hết hạn
  
//     document.cookie = name + "=" + value + ";" + expires + ";path=/";
//   }
  
//   /**
//    * Lấy giá trị của cookie theo tên
//    * @param {string} name - Tên cookie cần lấy
//    * @returns {string|null} - Giá trị của cookie nếu tìm thấy, hoặc null nếu không có
//    */
//   function getCookie(name) {
//     const nameEq = name + "=";
//     const ca = document.cookie.split(';');  // Tách các cookie theo dấu chấm phẩy
//     for (let i = 0; i < ca.length; i++) {
//       let c = ca[i];
//       while (c.charAt(0) === ' ') {
//         c = c.substring(1, c.length);  // Loại bỏ khoảng trắng ở đầu
//       }
//       if (c.indexOf(nameEq) === 0) {
//         return c.substring(nameEq.length, c.length);  // Trả về giá trị của cookie
//       }
//     }
//     return null;  // Không tìm thấy cookie
//   }
  
//   /**
//    * Xóa cookie
//    * @param {string} name - Tên cookie cần xóa
//    */
//   function deleteCookie(name) {
//     setCookie(name, "", -1);  // Đặt ngày hết hạn là quá khứ để xóa cookie
//   }
  
//   export { setCookie, getCookie, deleteCookie };
  