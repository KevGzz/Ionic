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

function Inicio() {
  Eventos();
  ArmarMenuOpciones();
}

function MostrarLoader(texto) {
  loading.cssClass = "my-custom-class";
  loading.message = texto;
  //loading.duration = 2000;
  document.body.appendChild(loading);
  loading.present();
}

function DetenerLoader() {
  loading.dismiss();
}

function ArmarMenuOpciones() {
  let hayKey = localStorage.getItem("apiKey");
  let _menu = `<ion-item href="/" onclick="cerrarMenu()">Inicio</ion-item>`;

  if (hayKey) {
    _menu += ` <ion-item href="/regAlimento" onclick="cerrarMenu()">Registrar Alimento</ion-item>
                <ion-item href="/listar" onclick="cerrarMenu()">Listar Alimentos</ion-item>
                <ion-item onclick="Logout()">Log out</ion-item>`;
  } else {
    _menu += `<ion-item href="/login" onclick="cerrarMenu()">Log in</ion-item>
                  <ion-item href="/registro" onclick="cerrarMenu()">Registrarse</ion-item>`;
  }

  document.querySelector("#menuOpciones").innerHTML = _menu;
}

function Eventos() {
  ROUTER.addEventListener("ionRouteDidChange", Navegar);
  document
    .querySelector("#btnRegistrar")
    .addEventListener("click", TomarDatosRegistro);
  document
    .querySelector("#btnLogin")
    .addEventListener("click", TomarDatosLogin);
  document
    .querySelector("#btnRegAlimento")
    .addEventListener("click", TomarDatosAlimento);
  document
    .querySelector("#btnFiltrar")
    .addEventListener("click", FiltrarXFecha);
  document
    .querySelector("#btnMapa")
    .addEventListener("click", MostrarUsuariosEnMapa);
}

function TomarDatosLogin() {
  let nombreUsuario = document.querySelector("#txtUsuarioLogin").value;
  let password = document.querySelector("#txtPasswordLogin").value;

  IniciarSesion(nombreUsuario, password);
}

function IniciarSesion(nombreUsuario, password) {
  let usuario = new Object();
  usuario.usuario = nombreUsuario;
  usuario.password = password;
  MostrarLoader("Espere...");
  fetch("https://calcount.develotion.com/login.php", {
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
      if (data.codigo == 200) {
        MostrarToast("Exito!", 3000, "success");
        localStorage.setItem("apiKey", data.apiKey);
        localStorage.setItem("idUser", data.id);
        localStorage.setItem("caloriasDiarias", data.caloriasDiarias);
        ArmarMenuOpciones();
        NAV.push("page-home");
      } else {
        MostrarToast("Error: " + data.error, 5000, "danger");
        //document.querySelector("#resLog").innerHTML = data.error;
      }
    });
}

function Logout() {
  localStorage.clear();
  ArmarMenuOpciones();
  NAV.push("page-home");
  MENU.close();
}

function TomarDatosRegistro() {
  let nombreUsuario = document.querySelector("#txtUsuarioRegistro").value;
  let password = document.querySelector("#txtPasswordRegistro").value;
  let pais = document.querySelector("#slcPais").value;
  let calorias = document.querySelector("#txtCaloriasRegistro").value;

  Registrar(nombreUsuario, password, pais, calorias);
}

function Registrar(nombreUsuario, password, pais, calorias) {
  let usuario = new Object();
  usuario.usuario = nombreUsuario;
  usuario.password = password;
  usuario.idPais = pais;
  usuario.caloriasDiarias = calorias;
  fetch("https://calcount.develotion.com/usuarios.php", {
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

      if (data.codigo == 200) {
        MostrarToast("Exito!", 3000, "success");
        localStorage.setItem("apiKey", data.apiKey);
        ArmarMenuOpciones();
        NAV.push("page-home");
      } else {
        MostrarToast(data.mensaje, 5000, "danger");
      }
    });
}

function PoblarSelect() {
  MostrarLoader("Espere...");
  document.querySelector("#slcPais").innerHTML = "";
  document.querySelector("#slcPais").innerHTML =
    "<div slot='label'>País <ion-text color='danger'>(Requerido)</ion-text></div>";

  fetch("https://calcount.develotion.com/paises.php")
    .then(function (response) {
      console.log(response);
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      Paises = data.paises;
      for (let p of Paises) {
        document.querySelector(
          "#slcPais"
        ).innerHTML += `<ion-select-option value="${p.id}">${p.name}</ion-select-option>`;
      }
      DetenerLoader();
    });
}

function Navegar(evt) {
  const RUTA = evt.detail.to;
  console.log(evt);
  OcultarTodo();
  if (RUTA == "/") {
    HOME.style.display = "block";
    MostrarCalorias();
    document.querySelector("#cardMapa").style.display = "none";
    let hayKey = localStorage.getItem("apiKey");
    if (hayKey) {
      document.querySelector("#cardMapa").style.display = "block";
      CrearMapa();
    }
  } else if (RUTA == "/login") LOGIN.style.display = "block";
  else if (RUTA == "/registro") {
    REGISTRO.style.display = "block";
    PoblarSelect();
  } else if (RUTA == "/regAlimento") {
    REGALIMENTO.style.display = "block";
    PoblarSelectAlimento();
    fechaAlimento.max = new Date().toISOString(); //solo dios sabe como esto funciona
  } else if (RUTA == "/listar") {
    LISTAR.style.display = "block";
    document.querySelector("#btnFiltrar").style.display = "none";
    ListarRegistros();
    filtroRegistros.max = new Date().toISOString();
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

async function ObtenerAlimentos() {
  let promesaAlimento = await fetch(
    `https://calcount.develotion.com/alimentos.php`,

    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        apikey: localStorage.getItem("apiKey"),
        iduser: localStorage.getItem("idUser"),
      },
    }
  );
  let listaAlimentos = await promesaAlimento.json();
  return listaAlimentos;
}

async function PoblarSelectAlimento() {
  MostrarLoader("Espere...");
  let lista = await ObtenerAlimentos();
  DetenerLoader();
  for (let alimento of lista.alimentos) {
    document.querySelector(
      "#slcAlimento"
    ).innerHTML += `<ion-select-option value="${alimento.id}">${alimento.nombre}</ion-select-option>`;
  }
}

async function TomarDatosAlimento() {
  let alimento = document.querySelector("#slcAlimento").value;
  let cantidad = Number(document.querySelector("#txtCantidadAlimento").value);
  let fecha = document.querySelector("#fechaAlimento").value;
  if (fecha == undefined) {
    fecha = new Date();
    fecha = fecha.toISOString();
  }
  let encontrado = false;
  fecha = fecha.split("T")[0];
  // let valorXPorcion = 0;
  // let total = undefined;
  MostrarLoader("Espere...");
  let lista = await ObtenerAlimentos();
  DetenerLoader();
  encontrado = false;
  // for (let a of lista.alimentos) {
  //   if (a.id == alimento) {
  //     for (let i = 0; i <= a.porcion.length || !encontrado; i++) {
  //       let caracter = a.porcion.charAt(i);
  //       if (caracter == "g" || caracter == "m" || caracter == "u") {
  //         valorXPorcion = parseInt(a.porcion.substring(0, i));
  //         encontrado = true;
  //       }
  //     }
  //   }
  // }
  // total = valorXPorcion * cantidad;
  RegistrarAlimento(alimento, cantidad, fecha);
}

function RegistrarAlimento(alimento, total, fecha) {
  let registro = new Object();
  registro.idAlimento = alimento;
  registro.idUsuario = localStorage.getItem("idUser");
  registro.cantidad = total;
  registro.fecha = fecha;
  fetch("https://calcount.develotion.com/registros.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: localStorage.getItem("apiKey"),
      iduser: localStorage.getItem("idUser"),
    },
    body: JSON.stringify(registro),
  })
    .then(function (response) {
      console.log(response);
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      if (data.codigo == 200) {
        MostrarToast("Exito!", 3000, "success");
      } else {
        MostrarToast(data.mensaje, 5000, "danger");
      }
    });
}

async function ObtenerRegistros() {
  let promesaRegistro = await fetch(
    `https://calcount.develotion.com/registros.php?idUsuario=${localStorage.getItem(
      "idUser"
    )}`,

    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        apikey: localStorage.getItem("apiKey"),
        iduser: localStorage.getItem("idUser"),
      },
    }
  );
  console.log(promesaRegistro);
  let listaRegistros = await promesaRegistro.json();
  return listaRegistros;
}

async function ListarRegistros() {
  document.querySelector("#btnFiltrar").style.display = "none";
  MostrarLoader("Espere...");
  let listaRegistros = await ObtenerRegistros();
  let cadena = "<ion-card> <ion-list>";
  let icono = "";
  if (listaRegistros.registros.length != 0) {
    for (let registro of listaRegistros.registros) {
      let listaAlimentos = await ObtenerAlimentos();
      let alimento = undefined;
      for (let a of listaAlimentos.alimentos) {
        if (registro.idAlimento == a.id) alimento = a;
      }
      icono = alimento.imagen + ".png";
      cadena += `
				<ion-item>
				<ion-thumbnail slot="start">
				  <img alt="Imagen de ${
            alimento.nombre
          }" src="https://calcount.develotion.com/imgs/${icono}" />
				</ion-thumbnail>
				<ion-label>
				<h2>${alimento.nombre}</h2>
				<p>Calorías: ${alimento.calorias * registro.cantidad} kcal</p>
        <p>Cantidad: ${registro.cantidad}</p>
				</ion-label>
				<ion-button fill="outline" color="danger" id="btnEliminar${
          registro.id
        }" onclick="EliminarRegistro(this.id)">Eliminar</ion-button>
			  </ion-item>
		`;
    }
    cadena += "</ion-list> </ion-card-content> </ion-card> <br>";
    document.querySelector("#lista-alimentos").innerHTML = cadena;
  } else {
    let cadena = `
			<ion-card>
				<ion-card-header>
					<ion-card-title>Oops!</ion-card-title>
					<ion-card-subtitle>Parece que no tenés ningún registro todavía...</ion-card-subtitle>
				</ion-card-header>
				<ion-card-content>
					<ion-button size="small" fill="outline" color="success" href="/regAlimento">Crear uno</ion-button>
				</ion-card-content>
			</ion-card>`;
    document.querySelector("#lista-alimentos").innerHTML = cadena;
  }
  DetenerLoader();
}

function EliminarRegistro(id) {
  id = id.substring(11);
  MostrarLoader("Espere...");
  fetch(`https://calcount.develotion.com/registros.php?idRegistro=${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      apikey: localStorage.getItem("apiKey"),
      iduser: localStorage.getItem("idUser"),
    },
  })
    .then(function (response) {
      console.log(response);
      ListarRegistros();
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      if (data.codigo == 200) MostrarToast("Exito!", 3000, "success");
      else MostrarToast(data.mensaje, 3000, "danger");
    });
  DetenerLoader();
}

async function MostrarCalorias() {
  let hayKey = localStorage.getItem("apiKey");
  if (hayKey) {
    MostrarLoader("Espere...");
    let listaRegistros = await ObtenerRegistros();
    let listaAlimentos = await ObtenerAlimentos();
    let caloriasTotales = 0;
    let caloriasDiarias = 0;
    let fechaActual = new Date().toISOString();
    let limite = localStorage.getItem("caloriasDiarias");
    fechaActual = fechaActual.split("T")[0];
    for (let registro of listaRegistros.registros) {
      for (let alimento of listaAlimentos.alimentos) {
        if (registro.idAlimento == alimento.id) {
          caloriasTotales += alimento.calorias * registro.cantidad;
        }
      }
    }
    let cadena = `<ion-card-header>
    <ion-card-title>Calorias Totales</ion-card-title>
    <ion-card-subtitle>${caloriasTotales}</ion-card-subtitle>
    </ion-card-header>`;
    document.querySelector("#cardCalTotales").innerHTML = cadena;
    for (let registro of listaRegistros.registros) {
      for (let alimento of listaAlimentos.alimentos) {
        if (
          registro.idAlimento == alimento.id &&
          registro.fecha == fechaActual
        ) {
          caloriasDiarias += alimento.calorias * registro.cantidad;
        }
      }
    }
    let modificadorLimite = (limite * 10) / 100;
    cadena = `<ion-card-header>
    <ion-card-title>Calorias Diarias</ion-card-title>`;
    if (caloriasDiarias > limite)
      cadena += `<ion-card-subtitle color="danger">${caloriasDiarias}</ion-card-subtitle>`;
    else if (
      caloriasDiarias < limite &&
      caloriasDiarias >= limite - modificadorLimite
    )
      cadena += `<ion-card-subtitle color="warning">${caloriasDiarias}</ion-card-subtitle>`;
    else
      cadena += `<ion-card-subtitle color="success">${caloriasDiarias}</ion-card-subtitle>`;
    cadena += `</ion-card-header>`;
    document.querySelector("#cardCalDiarias").innerHTML = cadena;
    DetenerLoader();
  } else {
    let cadena = `<ion-card-header><ion-card-title>Bienvenido!</ion-card-title>
    <ion-card-subtitle>Por favor, inicia sesión para acceder a las funcionalidades.</ion-card-subtitle></ion-card-header>`;
    document.querySelector("#cardCalTotales").innerHTML = cadena;
  }
}

function MostrarBtnFiltro() {
  document.querySelector("#btnFiltrar").style.display = "block";
}

async function FiltrarXFecha() {
  let fechas = document.querySelector("#filtroRegistros").value;
  console.log(fechas);
  let fecha1;
  let fecha2;
  if (fechas.length == 2) {
    MostrarLoader("Espere...");
    let listaRegistros = await ObtenerRegistros();
    let cadena = "<ion-card> <ion-list>";
    let icono = "";
    if (listaRegistros.registros.length != 0) {
      for (let registro of listaRegistros.registros) {
        if (fechas[0] > fechas[1]) {
          fecha1 = fechas[1];
          fecha2 = fechas[0];
        } else {
          fecha1 = fechas[0];
          fecha2 = fechas[1];
        }
        if (registro.fecha >= fecha1 && registro.fecha <= fecha2) {
          let listaAlimentos = await ObtenerAlimentos();
          let alimento = undefined;
          for (let a of listaAlimentos.alimentos) {
            if (registro.idAlimento == a.id) alimento = a;
          }
          icono = alimento.imagen + ".png";
          cadena += `
          <ion-item>
          <ion-thumbnail slot="start">
            <img alt="Imagen de ${
              alimento.nombre
            }" src="https://calcount.develotion.com/imgs/${icono}" />
          </ion-thumbnail>
          <ion-label>
          <h2>${alimento.nombre}</h2>
          <p>Calorías: ${alimento.calorias * registro.cantidad} kcal</p>
          </ion-label>
          <ion-button fill="outline" color="danger" id="btnEliminar${
            registro.id
          }" onclick="EliminarRegistro(this.id)">Eliminar</ion-button>
          </ion-item>
      `;
        }
      }
      cadena += "</ion-list> </ion-card-content> </ion-card> <br>";
      document.querySelector("#lista-alimentos").innerHTML = cadena;
    } else {
      let cadena = `
        <ion-card>
          <ion-card-header>
            <ion-card-title>Oops!</ion-card-title>
            <ion-card-subtitle>Parece que no tenés ningún registro todavía...</ion-card-subtitle>
          </ion-card-header>
          <ion-card-content>
            <ion-button size="small" fill="outline" color="success" href="/regAlimento">Crear uno</ion-button>
          </ion-card-content>
        </ion-card>`;
      document.querySelector("#lista-alimentos").innerHTML = cadena;
    }
    DetenerLoader();
  } else {
    MostrarToast("Por favor, ingrese solo dos(2) fechas.", 5000, "danger");
  }
}

var map;

function CrearMapa() {
  map = L.map("map").setView([-34.90302008734796, -56.16357142234838], 14);
  L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
  }).addTo(map);
}

let latitud;
let longitud;

navigator.geolocation.getCurrentPosition(SetearCoordenadas);
function SetearCoordenadas(pos) {
  console.log(pos);
  latitud = pos.coords.latitude;
  longitud = pos.coords.longitude;
}

async function MostrarUsuariosEnMapa() {
  let cantidadUsuarios = Number(
    document.querySelector("#txtCantidadUsuarios").value
  );
}
