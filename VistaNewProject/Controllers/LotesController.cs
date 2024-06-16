using Microsoft.AspNetCore.Mvc;
using VistaNewProject.Models;
using VistaNewProject.Services;
using X.PagedList;


namespace VistaNewProject.Controllers
{
    public class LotesController : Controller
    {
        private readonly IApiClient _client;


        public LotesController(IApiClient client)
        {
            _client = client;
        }

        public async Task<IActionResult> Index(int? page)
        {
            int pageSize = 5; // Cambiado a 5 para que la paginación se haga cada 5 registros
            int pageNumber = page ?? 1; // Número de página actual (si no se especifica, es 1)

            var lotes = await _client.GetLoteAsync(); // Obtener todas las marcas

            if (lotes == null)
            {
                return NotFound("error");
            }

            var pageLote = await lotes.ToPagedListAsync(pageNumber, pageSize);
            if (!pageLote.Any() && pageLote.PageNumber > 1)
            {
                pageLote = await lotes.ToPagedListAsync(pageLote.PageCount, pageSize);
            }

            int contador = (pageNumber - 1) * pageSize + 1; // Calcular el valor inicial del contador

            ViewBag.Contador = contador;

            // Código del método Index que querías integrar
            string mensaje = HttpContext.Session.GetString("Message");
            TempData["Message"] = mensaje;

            try
            {
                ViewData["Lotes"] = lotes;
                return View(pageLote);
            }
            catch (HttpRequestException ex) when ((int)ex.StatusCode == 404)
            {
                HttpContext.Session.SetString("Message", "No se encontró la página solicitada");
                return RedirectToAction("Index", "Home");
            }
            catch
            {
                HttpContext.Session.SetString("Message", "Error en el aplicativo");
                return RedirectToAction("LogOut", "Accesos");
            }
        }


        public async Task<IActionResult> findDlotes( int detalleCompraId)
        {
            var lotes = await _client.GetLoteAsync();
            var lotesfiltro=lotes.Where(l=>l.DetalleCompraId== detalleCompraId).ToList();  

            return Json(lotesfiltro);

        }


        [HttpPost]
        [Route("Lotes/Update")]
        public async Task<IActionResult> Update([FromBody] Lote loteupdate, [FromQuery] string tipomovimineto)
        {
            if (string.IsNullOrEmpty(tipomovimineto))
            {
                return Json(new { success = false, message = "Tipo de movimiento no proporcionado." });
            }

            Console.WriteLine(loteupdate);


            if (tipomovimineto == "Entrada")
            {



                var lotesantes = await _client.FindLoteAsync(loteupdate.LoteId);

                var detalleid = loteupdate.DetalleCompraId;
                var detalleComprasoriginal = await _client.FindDetallesComprasAsync(detalleid.Value);

                lotesantes.Cantidad += loteupdate.Cantidad;
                detalleComprasoriginal.Cantidad += loteupdate.Cantidad;

                var responselotes = await _client.UpdateLoteAsync(lotesantes);
                var responseDetalleCompra = await _client.UpdateDetallesComprasAsync(detalleComprasoriginal);


                var compraId = detalleComprasoriginal.CompraId;

                var compras = await _client.FinComprasAsync(compraId.Value);

                compras.ValorTotalCompra = lotesantes.Cantidad * lotesantes.PrecioPorPresentacion;
                var detallecompras = await _client.GetCompraAsync(); 


              
            }
            else if (tipomovimineto == "Salida")
            {

                var lotesantes = await _client.FindLoteAsync(loteupdate.LoteId);
                var detalleid = loteupdate.DetalleCompraId;
                var detalleComprasoriginal = await _client.FindDetallesComprasAsync(detalleid.Value);
                lotesantes.Cantidad -= loteupdate.Cantidad;
                detalleComprasoriginal.Cantidad -= loteupdate.Cantidad;

                var responselotes = await _client.UpdateLoteAsync(lotesantes);
                var responseDetalleCompra = await _client.UpdateDetallesComprasAsync(detalleComprasoriginal);

              



              
            }

            return Ok();
        }


    }
}
