using Microsoft.AspNetCore.Mvc;
using System.Net.Http;
using VistaNewProject.Models;

namespace VistaNewProject.Services
{
    public class ApiClient : IApiClient
    {
        private readonly HttpClient _httpClient;
        public ApiClient(HttpClient httpClient)
        {
            _httpClient = httpClient;
            _httpClient.BaseAddress = new Uri("https://localhost:7013/api/");
        }

        public async Task<IEnumerable<Cliente>> GetClientesAsync()
        {
            var response = await _httpClient.GetFromJsonAsync<IEnumerable<Cliente>>("Clientes/GetClientes");

            if (response == null)
            {
                // Manejar el caso en el que response sea nulo
                throw new Exception("No se encontró el cliente con el ID especificado.");
            }
            return response;
        }


        /// pedidos
        public async Task<IEnumerable<Pedido>> GetPedidoAsync()
        {
            var response = await _httpClient.GetFromJsonAsync<IEnumerable<Pedido>>("Pedidos/GetAllPedido");

            if (response == null)
            {
                // Manejar el caso en el que response sea nulo
                throw new Exception("No se encontró la unidad con el ID especificado.");
            }
            return response;
        }


        /// PRESENTACION 
        public async Task<IEnumerable<Presentacion>> GetPresentacionAsync()
        {
            var response = await _httpClient.GetFromJsonAsync<IEnumerable<Presentacion>>("Presentaciones/GetPresentaciones");

            if (response == null)
            {
                // Manejar el caso en el que response sea nulo
                throw new Exception("No se encontró la presentacion con el ID especificado.");
            }
            return response;
        }



        /// COMPRA

        public async Task<IEnumerable<Compra>> GetCompraAsync()
        {
            var response = await _httpClient.GetFromJsonAsync<IEnumerable<Compra>>("Compras/GetCompras");

            if (response == null)
            {
                // Manejar el caso en el que response sea nulo
                throw new Exception("No se encontró la compra con el ID especificado.");
            }
            return response;
        }




        public async Task<IEnumerable<Detallecompra>> GetDetallecompraAsync()
        {
            var response = await _httpClient.GetFromJsonAsync<IEnumerable<Detallecompra>>("DetalleCompras/GetDetalleCompras");

            if (response == null)
            {
                // Manejar el caso en el que response sea nulo
                throw new Exception("No se encontró nada error faltal.");
            }
            return response;
        }


        public async Task<IEnumerable<Marca>> GetMarcaAsync()
        {
            var response = await _httpClient.GetFromJsonAsync<IEnumerable<Marca>>("Marcas/GetMarcas");

            if (response == null)
            {
                // Manejar el caso en el que response sea nulo
                throw new Exception("No se encontró la marca con el ID especificado.");
            }
            return response;
        }
        public async Task<HttpResponseMessage> CreateMarcaAsync( Marca marca)
        {
            var response = await _httpClient.PostAsJsonAsync("Marcas/InsertarMarca", marca);

            if (response == null)
            {
                // Manejar el caso en el que response sea nulo
                throw new Exception("No se encontró la marca con el ID especificado.");
            }
            return response;
        }

        /// CATEGORIA
        /// 
        public async Task<IEnumerable<Categoria>> GetCategoriaAsync()
        {
            var response = await _httpClient.GetFromJsonAsync<IEnumerable<Categoria>>("Categorias/GetCategorias");

            if (response == null)
            {
                // Manejar el caso en el que response sea nulo
                throw new Exception("No se encontró la categoria con el ID especificado.");
            }
            return response;
        }

        public async Task<IEnumerable<Usuario>> GetUsuarioAsync()
        {
            var response = await _httpClient.GetFromJsonAsync<IEnumerable<Usuario>>("Usuarios/GetUsuarios");

            if (response == null)
            {
                // Manejar el caso en el que response sea nulo
                throw new Exception("No se encontró el usuario con el ID especificado.");
            }
            return response;
        }

        public async Task<IEnumerable<Unidad>> GetUnidadAsync()
        {
            var response = await _httpClient.GetFromJsonAsync<IEnumerable<Unidad>>("unidades/GetUnidades");

            if (response == null)
            {
                // Manejar el caso en el que response sea nulo
                throw new Exception("No se encontró ninguna tabla nada de nada.");
            }
            return response;
        }

        public async Task<IEnumerable<Movimiento>> GetMovimientoAsync()
        {
            var response = await _httpClient.GetFromJsonAsync<IEnumerable<Movimiento>>("Movimientos/GetMoviemientos");

            if (response == null)
            {
                // Manejar el caso en el que response sea nulo
                throw new Exception("No se encontró el movimiento con el ID especificado.");
            }
            return response;
        }

        public async Task<IEnumerable<Producto>> GetProductoAsync()
        {
            var response = await _httpClient.GetFromJsonAsync<IEnumerable<Producto>>("Productos/GetProductos");

            if (response == null)
            {
                // Manejar el caso en el que response sea nulo
                throw new Exception("No se encontró la marca con el ID especificado.");
            }
            return response;
        }

        public async Task<IEnumerable<Proveedor>> GetProveedorAsync()
        {
            var response = await _httpClient.GetFromJsonAsync<IEnumerable<Proveedor>>("Proveedores/GetProveedores");

            if (response == null)
            {
                // Manejar el caso en el que response sea nulo
                throw new Exception("No se encontró la compra con el ID especificado.");
            }
            return response;
        }

        
        public async Task<IEnumerable<Lote>> GetLoteAsync()
        {
            var response = await _httpClient.GetFromJsonAsync<IEnumerable<Lote>>("Lotes/GetLotes");

            if (response == null)
            {
                // Manejar el caso en el que response sea nulo
                throw new Exception("No se encontró nada.");
            }
            return response;
        }

        public async Task<IEnumerable<Domicilio>> GetDomicilioAsync()
        {
            var response = await _httpClient.GetFromJsonAsync<IEnumerable<Domicilio>>("Domicilios/GetDomicilios");

            if (response == null)
            {
                // Manejar el caso en el que response sea nulo
                throw new Exception("No se encontró domicilios con el ID especificado.");
            }
            return response;
        }


        public async Task<IEnumerable<Detallepedido>> GetDetallepedidoAsync()
        {
            var response = await _httpClient.GetFromJsonAsync<IEnumerable<Detallepedido>>("DetallePedidos/GetDetallePedidos");

            if (response == null)
            {
                // Manejar el caso en el que response sea nulo
                throw new Exception("No se encontró domicilios con el ID especificado.");
            }
            return response;
        }

        public Task<IEnumerable<Permiso>> GetPermisoAsync()
        {
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<Rol>> GetRolAsync()
        {
            var response = await _httpClient.GetFromJsonAsync<IEnumerable<Rol>>("Roles/GetRoles");

            if (response == null)
            {
                // Manejar el caso en el que response sea nulo
                throw new Exception("No se encontró la compra con el ID especificado.");
            }
            return response;
        }


        public Task<IEnumerable<Rolxpermiso>> GetRolxpermisoAsync()
        {
            throw new NotImplementedException();
        }
    }
}


