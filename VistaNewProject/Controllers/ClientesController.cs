﻿using Microsoft.AspNetCore.Mvc;
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
      
    }
}
