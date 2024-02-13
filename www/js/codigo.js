const MENU = document.querySelector("#menu");
const ROUTER = document.querySelector("#ruteo");
const HOME = document.querySelector("#pantalla-home");
const LOGIN = document.querySelector("#pantalla-login");
const REGISTRO = document.querySelector("#pantalla-registro");
const REGALIMENTO = document.querySelector("#pantalla-regAlimento");
const LISTAR = document.querySelector("#pantalla-listar");
const NAV = document.querySelector("ion-nav");
const loading = document.createElement("ion-loading");

Inicio();

function MostrarLoader(texto) {
  loading.cssClass = "my-custom-class";
  loading.message = texto;
  //loading.duration = 2000;
  document.body.appendChild(loading);
  loading.present();
}

function Inicio() {
  Eventos();
  ArmarMenuOpciones();
}
function ArmarMenuOpciones() {
  let HayToken = localStorage.getItem("token");
  let _menu = `<ion-item href="/" onclick="cerrarMenu()">Home</ion-item>`;

  if (HayToken) {
    _menu += ` <ion-item href="/regAlimento" onclick="cerrarMenu()">Registrar Alimento</ion-item>
                <ion-item href="/listar" onclick="cerrarMenu()">Listar Alimentos</ion-item>
                <ion-item onclick="Logout()">Log out</ion-item>`;
  } else {
    _menu += `<ion-item href="/login" onclick="cerrarMenu()">Log in</ion-item>
                  <ion-item href="/registro" onclick="cerrarMenu()">Registrarse</ion-item>`;
  }

  document.querySelector("#menuOpciones").innerHTML = _menu;
}

function Logout() {
  localStorage.clear();
  ArmarMenuOpciones();
  NAV.push("page-home");
  MENU.close();
}
function Eventos() {
  ROUTER.addEventListener("ionRouteDidChange", Navegar);
  document
    .querySelector("#btnRegistrar")
    .addEventListener("click", TomarDatosRegistro);
  document
    .querySelector("#btnLogin")
    .addEventListener("click", TomarDatosLogin);
}

function TomarDatosLogin() {
  let e = document.querySelector("#txtUsuarioLogin").value;
  let p = document.querySelector("#txtPasswordLogin").value;

  IniciarSesion(e, p);
}

function IniciarSesion(e, p) {
  let usuario = new Object();
  usuario.email = e;
  usuario.password = p;
  MostrarLoader("Espere...");
  fetch("https://ort-tallermoviles.herokuapp.com/api/usuarios/session", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(usuario),
  })
    .then(function (response) {
      console.log(response);
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      DetenerLoader();
      if (data.error == "") {
        localStorage.setItem("token", data.data.token);
        ArmarMenuOpciones();
        NAV.push("page-home");
      } else {
        MostrarToast("Error: " + data.error, 5000, "danger");
        //document.querySelector("#resLog").innerHTML = data.error;
      }
    });
}

function TomarDatosRegistro() {
  let n = document.querySelector("#txtNombreRegistro").value;
  let a = document.querySelector("#txtApellidoRegistro").value;
  let e = document.querySelector("#txtEmailRegistro").value;
  let d = document.querySelector("#txtDireccionRegistro").value;
  let p = document.querySelector("#txtPasswordRegistro").value;

  Registrar(n, a, e, d, p);
}

function Registrar(n, a, e, d, p) {
  let usuario = new Object();
  usuario.nombre = n;
  usuario.apellido = a;
  usuario.email = e;
  usuario.direccion = d;
  usuario.password = p;

  fetch("https://ort-tallermoviles.herokuapp.com/api/usuarios", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(usuario),
  })
    .then(function (response) {
      console.log(response);
      return response.json();
    })
    .then(function (data) {
      console.log(data);

      if (data.error == "") {
        document.querySelector("#resReg").innerHTML = "Alta correcta";
      } else {
        document.querySelector("#resReg").innerHTML = data.error;
      }
    });
}

function Navegar(evt) {
  const RUTA = evt.detail.to;
  console.log(evt);
  OcultarTodo();
  if (RUTA == "/") {
    HOME.style.display = "block";
  } else if (RUTA == "/login") {
    LOGIN.style.display = "block";
  } else if (RUTA == "/registro") {
    REGISTRO.style.display = "block";
  } else if (RUTA == "/regAlimento") {
    REGALIMENTO.style.display = "block";
  } else if (RUTA == "/listar") {
    LISTAR.style.display = "block";
  }
}
function cerrarMenu() {
  MENU.close();
}

function OcultarTodo() {
  HOME.style.display = "none";
  LOGIN.style.display = "none";
  REGISTRO.style.display = "none";
  REGALIMENTO.style.display = "none";
  LISTAR.style.display = "none";
}

function DetenerLoader() {
  loading.dismiss();
}

function Alertar(titulo, subtitulo, mensaje) {
  const alert = document.createElement("ion-alert");
  alert.cssClass = "my-custom-class";
  alert.header = titulo;
  alert.subHeader = subtitulo;
  alert.message = mensaje;
  alert.buttons = ["OK"];
  document.body.appendChild(alert);
  alert.present();
}

function MostrarToast(mensaje, duracion, color) {
  const toast = document.createElement("ion-toast");
  toast.message = mensaje;
  toast.duration = duracion;
  if (color == "") toast.color = undefined;
  else toast.color = color;
  document.body.appendChild(toast);
  toast.present();
}

// function ObtenerProductos() {
//   fetch("https://ort-tallermoviles.herokuapp.com/api/productos", {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//       "x-auth": localStorage.getItem("token"),
//     },
//   })
//     .then(function (response) {
//       console.log(response);
//       return response.json();
//     })
//     .then(function (data) {
//       console.log(data);
//       let cadena =
//         "<ion-card> <ion-card-header> <ion-card-title>Card Title</ion-card-title>" +
//         "<ion-card-subtitle>Card Subtitle</ion-card-subtitle> </ion-card-header> <ion-card-content> <ion-list>";
//       for (let p of data.data) {
//         cadena += `
//           <ion-item>
//           <ion-thumbnail slot="start">
//           <img alt="Silhouette of mountains" src="https://ort-talleresmoviles.herokuapp.com/assets/imgs/${urlImagen}"/>
//           </ion-thumbnail>
//           <ion-label>
//           p.nombre
//           </ion-label>
//           </ion-item>`;
//       }
//       cadena += "</ion-list> </ion-card-content> </ion-card>";
//       document.querySelector("#lista-productos").innerHTML = cadena;
//     });
// }
