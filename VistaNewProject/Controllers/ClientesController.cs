using Microsoft.AspNetCore.Mvc;
using VistaNewProject.Models;
using VistaNewProject.Services;


namespace VistaNewProject.Controllers
{
    public class ClientesController : Controller
    {

 
        private readonly IApiClient _client;


        public ClientesController(IApiClient client)
        {
            _client = client;
        }


        public async Task<ActionResult> Index()
        {
            var cliente = await _client.GetClientesAsync();

            if (cliente == null)
            {
                return View("Error");
            }

            return View(cliente);
        }
        public ActionResult Create()
        {
            return View();
        }
        [HttpPost]
        public async Task<ActionResult> Create(Cliente cliente)
        {
            Console.WriteLine(cliente.TipoCliente);
            if (ModelState.IsValid)
            {
                var response = await _client.CreateClienteAsync(cliente);
                Console.WriteLine($"{response}");
                if (response.IsSuccessStatusCode)
                {
                    return RedirectToAction("Index");
                }
                else
                {
                    return View("Error");
                }
            }
            return View();
        }

        public async Task<ActionResult> Edit(int id)
        {
            var clientes = await _client.FindClienteAsync(id);
            if (clientes == null)
            {
                return NotFound();
            }
            return View(clientes);
        }
        [HttpPost, HttpPut]

        public async Task<ActionResult> Edit(Cliente cliente)
        {
            if (ModelState.IsValid)
            {
                var clientes = await _client.UpdateClienteAsync(cliente);
                if (clientes.IsSuccessStatusCode)
                {
                    return RedirectToAction("Index");
                }
                return View("error");
            }

            return View();

        }
        public async Task<ActionResult> Delete(int id)
        {
            var clientes = await _client.DeleteClienteAsync(id);
            if (clientes.IsSuccessStatusCode)
            {
                return RedirectToAction("Index");
            }
            else
            {
                return NotFound();
            }

        }
    }
}
