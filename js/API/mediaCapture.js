var mc = 
{
	exito: function(mediaFiles)
	{
		var path = mediaFiles[0].localURL;
		$("#fotoTomadaRegistro").html('<img src="'+path+'">');
		//alert(path);
	},

	error: function()
	{
		alert("Error al tomar foto")
	},

	abrirCamara: function()
	{
		navigator.device.capture.captureImage(mc.exito, mc.error, {limit:1});
	}
};