var file = {
	exito: function(){
		window.localStorage.setItem("nombreUsuario", $("#nombreRegistro").val());
		window.location.href="#home";
	},

	error: function(error){
		alert(error.status);
		alert(error.toString());
		alert("Error al enviar foto al servidor");
	},

	transferir: function(fileURL){
		alert("transferir");
		/*
		Opciones de envio
		*/
		var options = new FileUploadOptions();
		options.fileKey="foto";
		options.fileName="miFoto";
		options.mimeType="image/jpeg";
		options.headers ={
			Connection: "close";
		}

		var ft = new FileTransfer();
		ft.upload(FileURL, "http://www.colors.edu.mx/archivoTest.php", file.exito, file.error, options)
	}
}