using iTextSharp.text.pdf;
using iTextSharp.text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using VistaNewProject.Models;
using VistaNewProject.Services;
using X.PagedList;
using QuestPDF.Infrastructure;
using QuestPDF.Helpers;
using System.Linq;

namespace VistaNewProject.Controllers
{
    public class PedidosController : Controller
    {
        private readonly IApiClient _client;


        public PedidosController(IApiClient client)
        {
            _client = client;
        }

        public async Task<ActionResult> Index(int? page, string order)
        {
            int pageSize = 5;
            int pageNumber = page ?? 1;

            var pedidos = await _client.GetPedidoAsync();
            var pedidosFiltrados = pedidos.Where(p => p.EstadoPedido == "Realizado" || p.EstadoPedido == "Pendiente");

            // Orden por más reciente primero
            pedidosFiltrados = pedidosFiltrados.OrderByDescending(p => p.FechaPedido);

            // Aplicar orden personalizado si se selecciona desde el filtro
            if (!string.IsNullOrEmpty(order))
            {
                switch (order)
                {
                    case "alfabetico":
                        pedidosFiltrados = pedidosFiltrados.OrderBy(p => p.clientes.NombreEntidad);
                        break;
                    case "name_desc":
                        pedidosFiltrados = pedidosFiltrados.OrderByDescending(p => p.EstadoPedido);
                        break;
                    case "first":
                        pedidosFiltrados = pedidosFiltrados.OrderBy(p => p.FechaPedido);
                        break;
                    case "reverse":
                        pedidosFiltrados = pedidosFiltrados.OrderByDescending(p => p.TipoServicio);
                        break;
                    default:
                        break;
                }
            }

            // Paginación
            var pagePedido = await pedidosFiltrados.ToPagedListAsync(pageNumber, pageSize);
            if (!pagePedido.Any() && pagePedido.PageNumber > 1)
            {
                pagePedido = await pedidosFiltrados.ToPagedListAsync(pagePedido.PageCount, pageSize);
            }

            int contador = (pageNumber - 1) * pageSize + 1; // Calcular el valor inicial del contador

            ViewBag.Contador = contador;
            var clientes = await _client.GetClientesAsync();
            ViewBag.Clientes = clientes;

            ViewData["Pedidos"] = pedidos;

            return View(pagePedido);
        }


        public async Task<IActionResult> GetPedidosRealizado()
        {
            try
            {
                var pedidos = await _client.GetPedidoAsync();

                // Filtrar los pedidos con estado "Realizado"
                var pedidosRealizados = pedidos.Where(p => p.EstadoPedido == "Realizado").ToList();

                return Json(pedidosRealizados);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = $"Error al obtener los pedidos realizados: {ex.Message}" });
            }
        }


        public async Task<ActionResult> PedidosCancelados(int? page)
        {
            int pageSize = 5; // Cambiado a 5 para que la paginación se haga cada 5 registros
            int pageNumber = page ?? 1; // Número de página actual (si no se especifica, es 1)

            var pedidos = await _client.GetPedidoAsync();
            var pedidosFiltrados = pedidos.Where(p => p.EstadoPedido == "Cancelado" || p.EstadoPedido == "Anulado");

            if (pedidosFiltrados == null)
            {
                return View("Error");
            }

            var pagesPedidos = await pedidosFiltrados.ToPagedListAsync(pageNumber, pageSize);

            if (!pagesPedidos.Any() && pagesPedidos.PageNumber > 1)
            {
                pagesPedidos = await pedidosFiltrados.ToPagedListAsync(pagesPedidos.PageCount, pageSize);
            }

            var clientes = await _client.GetClientesAsync();


            ViewBag.Clientes = clientes;


            return View(pagesPedidos);
        }



    


        [HttpGet]
        public async Task<IActionResult> Create()
        {
            var clientes = await _client.GetClientesAsync();

            if (clientes == null)
            {
                return View("Error");
            }


            ViewBag.Clientes = clientes;
            return View();
        }



        [HttpPost]
        public async Task<IActionResult> Create(int ClienteId, string TipoServicio, DateTime FechaPedido, string EstadoPedido)
        {
            Console.WriteLine(EstadoPedido);
            Console.WriteLine(ClienteId);
            Console.WriteLine(FechaPedido);
            Console.WriteLine(TipoServicio);

            var pedidosnuevos = new Pedido
            {
                ClienteId = ClienteId,
                TipoServicio = TipoServicio,
                FechaPedido = FechaPedido,
                ValorTotalPedido = 0,
                EstadoPedido = EstadoPedido,


            };



            var tiposervicio = TipoServicio;

            if (TipoServicio == "Domicilio")
            {
                var usuarios = await _client.GetUsuarioAsync();
                var usuariosDomi = usuarios.Where(u => u.RolId == 3);

                if (usuariosDomi == null || !usuariosDomi.Any())
                {
                    TempData["Mensajeentrada"] = "No tines Domiciliarios Registados Por Favor Registre Uno.";

                    return RedirectToAction("Index","Pedidos");
                }
            }


            var response = await _client.CreatePedidoAsync(pedidosnuevos);
            if (response.IsSuccessStatusCode)
            {


                var pedidoIdAgregado = await response.Content.ReadAsStringAsync();
                Console.WriteLine(pedidoIdAgregado);

                // Redirigir al usuario a la vista "Create" del controlador "DetallesPedido" con el último PedidoId agregado
                return RedirectToAction("Create", "DetallePedidos", new { pedidoId = pedidoIdAgregado });
            }
            else
            {
                ModelState.AddModelError(string.Empty, "error");
            }



            return View();
        }


        public async Task<IActionResult> DescontardeInventario(int id, string tipo)
        {
            Console.WriteLine(id);
            Console.WriteLine(tipo);
            try
            {
                if (tipo == "Pedido")
                {
                    var pedidostraidos = await _client.FindPedidosAsync(id);
                    var domicilios = await _client.GetDomicilioAsync();
                    var domicilioDetalle = domicilios.FirstOrDefault(d => d.PedidoId == id);

                    if (pedidostraidos != null && pedidostraidos.EstadoPedido == "Realizado") 
                    {
                        var detalles = await _client.GetDetallepedidoAsync();
                        var detallesPedido = detalles.Where(d => d.PedidoId == id).ToList();
                        if (detallesPedido != null)
                        {
                            foreach (var detallePedido in detallesPedido)
                            {
                                var productoId = detallePedido.ProductoId.Value;
                                var producto = await _client.FindProductoAsync(productoId);

                                var Id = productoId;
                                var cantidad = detallePedido.Cantidad;
                                var UniddadId = detallePedido.UnidadId;


                                


                                if (producto != null)
                                {
                                 
                                    if(UniddadId==1 )
                                    {
                                        var updateProducto = await _client.SustraerCantidadReservadaAsync(Id, cantidad);
                                        if (updateProducto.IsSuccessStatusCode)
                                        {
                                            Console.WriteLine("Producto actualizado correctamente");
                                        }

                                    }
                                    if (UniddadId == 2)
                                    {
                                        var updateProducto = await _client.SustraerCantidadPorUnidadReservadaAsync(Id, cantidad);
                                        if (updateProducto.IsSuccessStatusCode)
                                        {
                                            Console.WriteLine("Producto actualizado correctamente");
                                        }

                                    }
                                   
                                }

                                var loteId = detallePedido.LoteId;
                                var lote = await _client.FindLoteAsync(loteId.Value);

                                if (UniddadId == 1)
                                {


                                    if (lote != null && lote.ProductoId == productoId && lote.Cantidad > 0 && lote.EstadoLote != 0)
                                    {
                                        int cantidadRestante = detallePedido.Cantidad.Value;

                                        // Descontar la cantidad del lote específico
                                        int cantidadDescontar = Math.Min(cantidadRestante, lote.Cantidad.Value);
                                        cantidadRestante -= cantidadDescontar;

                                        // Actualizar el lote en la base de datos
                                        var updateLoteResponse = await _client.SustraerCantidadALoteAsync(lote.LoteId, cantidadDescontar);

                                        if (!updateLoteResponse.IsSuccessStatusCode)
                                        {
                                            TempData["ErrorMessage"] = $"Error al actualizar el lote: {updateLoteResponse.ReasonPhrase}";
                                            return RedirectToAction("Index", "Pedidos");
                                        }
                                    }
                                }

                                if (UniddadId == 2)
                                {


                                    if (lote != null && lote.ProductoId == productoId && lote.Cantidad > 0 && lote.EstadoLote != 0)
                                    {
                                        int cantidadRestante = detallePedido.Cantidad.Value;

                                        // Descontar la cantidad del lote específico
                                        int cantidadDescontar = Math.Min(cantidadRestante, lote.Cantidad.Value);
                                        cantidadRestante -= cantidadDescontar;

                                        // Actualizar el lote en la base de datos
                                        var updateLoteResponse = await _client.SustraerCantidadPorUnidadALoteAsync(lote.LoteId, cantidadDescontar);

                                        if (!updateLoteResponse.IsSuccessStatusCode)
                                        {
                                            TempData["ErrorMessage"] = $"Error al actualizar el lote: {updateLoteResponse.ReasonPhrase}";
                                            return RedirectToAction("Index", "Pedidos");
                                        }
                                    }
                                }

                                // Obtener los lotes disponibles para el producto actual


                            }
                           
                        }


                    }


                    else if (pedidostraidos != null && pedidostraidos.EstadoPedido == "Anulado")
                    {
                        var detalles = await _client.GetDetallepedidoAsync();
                        var detallesPedido = detalles.Where(d => d.PedidoId == id).ToList();

                        if (detallesPedido != null)
                        {
                            foreach (var detallePedido in detallesPedido)
                            {
                                var productoId = detallePedido.ProductoId.Value;
                                var producto = await _client.FindProductoAsync(productoId);
                                var unidadId = detallePedido.UnidadId;

                                var Id = productoId;
                                var cantidad = detallePedido.Cantidad;
                                if (producto != null)
                                {

                                    if (unidadId == 1)
                                    {
                                        var updateProducto = await _client.QuitarCantidadReservada(Id, cantidad);
                                        if (updateProducto.IsSuccessStatusCode)
                                        {
                                            Console.WriteLine("Producto actualizado correctamente");
                                        }
                                    }
                                    if(unidadId == 2)
                                    {
                                        var updateProductounidad = await _client.QuitarCantidadReservadaUnidad(Id, cantidad);
                                        if (updateProductounidad.IsSuccessStatusCode)
                                        {
                                            Console.WriteLine("Producto actualizado correctamente");
                                        }
                                    }
                                   
                                   
                                }

                            }

                        }

                    }
                    else if (pedidostraidos != null && pedidostraidos.EstadoPedido == "Cancelado")
                    {
                        var detalles = await _client.GetDetallepedidoAsync();
                        var detallesPedido = detalles.Where(d => d.PedidoId == id).ToList();

                        if (detallesPedido != null && detallesPedido.Any())
                        {
                            foreach (var detalleCancelado in detallesPedido)
                            {
                                var unidadId = detalleCancelado.UnidadId;
                                var cantidad = detalleCancelado.Cantidad;
                                var productoId = detalleCancelado.ProductoId;

                                if (unidadId == 1 && productoId.HasValue)
                                {
                                    // Llamar al método para cancelar pedidos en producto
                                    await _client.AddCantidadTotalAsync(productoId.Value, cantidad);
                                }
                                else if (unidadId == 2 && productoId.HasValue)
                                {
                                    // Llamar al método para cancelar pedidos en producto por unidad
                                    await _client.AddCantidadTotalPorUnidadAsync(productoId.Value, cantidad);
                                }


                                var loteId = detalleCancelado.LoteId;
                                var lote = await _client.FindLoteAsync(loteId.Value);
                                if (unidadId == 1)
                                {

                                    if (lote != null && lote.ProductoId == productoId && lote.Cantidad > 0 && lote.EstadoLote != 0)
                                    {
                                        int cantidadRestante = detalleCancelado.Cantidad.Value;

                                        // Descontar la cantidad del lote específico
                                        int cantidadDescontar = Math.Min(cantidadRestante, lote.Cantidad.Value);
                                        cantidadRestante += cantidadDescontar;

                                        // Actualizar el lote en la base de datos
                                        var updateLoteResponse = await _client.AddCantidadALoteAsync(lote.LoteId, cantidadDescontar);

                                        if (!updateLoteResponse.IsSuccessStatusCode)
                                        {
                                            TempData["ErrorMessage"] = $"Error al actualizar el lote: {updateLoteResponse.ReasonPhrase}";
                                            return RedirectToAction("Index", "Pedidos");
                                        }
                                    }
                                }

                                if (unidadId == 2)
                                {

                                    if (lote != null && lote.ProductoId == productoId && lote.Cantidad > 0 && lote.EstadoLote != 0)
                                    {
                                        int cantidadRestante = detalleCancelado.Cantidad.Value;

                                        // Descontar la cantidad del lote específico
                                        int cantidadDescontar = Math.Min(cantidadRestante, lote.Cantidad.Value);
                                        cantidadRestante += cantidadDescontar;

                                        // Actualizar el lote en la base de datos
                                        var updateLoteResponse = await _client.AddCantidadPorUnidadALoteAsync(lote.LoteId, cantidadDescontar);

                                        if (!updateLoteResponse.IsSuccessStatusCode)
                                        {
                                            TempData["ErrorMessage"] = $"Error al actualizar el lote: {updateLoteResponse.ReasonPhrase}";
                                            return RedirectToAction("Index", "Pedidos");
                                        }
                                    }
                                }
                            }
                        }
                    }

                }    // Retorna una respuesta exitosa si el proceso se realizó correctamente
                return Ok("Inventario descontado correctamente.");


            }
            catch (Exception ex)
            {
                // Error durante el proceso
                Console.WriteLine($"Error durante el proceso: {ex.Message}");
                return StatusCode(500, "Error interno del servidor.");
            }
        }



        public async Task<IActionResult> Details(int? id, int? page)
        {
            if (id == null)
            {
                return NotFound();
            }

            var usuario = await  _client.GetUsuarioAsync();
            var unidad=  await _client.GetUnidadAsync();

            var pedidosTask = _client.GetPedidoAsync();
            var detallesTask = _client.GetDetallepedidoAsync();

            var usuarios = usuario.Where(u => u.RolId == 3 && u.EstadoUsuario != 0).ToList(); // Filtrar usuarios por RolId y EstadoUsuario

            var domicilios = _client.GetDomicilioAsync();


            await Task.WhenAll(pedidosTask, detallesTask, domicilios);

            var pedido = pedidosTask.Result.FirstOrDefault(u => u.PedidoId == id);
            if (pedido == null)
            {
                return NotFound();
            }

            ViewBag.Pedidos = pedido;
            ViewBag.Unidad = unidad;

            ViewBag.Usuarios = usuarios;

            // Obtener el nombre del cliente asociado al pedido
            var cliente = await _client.FindClienteAsync(pedido.ClienteId.Value);
            ViewBag.NombreCliente = cliente != null ? cliente.NombreEntidad : "Cliente no encontrado"; // Asignar el nombre del cliente a la ViewBag

            var detallepedidos = detallesTask.Result.Where(p => p.PedidoId == id).ToList();
            var domicilio = domicilios.Result.FirstOrDefault(d => d.PedidoId == id);
            ViewBag.Domicilio = domicilio;
            if (domicilio != null && domicilio.UsuarioId != null)
            {
                var domiciliario = await _client.FindUsuarioAsync(domicilio.UsuarioId.Value);
                ViewBag.NombreDomiciliario = domiciliario != null ? domiciliario.Nombre : "Domiciliario no encontrado";
            }
            else
            {
                ViewBag.NombreDomiciliario = "Domiciliario no encontrado";
            }

            // Recuperar los productos y unidades correspondientes de manera asíncrona
            var productosTasks = detallepedidos.Select(async detalle =>
            {
                detalle.Productos = await _client.FindProductoAsync(detalle.ProductoId.Value);
                detalle.Unidades = await _client.FindUnidadAsync(detalle.UnidadId.Value);
            });

            await Task.WhenAll(productosTasks);

            int pageSize = 4; // Tamaño de página deseado
            int pageNumber = page ?? 1;

            var pagedProductos = detallepedidos.ToPagedList(pageNumber, pageSize);

            return View(pagedProductos);
        }




        public async Task<IActionResult> UpdateEstadoPedido(int id,string estado)
        {

            
            var updateestado=await _client.CambiarEstadoPedidoAsync(id, estado);

            return Ok();

        }


        public async Task<IActionResult> GenerarPDF(int pedidoId)
        {
            try
            {
                // Obtener detalles del pedido filtrados por pedidoId
                var detallepedidos = await _client.GetDetallepedidoAsync();
                var filteredDetallepedidos = detallepedidos.Where(dp => dp.PedidoId == pedidoId).ToList();

                // Obtener información general del pedido
                var pedido = await _client.FindPedidosAsync(pedidoId);
                var cliente = await _client.FindClienteAsync(pedido.ClienteId.Value);


                using (MemoryStream memoryStream = new MemoryStream())
                {
                    Document document = new Document();
                    PdfWriter writer = PdfWriter.GetInstance(document, memoryStream);
                    document.Open();

                    // Título del documento
                    Paragraph title = new Paragraph("Reporte De Ventas", FontFactory.GetFont(FontFactory.HELVETICA_BOLD, 18, BaseColor.BLACK));
                    title.Alignment = Element.ALIGN_CENTER;
                    document.Add(title);

                    // Espacio entre título y tablas
                    document.Add(new Paragraph("\n"));

                    // Tabla para la información general del pedido
                    PdfPTable pedidoTable = new PdfPTable(2)
                    {
                        WidthPercentage = 100,
                        SpacingBefore = 10f,
                        SpacingAfter = 10f
                    };
                    pedidoTable.SetWidths(new float[] { 30f, 70f });

                    // Encabezado de la tabla de pedido
                    AddCellToHeader(pedidoTable, "Campo");
                    AddCellToHeader(pedidoTable, "Valor");

                    // Agregar filas con datos del pedido
                    AddRow(pedidoTable, "PedidoId", pedido.PedidoId.ToString());
                    AddRow(pedidoTable, "Cliente", cliente.NombreEntidad);
                    AddRow(pedidoTable, "Tipo de Servicio", pedido.TipoServicio ?? "No disponible");
                    AddRow(pedidoTable, "Fecha del Pedido", pedido.FechaPedido.HasValue ? pedido.FechaPedido.Value.ToShortDateString() : "No disponible");
                    AddRow(pedidoTable, "Valor Total", pedido.ValorTotalPedido?.ToString("C") ?? "No disponible");
                    AddRow(pedidoTable, "Estado", pedido.EstadoPedido ?? "No disponible");



                    // Agregar tabla de pedido al documento
                    document.Add(pedidoTable);

                    // Espacio entre tablas
                    document.Add(new Paragraph("\n"));

                    // Tabla para los detalles del pedido
                    PdfPTable detalleTable = new PdfPTable(5)
                    {
                        WidthPercentage = 100,
                        SpacingBefore = 10f,
                        SpacingAfter = 10f
                    };
                    detalleTable.SetWidths(new float[] { 10f, 30f, 10f, 10f, 10f });

                    // Encabezados de la tabla de detalles
                    AddCellToHeader(detalleTable, "Pedido");
                    AddCellToHeader(detalleTable, "Nombre Producto");
                    AddCellToHeader(detalleTable, "Cantidad");
                    AddCellToHeader(detalleTable, "Precio");
                    AddCellToHeader(detalleTable, "Unidad");

                    // Agregar datos de los detalles del pedido a la tabla
                    foreach (var detalle in filteredDetallepedidos)
                    {
                        // Obtener producto y unidad asociada para cada detalle de pedido
                        var producto = await _client.FindProductoAsync(detalle.ProductoId.Value);
                        var unidad = await _client.FindUnidadAsync(detalle.UnidadId.Value);

                        AddRow(detalleTable, detalle.PedidoId.ToString(),
                            producto?.NombreCompletoProducto ?? "No disponible", detalle.Cantidad.ToString(),
                            detalle.PrecioUnitario?.ToString("C") ?? "No disponible", unidad?.NombreCompletoUnidad ?? "No disponible");
                    }

                    // Agregar tabla de detalles al documento
                    document.Add(detalleTable);

                    // Cerrar el documento
                    document.Close();

                    // Devolver el archivo PDF como FileResult
                    return File(memoryStream.ToArray(), "application/pdf", "ReporteProductos.pdf");
                }
            }
            catch (HttpRequestException ex)
            {
                // Manejar el error y mostrar un mensaje adecuado
                return BadRequest($"Error al obtener datos: {ex.Message}");
            }
        }

        private void AddCellToHeader(PdfPTable table, string cellText)
        {
            PdfPCell cell = new PdfPCell(new Phrase(cellText, FontFactory.GetFont(FontFactory.HELVETICA_BOLD, 12, BaseColor.WHITE)))
            {
                BackgroundColor = BaseColor.GRAY,
                HorizontalAlignment = Element.ALIGN_CENTER,
                VerticalAlignment = Element.ALIGN_MIDDLE
            };
            table.AddCell(cell);
        }

        private void AddRow(PdfPTable table, params string[] cellTexts)
        {
            foreach (var text in cellTexts)
            {
                table.AddCell(new Phrase(text, FontFactory.GetFont(FontFactory.HELVETICA, 10, BaseColor.BLACK)));
            }
        }

        public async Task<IActionResult> GenerarPDFFecha(DateTime? fechaInicio, DateTime? fechaFin)
        {
            try
            {
                // Validar que las fechas no sean nulas
                if (!fechaInicio.HasValue || !fechaFin.HasValue)
                {
                    return BadRequest("Debe proporcionar fechas válidas.");
                }

                // Obtener pedidos dentro del rango de fechas
                var pedidos = await _client.GetPedidoAsync();
                var pedidosFiltrados = pedidos
                    .Where(p => p.FechaPedido.HasValue && p.FechaPedido.Value.Date >= fechaInicio.Value.Date && p.FechaPedido.Value.Date <= fechaFin.Value.Date)
                    .ToList();

                // Obtener detalles de pedidos asociados a los pedidos filtrados
                var pedidoIds = pedidosFiltrados.Select(p => p.PedidoId).ToList();
                var detallepedidos = await _client.GetDetallepedidoAsync();
                var filteredDetallepedidos = detallepedidos
                    .Where(dp => pedidoIds.Contains(dp.PedidoId.Value))
                    .ToList();

                // Crear el documento PDF
                using (MemoryStream memoryStream = new MemoryStream())
                {
                    Document document = new Document();
                    PdfWriter writer = PdfWriter.GetInstance(document, memoryStream);
                    document.Open();

                    // Título del documento
                    Paragraph title = new Paragraph("Reporte De Ventas", FontFactory.GetFont(FontFactory.HELVETICA_BOLD, 18, BaseColor.BLACK));
                    title.Alignment = Element.ALIGN_CENTER;
                    document.Add(title);

                    // Rango de fechas
                    Paragraph dateRange = new Paragraph($"Del {fechaInicio.Value.ToShortDateString()} al {fechaFin.Value.ToShortDateString()}", FontFactory.GetFont(FontFactory.HELVETICA, 12, BaseColor.BLACK));
                    dateRange.Alignment = Element.ALIGN_CENTER;
                    document.Add(dateRange);

                    // Espacio entre título y tablas
                    document.Add(new Paragraph("\n"));

                    // Tabla para la información general de los pedidos
                    PdfPTable pedidoTable = new PdfPTable(2)
                    {
                        WidthPercentage = 100,
                        SpacingBefore = 10f,
                        SpacingAfter = 10f
                    };
                    pedidoTable.SetWidths(new float[] { 30f, 70f });

                    // Encabezado de la tabla de pedido
                    AddCellToHeader(pedidoTable, "Campo");
                    AddCellToHeader(pedidoTable, "Valor");

                    // Agregar filas con datos del pedido
                    AddRow(pedidoTable, "Total Pedidos", pedidosFiltrados.Count().ToString());
                    AddRow(pedidoTable, "Fecha de inicio", fechaInicio.Value.ToShortDateString());
                    AddRow(pedidoTable, "Fecha final", fechaFin.Value.ToShortDateString());

                    // Agregar tabla de pedido al documento
                    document.Add(pedidoTable);

                    // Espacio entre tablas
                    document.Add(new Paragraph("\n"));

                    // Tabla para los detalles de los pedidos
                    PdfPTable detalleTable = new PdfPTable(5)
                    {
                        WidthPercentage = 100,
                        SpacingBefore = 10f,
                        SpacingAfter = 10f
                    };
                    detalleTable.SetWidths(new float[] { 10f, 30f, 10f, 10f, 10f });

                    // Encabezados de la tabla de detalles
                    AddCellToHeader(detalleTable, "Pedido");
                    AddCellToHeader(detalleTable, "Nombre Producto");
                    AddCellToHeader(detalleTable, "Cantidad");
                    AddCellToHeader(detalleTable, "Precio");
                    AddCellToHeader(detalleTable, "Unidad");

                    // Agregar datos de los detalles del pedido a la tabla
                    foreach (var detalle in filteredDetallepedidos)
                    {
                        // Obtener producto y unidad asociada para cada detalle de pedido
                        var producto = await _client.FindProductoAsync(detalle.ProductoId.Value);
                        var unidad = await _client.FindUnidadAsync(detalle.UnidadId.Value);

                        AddRow(detalleTable, detalle.PedidoId.ToString(),
                            producto?.NombreCompletoProducto ?? "No disponible", detalle.Cantidad.ToString(),
                            detalle.PrecioUnitario?.ToString("C") ?? "No disponible", unidad?.NombreCompletoUnidad ?? "No disponible");
                    }

                    // Agregar tabla de detalles al documento
                    document.Add(detalleTable);

                    // Cerrar el documento
                    document.Close();

                    // Devolver el archivo PDF como FileResult
                    return File(memoryStream.ToArray(), "application/pdf", "ReportePedidos.pdf");
                }
            }
            catch (Exception ex)
            {
                // Manejar el error y mostrar un mensaje adecuado
                return BadRequest($"Error al generar el reporte: {ex.Message}");
            }
        }



    }
}

