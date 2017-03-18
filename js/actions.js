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
		$("#botonRegistrar").tap(fn.registrar);
		$("#botonTomarFoto").tap(mc.abrirCamara);
	},
	registrar: function()
	{
		/*Obtener todos los datos del formulario*/
		var nombre 		= $("#nombreRegistro").val();
		var email 		= $("#emailRegistro").val();
		var tel 		= $("#telefonoRegistro").val();
		var password 	= $("#passwordRegistro").val();
		var foto 		= $("#fotoTomadaRegistro img")[0];

		console.log(nombre+" "+email+" "+tel+" "+password);

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
		$.ajax({
			  method: "POST",
			  url: "http://www.colors.edu.mx/archivoTest.php",
			  data: { nombre: nombreR, 
			  		  email: emailR,
			  		  tel: telR,
			  		  password: passwordR
			  		}

			}).done(function( mensaje ) {
			   		if(mensaje == 1)
			   		{
			   			/*
						Transferimos la foto
			   			*/
			   			var fotoUrl = fotoR.src;
			   			file.transferir();
			   		}
			   		else
			   		{
			   			alert("Error al enviar datos de registro");
			   		}
			  });
	}
}

/* LLAMAR AL METODO INIT
EN EL NAVEGADOR
fn.init(); */


/*
	PARA COMPILAR


$(fn.deviceready);*/
fn.deviceready();