using Microsoft.AspNetCore.Mvc;
using System.Net;
using System.Net.Http;
using System.Net.Http.Json;
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


        //cliente
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



        public async Task<HttpResponseMessage> CreateClienteAsync(Cliente cliente)
        {
            var response = await _httpClient.PostAsJsonAsync("Clientes/InsertarCliente", cliente);
            return response;
        }

        public async Task<Cliente> FindClienteAsync(int id)
        {
            var response = await _httpClient.GetFromJsonAsync<Cliente>($"?id={id}");
            return response;
        }





        public async Task<HttpResponseMessage> UpdateClienteAsync(Cliente cliente)
        {
            var response = await _httpClient.PutAsJsonAsync($"Clientes/UpdateClientes/", cliente);
            return response;
        }

        public async Task<HttpResponseMessage> DeleteClienteAsync(int id)
        {
            var response = await _httpClient.DeleteAsync($"Clientes/DeleteUser/{id}");
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



        public async Task<HttpResponseMessage> CreatePresentacionAsync(Presentacion presentacion)
        {
            var response = await _httpClient.PostAsJsonAsync("Presentaciones/InsertarPresentacion", presentacion);
            return response;
        }

        public async Task<Presentacion> FindPresentacionAsync(int id)
        {
            var response = await _httpClient.GetFromJsonAsync<Presentacion>($"Presentaciones/GetPresentacionById?id={id}");
            return response;
        }





        public async Task<HttpResponseMessage> UpdatePresentacionAsync(Presentacion presentacion)
        {
            var response = await _httpClient.PutAsJsonAsync($"Presentaciones/UpdatePresentaciones/", presentacion);
            return response;
        }

        public async Task<HttpResponseMessage> DeletePresentacionAsync(int id)
        {
            var response = await _httpClient.DeleteAsync($"Presentaciones/DeletePresentacion/{id}");
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


        //detallecompra

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



        //marca
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
        public async Task< Marca> FindMarcasAsync(int id)
        {
            var response = await _httpClient.GetFromJsonAsync<Marca>($"Marcas/GetMarcaById?id={id}");

            if (response == null)
            {
                // Manejar el caso en el que response sea nulo
                throw new Exception("No se encontró la marca con el ID especificado.");
            }
            return response;
        }

        public async Task<Marca> FindnombreMarcasAsync(string nombreMarca)
        {
            try
            {
                var response = await _httpClient.GetFromJsonAsync<Marca>($"Marcas/GetNombreMarcaById?nombreMarca={nombreMarca}");

                // Verificar si la respuesta es null, lo cual podría indicar un error en la solicitud
                if (response != null)
                {
                    return response;
                }
                else
                {
                    // Marca no encontrada u otro tipo de error
                    return null;
                }
            }
            catch (HttpRequestException)
            {
                // Error al hacer la solicitud HTTP
                return null;
            }
        }


        public async Task<HttpResponseMessage> UpdateMarcaAsync(Marca marca)
        {
            try
            {
                // Hacer la solicitud PUT al servidor para actualizar la marca
                var response = await _httpClient.PutAsJsonAsync("Marcas/UpdateMarca", marca);

                // Verificar si la solicitud fue exitosa (código de estado 200 OK)
                if (response.IsSuccessStatusCode)
                {
                    return response;
                }
                else if (response.StatusCode == HttpStatusCode.NotFound)
                {
                    // La marca no se encontró en el servidor
                    return response;
                }
                else if (response.StatusCode == HttpStatusCode.BadRequest)
                {
                    // Error debido a una solicitud incorrecta (por ejemplo, nombre de marca duplicado)
                    return response;
                }
                else
                {
                    // Otro tipo de error no manejado específicamente
                    // Puedes retornar un mensaje genérico o lanzar una excepción
                    return new HttpResponseMessage(HttpStatusCode.InternalServerError)
                    {
                        Content = new StringContent("Error al actualizar la marca")
                    };
                }
            }
            catch (HttpRequestException ex)
            {
                // Manejar errores de solicitud HTTP (por ejemplo, error de conexión)
                Console.WriteLine($"Error en la solicitud HTTP: {ex.Message}");
                return null; // Otra opción es lanzar una excepción para notificar el error
            }
        }




        public async Task<HttpResponseMessage> DeleteMarcaAsync(int id)
        {
            try
            {
                // Hacer la solicitud DELETE al servidor
                var response = await _httpClient.DeleteAsync($"Marcas/DeleteMarca/{id}");

                // Verificar si la solicitud fue exitosa (código de estado 200 OK)
                if (response.IsSuccessStatusCode)
                {
                    // Marca eliminada correctamente
                    return response;
                }
                else if (response.StatusCode == HttpStatusCode.NotFound)
                {
                    // La marca no se encontró en el servidor
                    // Puedes manejar este caso específico según tus necesidades
                    return response;
                }
                else if (response.StatusCode == HttpStatusCode.BadRequest)
                {
                    // La solicitud fue incorrecta debido a una restricción (por ejemplo, marca asociada a un producto)
                    // Puedes manejar este caso específico según tus necesidades
                    return response;
                }
                else
                {
                    // Otro tipo de error no manejado específicamente
                    // Puedes registrar el error o manejarlo según tus necesidades
                    return new HttpResponseMessage(HttpStatusCode.InternalServerError) { Content = new StringContent("Error al eliminar la marca") };
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error en la solicitud HTTP: {ex.Message}");
                return null;
            }
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



        public async Task<HttpResponseMessage> CreateCategoriaAsync(Categoria categoria)
        {
            var response = await _httpClient.PostAsJsonAsync("Categorias/InsertarCategoria", categoria);

            if (response == null)
            {
                // Manejar el caso en el que response sea nulo
                throw new Exception("No se encontró la categoria con el ID especificado.");
            }
            return response;
        }

        public async Task<Categoria> FindCategoriaAsync(int id)
        {
            var response = await _httpClient.GetFromJsonAsync<Categoria>($"Categorias/GetCategoriaById?id={id}");

            if (response == null)
            {
                // Manejar el caso en el que response sea nulo
                throw new Exception("No se encontró la categoria con el ID especificado.");
            }
            return response;
        }



        public async Task<Categoria> FindnombreCategoriaAsync(string nombreCategoria)
        {
            try
            {
                var response = await _httpClient.GetFromJsonAsync<Categoria>($"Categorias/GetNombreCategoriaById?nombreCategoria={nombreCategoria}");

                // Verificar si la respuesta es null, lo cual podría indicar un error en la solicitud
                if (response != null)
                {
                    return response;
                }
                else
                {
                    // Marca no encontrada u otro tipo de error
                    return null;
                }
            }
            catch (HttpRequestException)
            {
                // Error al hacer la solicitud HTTP
                return null;
            }
        }

        public async Task<HttpResponseMessage> UpdateCategoriaAsync(Categoria categoria)
        {
            var response = await _httpClient.PutAsJsonAsync($"Categorias/UpdateCategorias/", categoria);
            return response;
        }

        public async Task<HttpResponseMessage> DeleteCategoriaAsync(int id)
        {
            var response = await _httpClient.DeleteAsync($"Categorias/DeleteCategoria/{id}");
            return response;
        }




        //usuario
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


        public async Task<HttpResponseMessage> CreateUsuarioAsync(Usuario usuario)
        {
            var response = await _httpClient.PostAsJsonAsync("Usuarios/InsertUsuario", usuario);
            return response;
        }

        public async Task<Usuario> FindUsuarioAsync(int id)
        {
            var response = await _httpClient.GetFromJsonAsync<Usuario>($"?id={id}");
            return response;
        }



      

        public async Task<HttpResponseMessage> UpdateUsuarioAsync(Usuario usuario)
        {
            var response = await _httpClient.PutAsJsonAsync($"Usuarios/UpdateUsuarios/", usuario);
            return response;
        }

        public async Task<HttpResponseMessage> DeleteUsuarioAsync(int id)
        {
            var response = await _httpClient.DeleteAsync($"Usuarios/DeleteUser/{id}");
            return response;
        }






        //Unidad
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


        public async Task<HttpResponseMessage> CreateUnidadAsync(Unidad unidad)
        {
            var response = await _httpClient.PostAsJsonAsync("Unidades/InsertarUnidad", unidad);
            return response;
        }

        public async Task<Unidad> FindUnidadAsync(int id)
        {
            var response = await _httpClient.GetFromJsonAsync<Unidad>($"?id={id}");
            return response;
        }





        public async Task<HttpResponseMessage> UpdateUnidadAsync(Unidad unidad)
        {
            var response = await _httpClient.PutAsJsonAsync($"Unidades/UpdateUnidades/", unidad);
            return response;
        }

        public async Task<HttpResponseMessage> DeleteUnidadAsync(int id)
        {
            var response = await _httpClient.DeleteAsync($"Unidades/DeleteUnidad/{id}");
            return response;
        }



        //movimiento
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


        //producto
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

        public async Task<HttpResponseMessage> CreateProductoAsync(Producto producto)
        {
            var response = await _httpClient.PostAsJsonAsync("Productos/InsertarProducto",producto);

            if (response == null)
            {
                // Manejar el caso en el que response sea nulo
                throw new Exception("No se encontró el producto con el ID especificado.");
            }
            return response;
        }
   
        public async Task<Producto> FindProductoAsync(int id)

        {
            var response = await _httpClient.GetFromJsonAsync<Producto>($"Productos/GetProductoById?id={id}");
            if (response == null)
            {
                throw new Exception("No se encontro el producto con el ID especificado.");
            }
            return response;
        }
   
        public async Task<HttpResponseMessage> UpdateProductoAsync(Producto producto)
        {
            try
            {
                // Hacer la solicitud PUT al servidor para actualizar la marca
                var response = await _httpClient.PutAsJsonAsync("Productos/UpdateProductos", producto);

                // Verificar si la solicitud fue exitosa (código de estado 200 OK)
                if (response.IsSuccessStatusCode)
                {
                    return response;
                }
                else if (response.StatusCode == HttpStatusCode.NotFound)
                {
                    // La marca no se encontró en el servidor
                    return response;
                }
                else if (response.StatusCode == HttpStatusCode.BadRequest)
                {
                    // Error debido a una solicitud incorrecta (por ejemplo, nombre de marca duplicado)
                    return response;
                }
                else
                {
                    return new HttpResponseMessage(HttpStatusCode.InternalServerError)
                    {
                        Content = new StringContent("Error al actualizar la marca")
                    };
                }
            }
            catch (HttpRequestException ex)
            {
                // Manejar errores de solicitud HTTP (por ejemplo, error de conexión)
                Console.WriteLine($"Error en la solicitud HTTP: {ex.Message}");
                return null; // Otra opción es lanzar una excepción para notificar el error
            }
        }

        public async Task<HttpResponseMessage> DeleteProductoAsync(int id)
        {
            try
            {
                // Hacer la solicitud DELETE al servidor
                var response = await _httpClient.DeleteAsync($"Productos/DeleteProducto/{id}");

                // Verificar si la solicitud fue exitosa (código de estado 200 OK)
                if (response.IsSuccessStatusCode)
                {
                    // Marca eliminada correctamente
                    return response;
                }
                else if (response.StatusCode == HttpStatusCode.NotFound)
                {
                    // La marca no se encontró en el servidor
                    // Puedes manejar este caso específico según tus necesidades
                    return response;
                }
                else if (response.StatusCode == HttpStatusCode.BadRequest)
                {
                    // La solicitud fue incorrecta debido a una restricción (por ejemplo, marca asociada a un producto)
                    // Puedes manejar este caso específico según tus necesidades
                    return response;
                }
                else
                {
                    // Otro tipo de error no manejado específicamente
                    // Puedes registrar el error o manejarlo según tus necesidades
                    return new HttpResponseMessage(HttpStatusCode.InternalServerError) { Content = new StringContent("Error al eliminar la marca") };
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error en la solicitud HTTP: {ex.Message}");
                return null;
            }
        }


        //proveedor
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


        public async Task<HttpResponseMessage> CreateProveedorAsync(Proveedor prooveedor)
        {
            var response = await _httpClient.PostAsJsonAsync("Proveedores/InsertarProveedor", prooveedor);
            return response;
        }

        public async Task<Proveedor> FindProveedorAsync(int id)
        {
            var response = await _httpClient.GetFromJsonAsync<Proveedor>($"?id={id}");
            return response;
        }


        public async Task<Proveedor> FindnombreProveedorAsync(string nombreEmpresa)
        {
            try
            {
                var response = await _httpClient.GetFromJsonAsync<Proveedor>($"Proveedores/GetNombreProveedorById?nombreEmpresa={nombreEmpresa}");

                // Verificar si la respuesta es null, lo cual podría indicar un error en la solicitud
                if (response != null)
                {
                    return response;
                }
                else
                {
                    // Marca no encontrada u otro tipo de error
                    return null;
                }
            }
            catch (HttpRequestException)
            {
                // Error al hacer la solicitud HTTP
                return null;
            }
        }




        public async Task<HttpResponseMessage> UpdateProveedorAsync(Proveedor proveedor)
        {
            var response = await _httpClient.PutAsJsonAsync($"Proveedores/UpdateProveedores/", proveedor);
            return response;
        }

        public async Task<HttpResponseMessage> DeleteProveedorAsync(int id)
        {
            var response = await _httpClient.DeleteAsync($"Proveedores/DeleteProveedor/{id}");
            return response;
        }




        //lote
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

        public async Task<HttpResponseMessage> CreateLoteAsync(Lote lote)
        {
            var response = await _httpClient.PostAsJsonAsync("Lotes/InsertarLote", lote);
            return response;
        }

        public async Task<Lote> FindLoteAsync(int id)
        {
            var response = await _httpClient.GetFromJsonAsync<Lote>($"?id={id}");
            if (response == null)
            {
                // Manejar el caso en el que response sea nulo
                throw new Exception("No se encontró nada.");
            }
            return response;
        }

        public async Task<HttpResponseMessage> UpdateLoteAsync(Lote lote)
        {
            var response = await _httpClient.PutAsJsonAsync($"Lotes/UdateLotes/", lote);
            return response;
        }

        public async Task<HttpResponseMessage> DeleteLoteAsync(int id)
        {
            var response = await _httpClient.DeleteAsync($"Lotes/DeleteLote/{id}");
            return response;
        }




        //domicilio
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


        //detallepedido
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


        //permiso
        public async Task<IEnumerable<Permiso>> GetPermisoAsync()
        {
            var response = await _httpClient.GetFromJsonAsync<IEnumerable<Permiso>>("");
            if (response == null)
            {
                throw new NotImplementedException();
            }
            return response;
        }


        //rolo
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


