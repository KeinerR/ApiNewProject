using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Net;
using System.Net.Http;
using System.Net.Http.Json;
using System.Text;
using VistaNewProject.Models;

namespace VistaNewProject.Services
{
    public static class HttpClientExtensions
    {
        public static Task<HttpResponseMessage> PatchAsync(this HttpClient client, string requestUri)
        {
            var request = new HttpRequestMessage(new HttpMethod("PATCH"), requestUri);
            return client.SendAsync(request);
        }
    }
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
            var response = await _httpClient.GetFromJsonAsync<Cliente>($"Clientes/GetClienetById?id={id}");
            if (response == null)
            {
                // Manejar el caso en el que response sea nulo
                throw new Exception("No se encontró la unidad con el ID especificado.");
            }
            return response;
        }


        public async Task<HttpResponseMessage> CambiarEstadoClienteAsync(int id)
        {
            // Realiza la solicitud PATCH a la API
            var response = await _httpClient.PatchAsync($"Clientes/UpdateEstadoCliente/{id}");

            // Retorna la respuesta de la solicitud
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

        public async Task<Pedido> FindPedidosAsync(int id)
        {
            var response = await _httpClient.GetFromJsonAsync<Pedido>($"Pedidos/GetPedidos?id={id}");
            if (response == null)
            {
                // Manejar el caso en el que response sea nulo
                throw new Exception("No se encontró la unidad con el ID especificado.");
            }
            return response;
        }
        public async Task<HttpResponseMessage> CreatePediiosAsync(Pedido pedido)
        {
            var response = await _httpClient.PostAsJsonAsync("Pedidos/InsertPedidos", pedido);
            return response;
        }




        public async Task<HttpResponseMessage> UpdatePedidoAsync(Pedido pedido)
        {
            var response = await _httpClient.PutAsJsonAsync($"Pedidos/UpdatePedido/{pedido.PedidoId}", pedido);
            return response;
        }




        public async Task<HttpResponseMessage> CreatePedidoAsync(Pedido pedido)
        {
            var response = await _httpClient.PostAsJsonAsync("Pedidos/InsertPedidos", pedido);
            return response;


        }



        public async Task<HttpResponseMessage> DeletePedidoAsync(int id)
        {
            var response = await _httpClient.DeleteAsync($" Pedidos/DeletePedido/{id}");
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
            if (response == null)
            {
                throw new InvalidOperationException($"No se encontró la presentación con ID {id}");
            }
            return response;
        }






        public async Task<HttpResponseMessage> UpdatePresentacionAsync(PresentacionUpdate presentacion)
        {
            var response = await _httpClient.PutAsJsonAsync($"Presentaciones/UpdatePresentaciones/", presentacion);
            return response;
        }

        public async Task<HttpResponseMessage> DeletePresentacionAsync(int id)
        {
            var response = await _httpClient.DeleteAsync($"Presentaciones/DeletePresentacion/{id}");
            return response;
        }

        public async Task<HttpResponseMessage> CambiarEstadoPresentacionAsync(int id)
        {
            // Realiza la solicitud PATCH a la API
            var response = await _httpClient.PatchAsync($"Presentaciones/UpdateEstadoPresentacion/{id}");

            // Retorna la respuesta de la solicitud
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
        public async Task<HttpResponseMessage> CreateMarcaAsync(Marca marca)
        {
            var response = await _httpClient.PostAsJsonAsync("Marcas/InsertarMarca", marca);

            if (response == null)
            {
                // Manejar el caso en el que response sea nulo
                throw new Exception("No se encontró la marca con el ID especificado.");
            }
            return response;
        }
        public async Task< Marca> FindMarcaAsync(int? id)
        {
            var response = await _httpClient.GetFromJsonAsync<Marca>($"Marcas/GetMarcaById?id={id}");

            if (response == null)
            {
                // Manejar el caso en el que response sea nulo
                throw new Exception("No se encontró la marca con el ID especificado.");
            }
            return response;
        }

        public async Task<Marca> FindNombreMarcasAsync(string nombreMarca)
        {
            try
            {
                var response = await _httpClient.GetFromJsonAsync<Marca>($"Marcas/GetNombreMarcaById?nombreMarca={nombreMarca}");

                // Verificar si la respuesta es null
                if (response == null)
                {
                    throw new InvalidOperationException($"No se encontró la marca con nombre {nombreMarca}");
                }

                return response;
            }
            catch (HttpRequestException ex)
            {
                // Error al hacer la solicitud HTTP
                throw new InvalidOperationException("Error al hacer la solicitud HTTP", ex);
            }
        }



        public async Task<HttpResponseMessage> UpdateMarcaAsync(MarcaUpdate marca)
        {
            try
            {
                // Hacer la solicitud PUT al servidor para actualizar la marca
                var response = await _httpClient.PutAsJsonAsync("Marcas/UpdateMarca", marca);

                // Verificar si la solicitud fue exitosa
                if (response.IsSuccessStatusCode)
                {
                    return response;
                }
                else
                {
                    // Manejar los diferentes tipos de errores específicos
                    switch (response.StatusCode)
                    {
                        case HttpStatusCode.NotFound:
                            return new HttpResponseMessage(HttpStatusCode.NotFound)
                            {
                                Content = new StringContent("Marca no encontrada")
                            };
                        case HttpStatusCode.BadRequest:
                            return new HttpResponseMessage(HttpStatusCode.BadRequest)
                            {
                                Content = new StringContent("Solicitud incorrecta")
                            };
                        default:
                            return new HttpResponseMessage(HttpStatusCode.InternalServerError)
                            {
                                Content = new StringContent("Error al actualizar la marca")
                            };
                    }
                }
            }
            catch (HttpRequestException ex)
            {
                // Manejar errores de solicitud HTTP
                Console.WriteLine($"Error en la solicitud HTTP: {ex.Message}");
                return new HttpResponseMessage(HttpStatusCode.InternalServerError)
                {
                    Content = new StringContent("Error en la solicitud HTTP")
                };
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

                // Retornar la respuesta aunque no sea exitosa
                return response;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error en la solicitud HTTP: {ex.Message}");

                // Puedes retornar una respuesta de error o lanzar la excepción de nuevo
                return new HttpResponseMessage(HttpStatusCode.InternalServerError)
                {
                    ReasonPhrase = ex.Message
                };
            }
        }



        public async Task<HttpResponseMessage> CambiarEstadoMarcaAsync(int id)
        {
            // Realiza la solicitud PATCH a la API
            var response = await _httpClient.PatchAsync($"Marcas/UpdateEstadoMarca/{id}");

            // Retorna la respuesta de la solicitud
            return response;
        }



        /// CATEGORIA

        public async Task<IEnumerable<Categoria>> GetCategoriaAsync()
        {
            var response = await _httpClient.GetFromJsonAsync<IEnumerable<Categoria>>("Categorias/GetCategorias");

            if (response == null)
            {
                throw new Exception("No se encontraron categorías.");
            }
            return response;
        }

        public async Task<HttpResponseMessage> CreateCategoriaAsync(Categoria categoria)
        {
            var response = await _httpClient.PostAsJsonAsync("Categorias/InsertarCategoria", categoria);

            if (response == null)
            {
                throw new Exception("Error al crear la categoría.");
            }
            return response;
        }

        public async Task<Categoria> FindCategoriaAsync(int id)
        {
            var response = await _httpClient.GetFromJsonAsync<Categoria>($"Categorias/GetCategoriaById?id={id}");

            if (response == null)
            {
                throw new Exception("No se encontró la categoría con el ID especificado.");
            }
            return response;
        }

        public async Task<Categoria> FindnombreCategoriaAsync(string nombreCategoria)
        { 
             var response = await _httpClient.GetFromJsonAsync<Categoria>($"Categorias/GetNombreCategoriaById?nombreCategoria={nombreCategoria}");
            if (response == null)
            {
                // Manejar el caso en el que response sea nulo
                throw new Exception("No se encontró la categoria con el ID especificado.");
            }
            return response;
    
        }

        public async Task<HttpResponseMessage> UpdateCategoriaAsync(CategoriaUpdate categoria)
        {
            var response = await _httpClient.PutAsJsonAsync("Categorias/UpdateCategorias/", categoria);
            return response;
        }

        public async Task<HttpResponseMessage> DeleteCategoriaAsync(int id)
        {
            var response = await _httpClient.DeleteAsync($"Categorias/DeleteCategoria/{id}");
            return response;
        }

        public async Task<HttpResponseMessage> CambiarEstadoCategoriaAsync(int id)
        {
            var response = await _httpClient.PatchAsync($"Categorias/UpdateEstadoCategoria/{id}", null);
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
            var response = await _httpClient.GetFromJsonAsync<Usuario>($"Usuarios/GetUsuarioById?id={id}");
            if (response == null)
            {
                throw new Exception("No se encontro el usuario con el ID especificado.");
            }
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


        public async Task<HttpResponseMessage> CambiarEstadoUsuarioAsync(int id)
        {
            // Realiza la solicitud PATCH a la API
            var response = await _httpClient.PatchAsync($"Usuarios/UpdateEstadoUsuario/{id}");

            // Retorna la respuesta de la solicitud
            return response;
        }



        //Unidad

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
            var response = await _httpClient.GetFromJsonAsync<Unidad>($"Unidades/GetUnidadById?id={id}");
            if (response == null)
            {
                // Manejar el caso en el que response sea nulo
                throw new Exception("No se encontró la unidad con el ID especificado.");
            }
            return response;
        }





        public async Task<HttpResponseMessage> UpdateUnidadAsync(UnidadUpdate unidad)
        {
            var response = await _httpClient.PutAsJsonAsync($"Unidades/UpdateUnidades/", unidad);
            return response;
        }

        public async Task<HttpResponseMessage> DeleteUnidadAsync(int id)
        {
            var response = await _httpClient.DeleteAsync($"Unidades/DeleteUnidad/{id}");
            return response;
        }
        public async Task<HttpResponseMessage> CambiarEstadoUnidadAsync(int id)
        {
            // Realiza la solicitud PATCH a la API
            var response = await _httpClient.PatchAsync($"Unidades/UpdateEstadoUnidad/{id}");

            // Retorna la respuesta de la solicitud
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


        public async Task<HttpResponseMessage> CreateMovimientoAsync(Movimiento movimiento)
        {
            var response = await _httpClient.PostAsJsonAsync("Movimientos/InsertarMovimiento", movimiento);
            return response;
        }

        public async Task<Movimiento> FindMoviminetoAsync(int id)
        {
            var response = await _httpClient.GetFromJsonAsync<Movimiento>($"Movimientos/GetMovimientoById?id={id}");
            return response;
        }




        public async Task<HttpResponseMessage> UpdateMovimientoAsync(Movimiento movimiento)
        {
            var response = await _httpClient.PutAsJsonAsync($"Movimientos/UpdateMovimientos/", movimiento);
            return response;
        }

        public async Task<HttpResponseMessage> DeleteMovimientoAsync(int id)
        {
            var response = await _httpClient.DeleteAsync($"Movimientos/DeleteMovimiento/{id}");
            return response;
        }



        //producto
        public async Task<IEnumerable<Producto>> GetProductoAsync(string? busqueda = "")
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
                // Hacer la solicitud PUT al servidor para actualizar el producto
                var response = await _httpClient.PutAsJsonAsync("Productos/UpdateProductos", producto);

                // Verificar si la solicitud fue exitosa (código de estado 200 OK)
                if (response.IsSuccessStatusCode)
                {
                    return response;
                }
                else if (response.StatusCode == HttpStatusCode.NotFound)
                {
                    // El producto no se encontró en el servidor
                    return response;
                }
                else if (response.StatusCode == HttpStatusCode.BadRequest)
                {
                    // Error debido a una solicitud incorrecta (por ejemplo, datos de producto inválidos)
                    return response;
                }
                else
                {
                    return new HttpResponseMessage(HttpStatusCode.InternalServerError)
                    {
                        Content = new StringContent("Error al actualizar el producto")
                    };
                }
            }
            catch (HttpRequestException ex)
            {
                // Manejar errores de solicitud HTTP (por ejemplo, error de conexión)
                Console.WriteLine($"Error en la solicitud HTTP: {ex.Message}");
                return new HttpResponseMessage(HttpStatusCode.InternalServerError)
                {
                    Content = new StringContent($"Error en la solicitud HTTP: {ex.Message}")
                };
            }
            catch (Exception ex)
            {
                // Manejar cualquier otra excepción
                Console.WriteLine($"Error inesperado: {ex.Message}");
                return new HttpResponseMessage(HttpStatusCode.InternalServerError)
                {
                    Content = new StringContent($"Error inesperado: {ex.Message}")
                };
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
            catch (HttpRequestException ex)
            {
                // Manejar errores de solicitud HTTP (por ejemplo, error de conexión)
                Console.WriteLine($"Error en la solicitud HTTP: {ex.Message}");
                return new HttpResponseMessage(HttpStatusCode.InternalServerError)
                {
                    Content = new StringContent($"Error en la solicitud HTTP: {ex.Message}")
                };
            }
            catch (Exception ex)
            {
                // Manejar cualquier otra excepción
                Console.WriteLine($"Error inesperado: {ex.Message}");
                return new HttpResponseMessage(HttpStatusCode.InternalServerError)
                {
                    Content = new StringContent($"Error inesperado: {ex.Message}")
                };
            }
        }

        public async Task<HttpResponseMessage> CambiarEstadoProductoAsync(int id) {
            // Realiza la solicitud PATCH a la API
            var response = await _httpClient.PatchAsync($"Productos/UpdateEstadoProducto/{id}");

            // Retorna la respuesta de la solicitud
            return response;

        }


        /// PROVEEDOR

        public async Task<IEnumerable<Proveedor>> GetProveedorAsync()
        {
            var response = await _httpClient.GetFromJsonAsync<IEnumerable<Proveedor>>("Proveedores/GetProveedores");

            if (response == null)
            {
                throw new Exception("No se encontraron proveedores.");
            }
            return response;
        }

        public async Task<HttpResponseMessage> CreateProveedorAsync(Proveedor proveedor)
        {
            var response = await _httpClient.PostAsJsonAsync("Proveedores/InsertarProveedor", proveedor);

            if (response == null)
            {
                throw new Exception("Error al crear el proveedor.");
            }
            return response;
        }

        public async Task<Proveedor> FindProveedorAsync(int? id)
        {
            var response = await _httpClient.GetFromJsonAsync<Proveedor>($"Proveedores/GetProveedorById?id={id}");
            return response;
        }

        public async Task<Proveedor> FindnombreProveedorAsync(string nombreEmpresa)
        {
            var response = await _httpClient.GetFromJsonAsync<Proveedor>($"Proveedores/GetNombreProveedorById?nombreEmpresa={nombreEmpresa}");
            if (response == null)
            {
                // Manejar el caso en el que response sea nulo
                throw new Exception("No se encontró la unidad con el ID especificado.");
            }
            return response;
               
        }

        public async Task<HttpResponseMessage> UpdateProveedorAsync(ProveedorUpdate proveedor)
        {
            var response = await _httpClient.PutAsJsonAsync("Proveedores/UpdateProveedores/", proveedor);
            return response;
        }

        public async Task<HttpResponseMessage> DeleteProveedorAsync(int id)
        {
            var response = await _httpClient.DeleteAsync($"Proveedores/DeleteProveedor/{id}");
            return response;
        }

        public async Task<HttpResponseMessage> CambiarEstadoProveedorAsync(int id)
        {
            var response = await _httpClient.PatchAsync($"Proveedores/UpdateEstadoProveedor/{id}", null);
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
        public async Task<IEnumerable<Lote>> GetLotesByProductIdAsync(int productId)
        {
           var lotes = await _httpClient.GetFromJsonAsync<IEnumerable<Lote>>($"Lotes/GetLotesByProductId?productId={productId}");

            if (lotes == null)
            {
                // Manejar el caso en el que los lotes recibidos sean nulos o estén vacíos
                throw new Exception("No se encontraron lotes asociados al producto especificado.");
            }
            return lotes;
        }

        public async Task<HttpResponseMessage> CreateLoteAsync(Lote lote)
        {
            var response = await _httpClient.PostAsJsonAsync("Lotes/InsertarLote", lote);
            return response;
        }

        public async Task<Lote> FindLoteAsync(int id)
        {
            var response = await _httpClient.GetFromJsonAsync<Lote>($"Lotes/GetLoteById?id={id}");
            if (response == null)
            {
                // Manejar el caso en el que response sea nulo
                throw new Exception("No se encontró nada.");
            }
            return response;
        }

       

        public async Task<HttpResponseMessage> UpdateLoteAsync(Lote lote)
        {
            var response = await _httpClient.PutAsJsonAsync($"Lotes/UpdateLotes/", lote);
            return response;
        }

        public async Task<HttpResponseMessage> DeleteLoteAsync(int id)
        {
            var response = await _httpClient.DeleteAsync($"Lotes/DeleteLote/{id}");
            return response;
        }

        public async Task<HttpResponseMessage> UpdatePrecioLotesAsync(int productoId, decimal precioxunidad, decimal precioxproducto)
        {
            // Crear el objeto con los datos a enviar en la solicitud
            var data = new
            {
                productoId,
                precioxunidad,
                precioxproducto
            };

            // Serializar el objeto a JSON
            var json = JsonConvert.SerializeObject(data);

            // Crear el contenido JSON
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            // Enviar la solicitud HTTP PUT con los datos proporcionados
            var response = await _httpClient.PutAsync($"Lotes/UpdatePrecioLotes?productoId={productoId}&precioPorUnidadProducto={precioxunidad}&precioPorPresentacion={precioxproducto}", content);

            return response;
        }

        public async Task<HttpResponseMessage> UpdatePrecioLoteAsync(int loteId, string numeroLote, decimal precioxunidad, decimal precioxproducto)
        {
            // Crear objeto con los datos a enviar en la solicitud
            var data = new
            {
                LoteId = loteId,
                NumeroLote = numeroLote,
                PrecioPorUnidadProducto = precioxunidad,
                PrecioPorPresentacion = precioxproducto
            };

            // Enviar la solicitud HTTP PUT con los datos proporcionados
            var response = await _httpClient.PutAsJsonAsync("Lotes/UpdatePrecioLote", data);

            return response;
        }





        public async Task<Lote> FindLotesAsync(int id)
        {
            var response = await _httpClient.GetFromJsonAsync<Lote>($"Lotes/GetLoteById?id={id}");
            if (response == null)
            {
                // Manejar el caso en el que response sea nulo
                throw new Exception("No se encontró la unidad con el ID especificado.");
            }
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

        public async Task<HttpResponseMessage> UpdateDomicilioAsync(Domicilio domicilio)
        {
            var response = await _httpClient.PutAsJsonAsync($"Domicilios/UpdateDomicilios/", domicilio);
            return response;
        }


        public async Task<HttpResponseMessage> CreateDomicilioAsync(Domicilio domicilio)
        {
            var response = await _httpClient.PostAsJsonAsync("Domicilios/InsertDomicilio", domicilio);

            if (response == null)
            {
                // Manejar el caso en el que response sea nulo
                throw new Exception("No se encontró la unidad con el ID especificado.");
            }
            return response;
        }

        public async Task<Domicilio> FindDomicilioAsync(int id)
        {
            var response = await _httpClient.GetFromJsonAsync<Domicilio>($"Domicilios/GetDomicilioById?id={id}");
            if (response == null)
            {
                // Manejar el caso en el que response sea nulo
                throw new Exception("No se encontró la unidad con el ID especificado.");
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
        public async Task<Detallepedido> FindDetallesPedidoAsync(int id)
        {
            var response = await _httpClient.GetFromJsonAsync<Detallepedido>($"Detallepedidos/GetDetallepedidoById?id={id}");
            if (response == null)
            {
                // Manejar el caso en el que response sea nulo
                throw new Exception("No se encontró la unidad con el ID especificado.");
            }
            return response;
        }




        public async Task<HttpResponseMessage> CreateDetallesPedidosAsync(Detallepedido detallepedido)
        {
            var response = await _httpClient.PostAsJsonAsync("Detallepedidos/InsertarDetallepedido", detallepedido);
            return response;
        }

        public async Task<HttpResponseMessage> UpdateDetallepedidosAsync(Detallepedido detallepedido)
        {
            var response = await _httpClient.PutAsJsonAsync($"Detallepedidos/UpdateDetallepedidos/", detallepedido);
            return response;
        }

        public async Task<HttpResponseMessage> DeleteDetallePedidoAsync(int id)
        {
            var response = await _httpClient.DeleteAsync($"Detallepedidos/DeleteDetallepedido/{id}");
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

        public async Task<IEnumerable<CategoriaxUnidad>> GetCategoriaxUnidadesAsync()
        {
        
            var response = await _httpClient.GetFromJsonAsync<IEnumerable<CategoriaxUnidad>>("CategoriaxUnidad/GetCategoriasxUnidades");
            if (response == null)
            {
                // Manejar el caso en el que response sea nulo
                throw new Exception("No se encontró la unidad con el ID especificado.");
            }
            return response;

        }

        public async Task<HttpResponseMessage> CreateCategoriaxUnidadAsync(CategoriaxUnidad categoriaxunidad)
        {
            var response = await _httpClient.PostAsJsonAsync("CategoriaxUnidad/InsertarCategoria", categoriaxunidad);
            return response;
        }

        public async Task<HttpResponseMessage> DeleteCategoriaxUnidadAsync(int categoriaId, int unidadId)
        {
            try
            {
                var response = await _httpClient.DeleteAsync($"CategoriaxUnidad/DeleteCategoriaxUnidad/{categoriaId}/{unidadId}");

                if (!response.IsSuccessStatusCode)
                {
                    // Log or handle the response status code
                }

                return response;
            }
            catch (HttpRequestException ex)
            {
                // Log or handle HTTP request exceptions
                throw new Exception($"Error en la solicitud HTTP: {ex.Message}", ex);
            }
            catch (Exception ex)
            {
                // Log or handle any other exceptions
                throw new Exception($"Error inesperado: {ex.Message}", ex);
            }
        }

        


        public async Task<IEnumerable<CategoriaxPresentacion>> GetCategoriaxPresentacionesAsync()
        {

                var response = await _httpClient.GetFromJsonAsync<IEnumerable<CategoriaxPresentacion>>("CategoriaxPresentacion/GetCategoriasxPresentaciones");

                if (response == null)
                {
                    // Manejar el caso en el que response sea nulo
                    throw new Exception("No se encontró la unidad con el ID especificado.");
                }
                return response;
         
        }
        public async Task<HttpResponseMessage> CreateCategoriaxPresentacionAsync(CategoriaxPresentacion categoriaxpresentacion)
        {
            var response = await _httpClient.PostAsJsonAsync("CategoriaxPresentacion/InsertarCategoria", categoriaxpresentacion);
            return response;
        }
        public async Task<HttpResponseMessage> DeleteCategoriaxPresentacionAsync(int categoriaId, int presentacionId)
        {
            try
            {
                var response = await _httpClient.DeleteAsync($"CategoriaxPresentacion/DeleteCategoriaxPresentacion/{categoriaId}/{presentacionId}"
);

                if (!response.IsSuccessStatusCode)
                {
                    // Log or handle the response status code
                }

                return response;
            }
            catch (HttpRequestException ex)
            {
                // Log or handle HTTP request exceptions
                throw new Exception($"Error en la solicitud HTTP: {ex.Message}", ex);
            }
            catch (Exception ex)
            {
                // Log or handle any other exceptions
                throw new Exception($"Error inesperado: {ex.Message}", ex);
            }
        }


        public async Task<IEnumerable<CategoriaxMarca>> GetCategoriaxMarcasAsync()
        {    
           var response = await _httpClient.GetFromJsonAsync<IEnumerable<CategoriaxMarca>>("CategoriaxMarca/GetCategoriasxMarcaes");

            if (response == null)
            {
                // Manejar el caso en el que response sea nulo
                throw new Exception("No se encontró la unidad con el ID especificado.");
            }
            return response;
        
        }
        public async Task<HttpResponseMessage> CreateCategoriaxMarcaAsync(CategoriaxMarca categoriaxmarca)
        {
            var response = await _httpClient.PostAsJsonAsync("CategoriaxMarca/InsertarCategoria", categoriaxmarca);
            return response;
        }
        public async Task<HttpResponseMessage> DeleteCategoriaxMarcaAsync(int categoriaId, int marcaId)
        {
            try
            {
                var response = await _httpClient.DeleteAsync($"CategoriaxMarca/DeleteCategoriaxMarca/{categoriaId}/{marcaId}"
);

                if (!response.IsSuccessStatusCode)
                {
                    // Log or handle the response status code
                }

                return response;
            }
            catch (HttpRequestException ex)
            {
                // Log or handle HTTP request exceptions
                throw new Exception($"Error en la solicitud HTTP: {ex.Message}", ex);
            }
            catch (Exception ex)
            {
                // Log or handle any other exceptions
                throw new Exception($"Error inesperado: {ex.Message}", ex);
            }
        }






    }
}


