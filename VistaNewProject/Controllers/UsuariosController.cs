using Microsoft.AspNetCore.Mvc;
using VistaNewProject.Models;
using VistaNewProject.Services;

namespace VistaNewProject.Controllers
{
    public class UsuariosController : Controller
    {
        private readonly IApiClient _client;


        public UsuariosController(IApiClient client)
        {
            _client = client;
        }


        public async Task<ActionResult> Index()
        {
            var cliente = await _client.GetUsuarioAsync();

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
        public async Task<ActionResult> Create(Usuario usuario)
        {
            Console.WriteLine(usuario.Nombre);
            if (ModelState.IsValid)
            {
                var response = await _client.CreateUsuarioAsync(usuario);
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
            var usuarios = await _client.FindUsuarioAsync(id);
            if (usuarios == null)
            {
                return NotFound();
            }
            return View(usuarios);
        }
        [HttpPost, HttpPut]

        public async Task<ActionResult> Edit(Usuario usuario)
        {
            if (ModelState.IsValid)
            {
                var usuarios = await _client.UpdateUsuarioAsync(usuario);
                if (usuarios.IsSuccessStatusCode)
                {
                    return RedirectToAction("Index");
                }
                return View("error");
            }

            return View();

        }
        public async Task<ActionResult> Delete(int id)
        {
            var usuarios = await _client.DeleteUsuarioAsync(id);
            if (usuarios.IsSuccessStatusCode)
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

