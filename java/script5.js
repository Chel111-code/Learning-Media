document.addEventListener('DOMContentLoaded', function () {
  const canvas = document.getElementById('geometryCanvas');
  const ctx = canvas.getContext('2d');
  const notification = document.getElementById('notification');
  const gridSize = 24; // Ukuran grid dalam piksel

  // Canvas dimensions
  canvas.width = 240;
  canvas.height = 240;

  // Triangle coordinates and draggable points
  const triangle = [
    { x: 3 * gridSize, y: 1 * gridSize },
    { x: 4 * gridSize, y: 4 * gridSize },
    { x: 1 * gridSize, y: 4 * gridSize },
  ];
  let points = [
    { x: 192, y: 144 },
    { x: 168, y: 192 },
    { x: 216, y: 192 },
  ];
  let dragPoint = null;

  // Target coordinates
  const targetPoints = [
    { x: 120, y: 24 },
    { x: 24, y: 168 },
    { x: 168, y: 168 },
  ];

  // Function to draw grid
  function drawGrid() {
    ctx.strokeStyle = '#ddd'; // Warna grid

    // Menggambar garis vertikal
    for (let x = 0; x <= canvas.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }

    // Menggambar garis horizontal
    for (let y = 0; y <= canvas.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
  }

  // Function to draw the initial state
  function drawInitialState() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid();

    // Draw mirror line
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.strokeStyle = 'transparent';
    ctx.stroke();

    // Draw static triangle
    drawTriangle(triangle, '#B5AAAA');

    // Draw draggable points
    points.forEach((point) => {
      ctx.beginPath();
      ctx.arc(point.x, point.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#3CD69F';
      ctx.fill();
      ctx.stroke();
    });

    // Connect draggable points
    drawTriangle(points, '#3CD69F');
  }

  function drawTriangle(points, color) {
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    points.forEach((point) => ctx.lineTo(point.x, point.y));
    ctx.closePath();
    ctx.strokeStyle = color;
    ctx.stroke();
  }

  // Mouse and touch event handlers
  function handleMouseDown(e) {
    const mousePos = getMousePos(canvas, e);
    dragPoint = getDragPoint(mousePos);
  }

  function handleMouseMove(e) {
    if (!dragPoint) return;
    const mousePos = getMousePos(canvas, e);
    dragPoint.x = mousePos.x;
    dragPoint.y = mousePos.y;
    drawInitialState();
  }

  function handleMouseUp(e) {
    if (dragPoint) {
      const snappedPos = snapToGrid(dragPoint);
      dragPoint.x = snappedPos.x;
      dragPoint.y = snappedPos.y;
    }
    dragPoint = null;
    drawInitialState();
    updateNotification();
  }

  // Touch event adaptations
  function handleTouchStart(e) {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent('mousedown', {
      clientX: touch.clientX,
      clientY: touch.clientY,
    });
    canvas.dispatchEvent(mouseEvent);
  }

  function handleTouchMove(e) {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent('mousemove', {
      clientX: touch.clientX,
      clientY: touch.clientY,
    });
    canvas.dispatchEvent(mouseEvent);
  }

  function handleTouchEnd(e) {
    if (dragPoint) {
      const snappedPos = snapToGrid(dragPoint);
      dragPoint.x = snappedPos.x;
      dragPoint.y = snappedPos.y;
    }
    dragPoint = null;
    drawInitialState();
    const mouseEvent = new MouseEvent('mouseup', {});
    canvas.dispatchEvent(mouseEvent);
  }

  canvas.addEventListener('mousedown', handleMouseDown);
  canvas.addEventListener('mousemove', handleMouseMove);
  canvas.addEventListener('mouseup', handleMouseUp);
  canvas.addEventListener('touchstart', handleTouchStart, false);
  canvas.addEventListener('touchmove', handleTouchMove, false);
  canvas.addEventListener('touchend', handleTouchEnd, false);

  // Utility functions
  function getMousePos(canvas, evt) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top,
    };
  }

  function getDragPoint(mousePos) {
    return points.find(
      (point) => Math.sqrt((point.x - mousePos.x) ** 2 + (point.y - mousePos.y) ** 2) < 10
    );
  }

  function snapToGrid(point) {
    return {
      x: Math.round(point.x / gridSize) * gridSize,
      y: Math.round(point.y / gridSize) * gridSize,
    };
  }

  function updateNotification() {
    const checkButton = document.getElementById('Check5');
    // Memeriksa apakah tombol "Check" telah diklik
    if (!checkButton.clicked) {
      // Jika belum diklik, tidak melakukan apa-apa
      return;
    }

    // Memeriksa apakah setiap titik berada dalam jarak tertentu dari titik target
    const tolerance = 10; // Jarak toleransi
    const correctPosition = points.every((point) =>
      targetPoints.some(
        (targetPoint) =>
          Math.abs(point.x - targetPoint.x) < tolerance &&
          Math.abs(point.y - targetPoint.y) < tolerance
      )
    );

    // Memperbarui pesan notifikasi berdasarkan hasil pengecekan
    if (correctPosition) {
      // Menghilangkan kelas hidden dari elemen dengan id 'benar3' jika posisi benar
      document.getElementById('benar3').classList.remove('hidden');
      document.getElementById('benar3').classList.add('inline-block');
      document.getElementById('salah3').classList.add('hidden');
    } else {
      document.getElementById('salah3').classList.remove('hidden');
      document.getElementById('salah3').classList.add('inline-block');
      document.getElementById('benar3').classList.add('hidden');
    }
    // Mengatur kembali status tombol "Check" menjadi belum diklik
    checkButton.clicked = false;
  }

  // Event listener untuk tombol "Check"
  document.getElementById('Check5').addEventListener('click', function () {
    // Set flag clicked ke true ketika tombol "Check" diklik
    this.clicked = true;
    // Panggil fungsi updateNotification setelah tombol diklik
    updateNotification();
  });

  drawInitialState();
});

const checkButton = document.getElementById('Check1');

// Tambahkan event listener ke tombol "Check"
checkButton.addEventListener('click', function checkHandler() {
  // Ambil tombol yang sedang memiliki latar belakang gelap
  const activeButton = document.querySelector('#TesPertama1 .bg-secondary');

  // Jika tombol yang memiliki latar belakang gelap adalah tombol "C1"
  if (activeButton && activeButton.id === 'buttonA1') {
    // Tampilkan pesan "Benar"
    document.getElementById('benar1').classList.remove('hidden');
    document.getElementById('benar1').classList.add('inline-block');
    document.getElementById('buttonA1').classList.add('bg-[#7BFFD0]');
    document.getElementById('buttonA1').classList.remove('bg-secondary');

    document.getElementById('A1').classList.add('border-hijau');
    document.getElementById('A1').classList.add('bg-white');
    // Sembunyikan pesan "Salah"
    document.getElementById('salah1').classList.add('hidden');
  } else {
    // Tampilkan pesan "Salah"
    document.getElementById('salah1').classList.remove('hidden');
    document.getElementById('salah1').classList.add('inline-block');
    document.getElementById('buttonA1').classList.add('bg-[#7BFFD0]');
    document.getElementById('A1').classList.add('border-hijau');
    document.getElementById('A1').classList.add('bg-white');
    // Sembunyikan pesan "Benar"
    document.getElementById('benar1').classList.add('hidden');
  }

  // Menonaktifkan event listener untuk tombol "Check1"
  checkButton.removeEventListener('click', checkHandler);

  // Menonaktifkan event listener untuk div ABCD
  divs.forEach((div) => {
    div.removeEventListener('click', divClickHandler);
  });
});

// Dapatkan referensi ke semua elemen div ABCD
const divs = document.querySelectorAll('#TesPertama1 .flex');

// Tambahkan event listener ke setiap div ABCD
divs.forEach((div) => {
  div.addEventListener('click', divClickHandler);
});

function divClickHandler() {
  // Menghapus kelas "bg-secondary" dari semua tombol
  const buttons = document.querySelectorAll('#TesPertama1 button');
  buttons.forEach((button) => {
    button.classList.remove('bg-secondary');
  });
  // Menambahkan kelas "bg-secondary" ke tombol di dalam div yang diklik
  const button = this.querySelector('button');
  button.classList.add('bg-secondary');

  // Aktifkan tombol "Check1"
  checkButton.removeAttribute('disabled');
}

document.getElementById('tombolSenter').addEventListener('click', function () {
  document.querySelector('.cahayaSenter').classList.remove('hidden');
  document.getElementById('macan').classList.add('macan');
});

document.getElementById('tombolFoto').addEventListener('click', function () {
  document.getElementById('foto').classList.add('awwwww');

  document.getElementById('4x6').classList.add('wuss');
  document.getElementById('2x3').classList.add('hidden');
});

const foto = document.getElementById('foto');
const tombolFoto = document.getElementById('tombolFoto');

tombolFoto.addEventListener('click', function () {
  gsap.to(foto, {
    duration: 1,
    scale: 2,
    y: -104,
    ease: 'power2.inOut',
  });
});

document.addEventListener('DOMContentLoaded', function () {
  const pembesaranK = document.getElementById('pembesaranK');
  const animasipembesaranK = document.getElementById('animasipembesaranK');

  const observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.target === pembesaranK && entry.intersectionRatio >= 1) {
          observer.unobserve(pembesaranK);
          animasipembesaranK.classList.remove('hidden');
        }
      });
    },
    {
      threshold: 1,
    }
  );

  observer.observe(pembesaranK);
});

document.addEventListener('DOMContentLoaded', function () {
  const pengecilanK = document.getElementById('pengecilanK');
  const animasipengecilanK = document.getElementById('animasipengecilanK');

  const observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.target === pengecilanK && entry.intersectionRatio >= 1) {
          observer.unobserve(pengecilanK);
          animasipengecilanK.classList.remove('hidden');
        }
      });
    },
    {
      threshold: 1,
    }
  );

  observer.observe(pengecilanK);
});

document.addEventListener('DOMContentLoaded', function () {
  const TesPertama1 = document.getElementById('TesPertama1');
  const pilihanTespertama = document.getElementById('pilihanTespertama');

  const observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.target === TesPertama1 && entry.intersectionRatio >= 1) {
          observer.unobserve(TesPertama1);
          pilihanTespertama.classList.remove('hidden');
        }
      });
    },
    {
      threshold: 1,
    }
  );

  observer.observe(TesPertama1);
});

document.addEventListener('DOMContentLoaded', function () {
  const contohKedua = document.getElementById('contohKedua');
  const animasiDilatasibangun = document.getElementById('animasiDilatasibangun');

  const observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.target === contohKedua && entry.intersectionRatio >= 1) {
          observer.unobserve(contohKedua);
          animasiDilatasibangun.classList.remove('hidden');
        }
      });
    },
    {
      threshold: 1,
    }
  );

  observer.observe(contohKedua);
});

// Dapatkan referensi ke tombol "Check2"
const checkButton2 = document.getElementById('Check2');

checkButton2.disabled = true; // Menonaktifkan tombol "Check2" secara default

// Tambahkan event listener ke tombol "Check2"
checkButton2.addEventListener('click', function () {
  const activeButton = document.querySelector('#TesKedua1 .animate-ping');

  if (activeButton && activeButton.id === 'C2') {
    // Logika jika kondisi terpenuhi
    buttonsTesKedua1.forEach((button) => {
      if (button.id !== 'C2') {
        button.classList.add('hidden');
      }
    });
    document.getElementById('benar2').classList.remove('hidden');
    document.getElementById('garisMuncul').classList.remove('hidden');
    document.getElementById('titikMuncul').classList.remove('hidden');
    document.getElementById('benar2').classList.add('inline-block');
    document.getElementById('salah2').classList.add('hidden');

    document.getElementById('C2').classList.add('bg-red');
    document.getElementById('titikP').classList.remove('hidden');
    document.getElementById('C2').classList.remove('bg-primary', 'animate-ping');
    document.getElementById('Bhasil').classList.remove('hidden');

    // Menonaktifkan tombol "Check2" setelah diklik
    this.disabled = true;
  } else {
    // Logika jika kondisi tidak terpenuhi
    buttonsTesKedua1.forEach((button) => {
      if (button.id !== 'C2') {
        button.classList.add('hidden');
      }
    });
    activeButton.classList.remove('animate-ping');
    document.getElementById('garisMuncul').classList.remove('hidden');
    document.getElementById('titikMuncul').classList.remove('hidden');
    document.getElementById('salah2').classList.remove('hidden');
    document.getElementById('benar2').classList.add('hidden');
    document.getElementById('salah2').classList.add('inline-block');
    document.getElementById('titikP').classList.remove('hidden');

    document.getElementById('C2').classList.add('bg-red');
    document.getElementById('Bhasil').classList.remove('hidden');
  }

  buttonsTesKedua1.forEach((button) => {
    button.removeEventListener('click', buttonClickHandler);
  });
});

// Fungsi untuk menangani klik pada tombol di dalam div TesKedua1
function buttonClickHandler() {
  // Menghapus kelas "animate-ping" dari semua tombol
  const buttons = document.querySelectorAll('#TesKedua1 button');
  buttons.forEach((button) => {
    button.classList.remove('animate-ping');
  });
  // Menambahkan kelas "animate-ping" ke tombol yang diklik
  this.classList.add('animate-ping');

  // Mengaktifkan tombol "Check2" jika ada tombol yang diklik
  checkButton2.disabled = false;
}

// Dapatkan referensi ke semua tombol di dalam div TesKedua1 kecuali tombol "Check2"
const buttonsTesKedua1 = document.querySelectorAll('#TesKedua1 button:not(#Check2)');

// Tambahkan event listener ke setiap tombol di dalam div TesKedua1
buttonsTesKedua1.forEach((button) => {
  button.addEventListener('click', buttonClickHandler);
});

document.addEventListener('DOMContentLoaded', function () {
  const TesKedua1 = document.getElementById('TesKedua1');
  const tes1 = document.getElementById('tes1');

  const observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.target === TesKedua1 && entry.intersectionRatio >= 1) {
          observer.unobserve(TesKedua1);
          tes1.classList.remove('hidden');
        }
      });
    },
    {
      threshold: 1,
    }
  );

  observer.observe(TesKedua1);
});

function toggleNavbar() {
  var sidebar = document.getElementById('sidebar');
  var wacawbutton = document.getElementById('sidebarToggle');
  var homeButton = document.getElementById('home');
  var judul = document.getElementById('judul');

  sidebar.classList.toggle('translate-x-full');
  sidebar.classList.toggle('translate-x-0');

  // Menggunakan kelas 'translate' yang telah didefinisikan
  wacawbutton.classList.toggle('translate-x-4');
  homeButton.classList.toggle('translate-x-4');

  judul.classList.toggle('hidden');
}

document.getElementById('playback').addEventListener('click', function () {
  location.reload(); // Reload halaman
});

document.getElementById('playback1').addEventListener('click', function () {
  location.reload(); // Reload halaman
});

document.getElementById('playback2').addEventListener('click', function () {
  location.reload(); // Reload halaman
});

document.getElementById('playback3').addEventListener('click', function () {
  location.reload(); // Reload halaman
});

function removeanimasiDilatasititik() {
  var animasiDilatasititik = document.getElementById('animasiDilatasititik');
  animasiDilatasititik.classList.remove('opacity-30');

  var play1 = document.getElementById('play1');
  play1.classList.toggle('hidden');

  var animasiDilatasititiko = document.getElementById('animasiDilatasititiko');
  animasiDilatasititiko.classList.toggle('hidden');
}

function removeanimasiDilatasibangun() {
  var animasiDilatasibangun = document.getElementById('animasiDilatasibangun');
  animasiDilatasibangun.classList.remove('opacity-30');

  var play2 = document.getElementById('play2');
  play2.classList.toggle('hidden');

  var animasiDilatasibanguno = document.getElementById('animasiDilatasibanguno');
  animasiDilatasibanguno.classList.toggle('hidden');
}

document.addEventListener('DOMContentLoaded', function () {
  var canvas1 = document.getElementById('canvas');
  var ctx1 = canvas1.getContext('2d');
  var gridSize1 = 24; // Ukuran grid
  var correctPoint = { x: 6, y: 4 }; // Contoh titik yang benar
  var clickedPoint = { x: -1, y: -1 }; // Titik yang dipilih oleh pengguna
  var checkButton2 = document.getElementById('Check4'); // Tombol "Check"
  var isCorrectPointClicked = false; // Status apakah titik yang benar telah diklik
  var isPointClicked = false; // Status apakah titik telah diklik

  canvas1.width = 240;
  canvas1.height = 240;

  function drawGrid() {
    ctx1.beginPath();
    for (var x = 0; x <= canvas1.width; x += gridSize1) {
      ctx1.moveTo(x, 0);
      ctx1.lineTo(x, canvas1.height);
    }
    for (var y = 0; y <= canvas1.height; y += gridSize1) {
      ctx1.moveTo(0, y);
      ctx1.lineTo(canvas1.width, y);
    }
    ctx1.strokeStyle = '#ddd';
    ctx1.stroke();
  }

  function drawPoint(x, y) {
    ctx1.beginPath();
    ctx1.arc(x * gridSize1, y * gridSize1, 4, 0, Math.PI * 2);
    ctx1.fillStyle = '#079292';
    ctx1.fill();
  }

  function clearcanvas1() {
    ctx1.clearRect(0, 0, canvas1.width, canvas1.height);
    drawGrid();
  }

  function snapToGrid(mouseX, mouseY) {
    return {
      x: Math.round(mouseX / gridSize1),
      y: Math.round(mouseY / gridSize1),
    };
  }

  function updateNotification() {
    if (isCorrectPointClicked) {
      document.getElementById('benar4').classList.remove('hidden');
      document.getElementById('benar4').classList.add('inline-block');
      document.getElementById('salah4').classList.add('hidden');
      document.getElementById('benarA').classList.remove('hidden');
    } else {
      document.getElementById('salah4').classList.remove('hidden');
      document.getElementById('salah4').classList.add('inline-block');
      document.getElementById('benar4').classList.add('hidden');
    }
  }

  canvas1.addEventListener('click', function (e) {
    if (isCorrectPointClicked) {
      // Jika titik yang benar sudah diklik, tidak melakukan apa-apa
      return;
    }

    var rect = canvas1.getBoundingClientRect();
    var mouseX = e.clientX - rect.left;
    var mouseY = e.clientY - rect.top;

    var snappedPoint = snapToGrid(mouseX, mouseY);
    clickedPoint.x = snappedPoint.x;
    clickedPoint.y = snappedPoint.y;
    isPointClicked = true; // Menandai bahwa titik telah diklik

    clearcanvas1();
    drawPoint(clickedPoint.x, clickedPoint.y);
  });

  checkButton2.addEventListener('click', function () {
    if (!isPointClicked || isCorrectPointClicked) {
      // Jika titik belum diklik atau titik yang benar sudah diklik, tidak melakukan apa-apa
      return;
    }

    var correctPosition = clickedPoint.x === correctPoint.x && clickedPoint.y === correctPoint.y;
    isCorrectPointClicked = correctPosition; // Menandai status apakah titik yang benar telah diklik
    updateNotification();
  });

  drawGrid();
});
