using Microsoft.AspNetCore.Mvc;
using VistaNewProject.Services;

namespace VistaNewProject.Controllers
{
    public class DetallePedidosController : Controller
    {
        private readonly IApiClient _client;


        public DetallePedidosController(IApiClient client)
        {
            _client = client;
        }


        public async Task<ActionResult> Index()
        {
            var detallepedido = await _client.GetDetallepedidoAsync();

            if (detallepedido == null)
            {
                return View("Error");
            }

            return View(detallepedido);
        }

        [HttpGet]
        public async Task<IActionResult> Create()
        {
            var producto = await _client.GetProductoAsync();
            var unidad = await _client.GetUnidadAsync();
            var pedidos = await _client.GetPedidoAsync();
            var ultimoPedido = pedidos.OrderByDescending(p => p.PedidoId).FirstOrDefault();

            ViewBag.UltimoPedidoId = ultimoPedido?.PedidoId ?? 0;


           
            
                var lotes = await _client.GetLoteAsync();

            
                
            

            ViewBag.Producto = producto;
            ViewBag.Unidad = unidad;

            return View();
        }







    

        public async Task<IActionResult> CrearDetalles([FromBody] Detallepedido detallePedido)
        {
            // Agrega el detalle recibido a la lista global
            Console.WriteLine(detallePedido);

            listaGlobalDetalles.Add(detallePedido);

            // Imprimir los valores de las propiedades del detalle recibido en la consola
            Console.WriteLine("Detalle recibido:");
            Console.WriteLine("PedidoId: " + detallePedido.PedidoId);
            Console.WriteLine("ProductoId: " + detallePedido.ProductoId);
            Console.WriteLine("Cantidad: " + detallePedido.Cantidad);
            Console.WriteLine("UnidadId: " + detallePedido.UnidadId);

            Console.WriteLine("PrecioUnitario: " + detallePedido.PrecioUnitario);


            Console.WriteLine("sI SE AEOGO " + listaGlobalDetalles[0].PedidoId);

            // Devuelve un mensaje de confirmación en forma de objeto JSON
            return Ok(new { message = "Detalle del pedido recibido correctamente" });
        }

        [HttpPost]
        public async Task<IActionResult> CreatePost()
        {
            // Verificar si hay detalles en la lista global
            if (listaGlobalDetalles.Count == 0)
            {
                // No hay detalles para guardar
                TempData["ErrorMessage"] = "Por favor agregue los productos para guardar el pedido correctamente.";

                // Devolver un mensaje de éxito
                return RedirectToAction("Create", "DetallePedidos");
            }

            // Iterar sobre cada detalle en la lista global y guardarlos
            foreach (var detalle in listaGlobalDetalles)
            {
                var response = await _client.CreateDetallesPedidosAsync(detalle);
                if (!response.IsSuccessStatusCode)
                {
                    // Manejar errores si la creación del detalle de pedido falla
                    Console.WriteLine($"Error al guardar el detalle del pedido: {response.ReasonPhrase}");
                    return View("Error");
                }
            }


            var ultimoPedido = await _client.GetPedidoAsync();
            if (ultimoPedido != null && ultimoPedido.Any())
            {
                var ultimoPedidoGuardado = ultimoPedido.OrderByDescending(p => p.PedidoId).First();
                // Aquí tienes los datos del último pedido guardado
                // Puedes acceder a los campos del pedido según sea necesario, por ejemplo:
                var tipoDeServicio = ultimoPedidoGuardado.TipoServicio;
                Console.WriteLine(tipoDeServicio);

                if (tipoDeServicio=="Domicilio")
                {
                    // Limpiar la lista global después de guardar los detalles
                    TempData["Validacion"] = "Pedido Guardado Correctamente.";
                    listaGlobalDetalles.Clear();

                    // Devolver un mensaje de éxito
                    return RedirectToAction("Create", "Domicilios");

                }
                // Utiliza los datos del último pedido según tus requerimientos
            }
           



            // Limpiar la lista global después de guardar los detalles
            TempData["Validacion"] = "Pedido Guardado Correctamente.";
            listaGlobalDetalles.Clear();

            // Devolver un mensaje de éxito
            return RedirectToAction("Index", "Pedidos");
        }



        public async Task<IActionResult> Cancelar()
        {
            // Verificar si hay detalles en la lista global
            if (listaGlobalDetalles.Count > 0)
            {
                // Limpiar la lista global de detalles agregados
                listaGlobalDetalles.Clear();
            }

            // Obtener la lista de pedidos
            var pedidos = await _client.GetPedidoAsync();

            // Imprimir la lista de pedidos en la consola
            
            // Obtener el PedidoId más alto de la lista de pedidos
            var pedidosApi = pedidos.Max(p => p.PedidoId);

            Console.WriteLine(pedidosApi);
            var response= await _client.DeletePedidoAsync(pedidosApi);

      
            if (!response.IsSuccessStatusCode)
            {
                return NotFound("Error  en ela eliminacion");

            }

            // Resto del código para cancelar el último pedido...

            return RedirectToAction("Index", "Pedidos");
        }



        public IActionResult EliminarDetalle(int index)
        {

            Console.WriteLine(Index);
            if (index >= 0 && index < listaGlobalDetalles.Count)
            {


                listaGlobalDetalles.RemoveAt(index);


                return Ok(new { message = "Detalle eliminado correctamente" });
            }
            else
            {
                return NotFound("No se encontró el detalle para eliminar");
            }
        }


        public IActionResult ObtenerDetalles()
        {
            return Json(listaGlobalDetalles); // Devuelve la lista global de detalles como JSON
        }






    }
}
