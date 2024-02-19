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
	document
		.querySelector("#btnRegAlimento")
		.addEventListener("click", TomarDatosAlimento);
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
	if (RUTA == "/") HOME.style.display = "block";
	else if (RUTA == "/login") LOGIN.style.display = "block";
	else if (RUTA == "/registro") {
		REGISTRO.style.display = "block";
		PoblarSelect();
	} else if (RUTA == "/regAlimento") {
		REGALIMENTO.style.display = "block";
		PoblarSelectAlimento();
	} else if (RUTA == "/listar") {
		LISTAR.style.display = "block";
		ObtenerRegistros();
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

async function ObtenerRegistros() {
	MostrarLoader("Espere...");
	fetch(
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
	)
		.then(function (response) {
			console.log(response);
			return response.json();
		})
		.then(async function (data) {
			console.log(data);
			let cadena = "<ion-card> <ion-list>";
			let icono = "";
			if (data.registros.length != 0) {
				for (let registro of data.registros) {
					let listaAlimentos = await ObtenerAlimentos();
					let alimento = undefined;
					for(let a of listaAlimentos.alimentos){
						if(registro.idAlimento == a.id) alimento = a;
					}
					icono = alimento.imagen + ".png";
					cadena += `
				<ion-item>
				<ion-thumbnail slot="start">
				  <img alt="Imagen de ${alimento.nombre}" src="https://calcount.develotion.com/imgs/${icono}" />
				</ion-thumbnail>
				<ion-label>
				<h2>${alimento.nombre}</h2>
				<p>Calorías: ${alimento.calorias} kcal</p>
				</ion-label>
				<ion-button fill="outline" color="danger">Eliminar</ion-button>
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
		});
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
	let fecha = document.querySelector("ion-datetime").value;
	let valorXPorcion = 0;
	let total = undefined;
	MostrarLoader("Espere...");
	let lista = await ObtenerAlimentos();
	DetenerLoader();
	let encontrado = false;
	for (let a of lista.alimentos) {
		if(a.id == alimento){
			for(let i = 0; i <= a.porcion.length || !encontrado; i++){
				let caracter = a.porcion.charAt(i);
				if(caracter == "g" || caracter == "m" || caracter == "u"){ 
					valorXPorcion = parseInt(a.porcion.substring(0, i));
					encontrado = true;
				}
			}
		}
	}
	console.log(fecha);
	total = valorXPorcion * cantidad;
	// RegistrarAlimento(alimento, total, fecha);
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