var networkInfo = {
	estaConectado: function ()
	{
		return true;
		if(navigator.connection.type != Connection.NONE)
		{
			return true;
		}
		else
		{
			return false;
		}
	}
}