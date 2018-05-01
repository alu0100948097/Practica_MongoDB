var MongoClient = require('mongodb').MongoClient;
var fs = require('fs');

MongoClient.connect("mongodb://localhost:27017/", function(err, database)
{
	if(err) { return console.dir(err);}
   const MyDB = database.db('test');
   MyDB.collection('Productos').drop();
   var ColeccionProductos = MyDB.collection('Productos');
   var FileProductos = fs.readFileSync('Productos.csv', 'utf8').toString().split('\n');
   for (var i = 1; i<FileProductos.length-1; i++)
   {
      FileProductos[i]=FileProductos[i].toString().replace(/\r/g, "")
		FileProductos[i]=FileProductos[i].toString().split(';');
      var Tupla = {'Producto':FileProductos[i][0], 'Precio':FileProductos[i][1]};
      ColeccionProductos.insert(Tupla);
   }
   MyDB.collection('Empleados').drop();
   var FileEmpleados = fs.readFileSync('Empleados.txt', 'utf8').toString().split('\n');
   var ColeccionEmpleados = MyDB.collection('Empleados');
   for (var i=0; i<FileEmpleados.length-1; i++)
	{
      var empleado = {'Empleado': FileEmpleados[i]};
   	ColeccionEmpleados.insert(empleado);
   }
   function random(min, max)
   {
   	return Math.floor(Math.random() * (max - min) + min);
   }
   function DameEmpleado()
   {
   	return FileEmpleados[random(0,FileEmpleados.length-1)];
   }
   MyDB.collection('Facturas').drop();
   var ColeccionFacturas = MyDB.collection('Facturas');
   var suma = 0;
   for (var i=0; i<1000; i++)
   {
   	var Factura = { 'Empleado':DameEmpleado() };
      var Detalle = [];
      var SubTotal = 0;
      var TotalIGIC = 0;
      var TotalFactura = 0;
      for (var p = 1; p<=random(1,5); p++)
      {
      	Cantidad = random(1,10);
         i_p = random(1,FileProductos.length-3);
         importe_sin_igic = (parseFloat(FileProductos[i_p][1])*Cantidad).toFixed(2);
         igic = (importe_sin_igic*0.07).toFixed(2);
         total = (parseFloat(importe_sin_igic)+parseFloat(igic)).toFixed(2);
         Detalle.push({
         	'Cantidad':Cantidad,
            'Producto':FileProductos[i_p][0],
            'Importe':parseFloat(FileProductos[i_p][1]).toFixed(2),
            'IGIC': igic,
            'Total': total
         });
         SubTotal+=parseFloat(importe_sin_igic);
         TotalIGIC+=parseFloat(igic);
         TotalFactura+=parseFloat(total);
      }
      Factura.SubTotal=SubTotal.toFixed(2);
      Factura.IGIC=TotalIGIC.toFixed(2);
      Factura.Total=TotalFactura.toFixed(2);
      Factura.Detalle=Detalle;
      ColeccionFacturas.insert(Factura);
      if (!isNaN(TotalFactura))
   		suma=(parseFloat(suma)+parseFloat(TotalFactura)).toFixed(2);
   }
   console.log('Suma total de las facturas: ' + parseFloat(suma).toFixed(2));
});
