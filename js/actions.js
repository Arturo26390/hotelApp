var fn = 
{
	deviceready: function()
	{
		document.addEventListener("deviceready", fn.init, false);
	},

	init: function()
	{
		/*
		En esta seccion vamos a ascociar todos los eventos del "Click" al HTML
		*/
		fn.ponerFecha();
		$("#botonRegistrar").tap(fn.registrar);
		$("#botonTomarFoto").tap(mc.abrirCamara);
		$(".tipoHabitacion").tap(fn.seleccionarTipoDeHabitacion);
		$("#reserva1 .siguiente").tap(fn.reserva1Siguiente);
		$("#reserva2 .reservar").tap(fn.realizarReservacion);
		$("#botonCerrarSesion").tap(fn.cerrarSesion);
		$("#botonInicioSesion").tap(fn.iniciarSesion);
		$("#botonHistorial").tap(fn.mostrarHistorial);
		$("#botonReservasPendientes").tap(fn.mostrarReservasPendientes);
		$("#botonGaleria").tap(fn.mostrarGaleria);
		
		$("#gallery").on('tap', 'img', fn.mostrarPopUp);

	},
	mostrarPopUp : function()
	{
		var ruta = $(this).attr("src");
		$("#popupGaleria").popup("open");
		$("#popupfoto img").attr("src" , ruta);
	},

	mostrarGaleria : function()
	{
		$.ajax({
			method: "GET",
			url: "http://www.colors.edu.mx/images.json"
		}).done(function(data){
			/*
			Iniciar Galeria
			*/
			$("#gallery").html("");
			var texto= "";
			var contador=1;
			/*
			Recorrer arreglo de imagenes
			*/
			data.images.forEach(function(image){
				//console.log(image);
				if(contador % 2 == 0)
				{
					texto += "<div class='ui-block-a'><img src='img/galeria/"+image.imageName+".jpg'></div>";
				}
				else
				{
					texto += "<div class='ui-block-b'><img src='img/galeria/"+image.imageName+".jpg'></div>";	
				}
				contador=contador++;
				$("#gallery").html(texto);
			})
		})
	},

	mostrarHistorial : function()
	{
		almacen.cargarDatosHistorial();
	},

	mostrarReservasPendientes : function()
	{
		almacen.cargarDatosReservasP();
	},

	iniciarSesion: function()
	{
		var pass 		= $("#passwordSesion").val();
		var email 		= $("#emailSesion").val();

		try{
			
			if(email == ""){
				throw new Error("Email forzozo")
			}
			if(email.indexOf("@") == -1){
				throw new Error("Debe contener arroba");
			}
			if (pass == "")
			{
				throw new Error("Campo contraseña es forzozo");
			}
			fn.enviaSesion(email, pass);	

		}catch(error){
			alert(error);
		}
	},
	enviaSesion: function(emailR,passR)
	{
		$.ajax({
			  method: "POST",
			  url: "http://www.colors.edu.mx/archivoTest.php",
			  data: { email: emailR, 
			  		  pass: passR
			  		}

			}).done(function( mensaje ) {
			   		if(mensaje == 1)
			   		{
			   			window.localStorage.setItem("nombreUsuario", emailR);
						window.location.href="#home";
			   		}
			   		else
			   		{
			   			alert("Error al iniciar Sesion");
			   		}
			  }).fail(function (error){
			});
	},

	cerrarSesion: function()
	{
		window.localStorage.removeItem("nombreUsuario");
		window.location.href = "#registro";
	},

	ponerFecha: function()
	{
		var fecha = new Date();
		var dia = fecha.getDate();
		var mes = fecha.getMonth() + 1;
		var anio = fecha.getFullYear();
		var hoy = dia +"/"+ mes +"/"+ anio;

		$(".fecha").html(hoy);
	},

	realizarReservacion: function(event)
	{
		event.preventDefault();
		/*Obtener datos para realizar reservacion*/
		var reservacion = {
			tipoHabitacion 		: $("#reserva1").attr("tipoHabitacion"),
			numPersonas			: $("#reserva2 select.numPersonas").val(),
			numHabitaciones		: $("#reserva2 select.numHabitaciones").val(),		
			numDias 			: $("#reserva2 select.numDias").val()
		};
		

		/*
		Corroborar si hay conexion a internet
		*/
		if(networkInfo.estaConectado())
		{
			/*Si hubo conexion, entonces enviamos los datos*/
			$.ajax({
					method : "POST",
					url: "http://www.colors.edu.mx/archivoTest.php",
					data : {
							  reservacionS : reservacion
						   }

			}).done(function(respuesta){
				/*  Checar respuesta del servidor, si se envio correcto entonces
					guardamos los datos localmente
				*/
				if(respuesta==1)
				{
					almacen.guardarReservasHistorial(reservacion.tipoHabitacion,reservacion.numPersonas,reservacion.numHabitaciones,reservacion.numDias);
				}
				else
				{
					alert("Error al guardar reservacion en el servidor");
				}
			});
		}
		else
		{
			almacen.guardarReservaLocal(reservacion.tipoHabitacion,reservacion.numPersonas,reservacion.numHabitaciones,reservacion.numDias);
		}
		
		/*
		 *Resetear datos del formulario
		 */
		 $("#reserva1").removeAttr("tipoHabitacion");
		 $(".tipoHabitacion").css("background-color", "");
		 $("#reserva2 select").prop("selectedIndex", 0).selectmenu("refresh", true);
		 window.location.href= "#home";

	},

	reserva1Siguiente: function()
	{
		/*
			Verificar que el usuario haya seleccionado algun tipo de habitacion
		*/
		if($("#reserva1").attr("tipoHabitacion") != undefined)
		{
			window.location.href="#reserva2";
		}
		else
		{
			alert("Es necesario seleccionar un tipo de habitacion");
		}
	},

	seleccionarTipoDeHabitacion: function()
	{
		$(".tipoHabitacion").css("background-color", "");
		$(this).css("background-color", "#38C");
		$("#reserva1").attr("tipoHabitacion", $(this).text().toLowerCase());
	},



	registrar: function()
	{
		/*Obtener todos los datos del formulario*/
		var nombre 		= $("#nombreRegistro").val();
		var email 		= $("#emailRegistro").val();
		var tel 		= $("#telefonoRegistro").val();
		var password 	= $("#passwordRegistro").val();
		var foto 		= $("#fotoTomadaRegistro img")[0];

		//console.log(nombre+" "+email+" "+tel+" "+password);

		try{
			if(foto == undefined){
				throw new Error("Debe tomar una foto");
			}

			if(typeof nombre !== "string"){
				throw new Error("Nombre no valido");
			}
			if (nombre == "")
			{
				throw new Error("El nombre es forzozo");
			}
			if(email == ""){
				throw new Error("Email forzozo")
			}
			if(tel == ""){
				throw new Error("Telefono forzozo")
			}
			if(email.indexOf("@") == -1){
				throw new Error("Debe contener arroba");
			}
			if(Number.isNaN(Number(tel))){
				throw new Error("El telefono debe ser numerico");
			}
			if(password == ""){
				throw new Error("Password forzozo")
			}
			/*
				Registrar al Usuario
			*/
			fn.enviarRegistro(nombre, email, tel, password, foto);	

		}catch(error){
			alert(error);
		}
	},
	enviarRegistro: function(nombreR,emailR,telR,passwordR,fotoR){
		alert("Enviando datos");
		//alert(nombreR + emailR + telR + passwordR + fotoR);
		$.ajax({
			  method: "POST",
			  url: "http://www.colors.edu.mx/archivoTest.php",
			  data: { nombre: nombreR, 
			  		  email: emailR,
			  		  tel: telR,
			  		  password: passwordR
			  		}

			}).done(function( mensaje ) {
				alert("Datos enviados");
				alert(mensaje);
			   		if(mensaje == 1)
			   		{
			   			/*
						Transferimos la foto
			   			*/
			   			var fotoUrl = $(fotoR).attr("src");
			   			file.transferir(fotoUrl);
			   		}
			   		else
			   		{
			   			alert("Error al enviar datos de registro");
			   		}
			  }).fail(function (error){
				alert(error.status);
				alert(error.message);
				alert(error.responseText);
			});
	}
}

/* LLAMAR AL METODO INIT
EN EL NAVEGADOR*/
fn.init(); 


/*
	PARA COMPILAR


$(fn.deviceready);*/
//fn.deviceready();