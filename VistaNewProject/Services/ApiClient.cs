﻿using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Org.BouncyCastle.Ocsp;
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

        public async Task<HttpResponseMessage> CambiarEstadoPedidoAsync(int id, string estado)
        {
            try
            {
                // Crear un objeto anónimo para enviar en el cuerpo de la solicitud
                var content = new
                {
                    EstadoPedido = estado
                };

                // Serializar el objeto a JSON
                var json = JsonConvert.SerializeObject(content);
                var httpContent = new StringContent(json, Encoding.UTF8, "application/json");

                // Realizar la solicitud PATCH a la API
                var response = await _httpClient.PatchAsync($"Pedidos/UpdateEstadoPedido/{id}", httpContent);

                // Verificar si la respuesta fue exitosa
                response.EnsureSuccessStatusCode();

                // Retornar la respuesta de la solicitud
                return response;
            }
            catch (HttpRequestException ex)
            {
                // Manejar errores de solicitud HTTP
                Console.WriteLine($"Error en la solicitud HTTP: {ex.Message}");
                throw;
            }
            catch (Exception ex)
            {
                // Manejar otros errores
                Console.WriteLine($"Error: {ex.Message}");
                throw;
            }
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



        public async Task<HttpResponseMessage> CreatePresentacionAsync(PresentacionCrearYActualizar presentacion)
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

        public async Task<HttpResponseMessage> UpdatePresentacionAsync(PresentacionCrearYActualizar presentacion)
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

        public async Task<HttpResponseMessage> CreateComprasAsync(CrearCompra compra)
        {
            var response = await _httpClient.PostAsJsonAsync("Compras/InsertCompras", compra);
            if (response == null)
            {
                // Manejar el caso en el que response sea nulo
                throw new Exception("No se encontró la marca con el ID especificado.");
            }
            return response;
        }
        public async Task<Compra> FinComprasAsync(int id)
        {
            var response = await _httpClient.GetFromJsonAsync<Compra>($"Compras/GetCompraById?Id={id}");

            if (response == null)
            {
                // Manejar el caso en el que response sea nulo
                throw new Exception("No se encontró la marca con el ID especificado.");
            }
            return response;
        }




        public async Task<HttpResponseMessage> UpdateComprasAsync(Compra compra)
        {
            try
            {
                // Hacer la solicitud PUT al servidor para actualizar la marca
                var response = await _httpClient.PutAsJsonAsync("Compras/UpdateCompras", compra);

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





        public async Task<HttpResponseMessage> DeleteComprasAsync(int id)
        {
            try
            {
                // Hacer la solicitud DELETE al servidor
                var response = await _httpClient.DeleteAsync($"Compras/DeleteCompra/{id}");

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

        public async Task<HttpResponseMessage> CreateDetallesComprasAsync(Detallecompra detallecompra)
        {
            var response = await _httpClient.PostAsJsonAsync("Detallecompras/InsertarDetallecompra", detallecompra);

            if (response == null)
            {
                // Manejar el caso en el que response sea nulo
                throw new Exception("No se encontró la marca con el ID especificado.");
            }
            return response;
        }
        public async Task<Detallecompra> FindDetallesComprasAsync(int id)
        {
            var response = await _httpClient.GetFromJsonAsync<Detallecompra>($"Detallecompras/GetDetallecompraById?id={id}");

            if (response == null)
            {
                // Manejar el caso en el que response sea nulo
                throw new Exception("No se encontró la marca con el ID especificado.");
            }
            return response;
        }




        public async Task<HttpResponseMessage> UpdateDetallesComprasAsync(Detallecompra detallecompra)
        {
            try
            {
                // Hacer la solicitud PUT al servidor para actualizar la marca
                var response = await _httpClient.PutAsJsonAsync("Detallecompras/UpdateDetallecompras", detallecompra);

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





        public async Task<HttpResponseMessage> DeleteDetalleComprasAsync(int id)
        {
            try
            {
                // Hacer la solicitud DELETE al servidor
                var response = await _httpClient.DeleteAsync($"Detallecompras/DeleteDetallecompra/{id}");

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
        public async Task<Marca> FindMarcaAsync(int? id)
        {
            var response = await _httpClient.GetFromJsonAsync<Marca>($"Marcas/GetMarcaById?id={id}");

            if (response == null)
            {
                // Manejar el caso en el que response sea nulo
                throw new Exception("No se encontró la marca con el ID especificado.");
            }
            return response;
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
        public async Task<HttpResponseMessage> UpdateUnidadAsync(Unidad unidad)
        {
            var response = await _httpClient.PutAsJsonAsync($"Unidades/UpdateUnidades/", unidad);
            if (response == null)
            {
                throw new Exception("No se pudo realizar la actualiacion en el API");
            }
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
            // Construye la URL con el parámetro de búsqueda
            string url = "Productos/GetProductos";
            if (!string.IsNullOrEmpty(busqueda))
            {
                url += $"?busqueda={Uri.EscapeDataString(busqueda)}";
            }

            var response = await _httpClient.GetFromJsonAsync<IEnumerable<Producto>>(url);

            if (response == null)
            {
                // Manejar el caso en el que response sea nulo
                throw new Exception("No se encontró el producto con el término de búsqueda especificado.");
            }
            return response;
        }

        public async Task<IEnumerable<Producto>> GetAllDatosProductosAsync(string? busqueda = "")
        {
            var response = await _httpClient.GetFromJsonAsync<IEnumerable<Producto>>("Productos/GetAllDatosProductos");

            if (response == null)
            {
                // Manejar el caso en el que response sea nulo
                throw new Exception("No se encontró el producto con el ID especificado.");
            }
            return response;
        }

        public async Task<HttpResponseMessage> CreateProductoAsync(ProductoCrearYActualizar producto)
        {
            var response = await _httpClient.PostAsJsonAsync("Productos/InsertarProducto", producto);

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
        public async Task<Producto> FindDatosProductoAsync(int id)

        {
            var response = await _httpClient.GetFromJsonAsync<Producto>($"Productos/GetDatosProductoById?id={id}");
            if (response == null)
            {
                throw new Exception("No se encontro el producto con el ID especificado.");
            }
            return response;

        }

        public async Task<HttpResponseMessage> UpdateProductoAsync(ProductoCrearYActualizar producto)
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

        public async Task<HttpResponseMessage> CambiarEstadoProductoAsync(int id)
        {
            // Realiza la solicitud PATCH a la API
            var response = await _httpClient.PatchAsync($"Productos/UpdateEstadoProducto/{id}");

            // Retorna la respuesta de la solicitud
            return response;

        }

        public async Task<HttpResponseMessage> AddCantidadReservadaAsync(int productoId, int? cantidad)
        {
            // Objeto JSON para enviar en el cuerpo de la solicitud, aunque en este caso no se envía contenido en el cuerpo de la solicitud según el ejemplo curl proporcionado
            var content = new StringContent("", Encoding.UTF8, "application/json");

            // Realiza la solicitud PUT a la API
            var response = await _httpClient.PutAsync($"Productos/AddCantidadReservada/{productoId}?cantidad={cantidad}", content);

            // Retorna la respuesta de la solicitud
            return response;
        }
        public async Task<HttpResponseMessage> SustraerCantidadReservadaAsync(int productoId, int? cantidad)
        {
            // Objeto JSON para enviar en el cuerpo de la solicitud, aunque en este caso no se envía contenido en el cuerpo de la solicitud según el ejemplo curl proporcionado
            var content = new StringContent("", Encoding.UTF8, "application/json");

            // Realiza la solicitud PUT a la API
            var response = await _httpClient.PutAsync($"Productos/SustraerCantidadReservada/{productoId}?cantidad={cantidad}", content);

            // Retorna la respuesta de la solicitud
            return response;
        }
        public async Task<HttpResponseMessage> AddCantidadPorUnidadReservadaAsync(int productoId, int? cantidad)
        {
            // Objeto JSON para enviar en el cuerpo de la solicitud, aunque en este caso no se envía contenido en el cuerpo de la solicitud según el ejemplo curl proporcionado
            var content = new StringContent("", Encoding.UTF8, "application/json");

            // Realiza la solicitud PUT a la API
            var response = await _httpClient.PutAsync($"Productos/AddCantidadPorUnidadReservada/{productoId}?cantidad={cantidad}", content);

            // Retorna la respuesta de la solicitud
            return response;
        }
        public async Task<HttpResponseMessage> SustraerCantidadPorUnidadReservadaAsync(int productoId, int? cantidad)
        {
            // Objeto JSON para enviar en el cuerpo de la solicitud, aunque en este caso no se envía contenido en el cuerpo de la solicitud según el ejemplo curl proporcionado
            var content = new StringContent("", Encoding.UTF8, "application/json");

            // Realiza la solicitud PUT a la API
            var response = await _httpClient.PutAsync($"Productos/SustraerCantidadPorUnidadReservada/{productoId}?cantidad={cantidad}", content);

            // Retorna la respuesta de la solicitud
            return response;
        }

        public async Task<HttpResponseMessage> QuitarCantidadReservada(int productoId, int? cantidad)
        {
            // Objeto JSON para enviar en el cuerpo de la solicitud, aunque en este caso no se envía contenido en el cuerpo de la solicitud según el ejemplo curl proporcionado
            var content = new StringContent("", Encoding.UTF8, "application/json");

            // Realiza la solicitud PUT a la API
            var response = await _httpClient.PutAsync($"Productos/QuitarCantidadReservada/{productoId}?cantidad={cantidad}", content);

            // Retorna la respuesta de la solicitud
            return response;
        }
        public async Task<HttpResponseMessage> QuitarCantidadReservadaUnidad(int productoId, int? cantidad)
        {
            // Objeto JSON para enviar en el cuerpo de la solicitud, aunque en este caso no se envía contenido en el cuerpo de la solicitud según el ejemplo curl proporcionado
            var content = new StringContent("", Encoding.UTF8, "application/json");

            // Realiza la solicitud PUT a la API
            var response = await _httpClient.PutAsync($"Productos/QuitarCantidadReservadaUnidad/{productoId}?cantidad={cantidad}", content);

            // Retorna la respuesta de la solicitud
            return response;
        }
        public async Task<HttpResponseMessage> PedidosCancelados(int productoId, int? cantidad)
        {
            // Objeto JSON para enviar en el cuerpo de la solicitud, aunque en este caso no se envía contenido en el cuerpo de la solicitud según el ejemplo curl proporcionado
            var content = new StringContent("", Encoding.UTF8, "application/json");

            // Realiza la solicitud PUT a la API
            var response = await _httpClient.PutAsync($"Productos/PedidosCancelados/{productoId}?cantidad={cantidad}", content);

            // Retorna la respuesta de la solicitud
            return response;
        }
        public async Task<HttpResponseMessage> PedidosCanceladosUnidad(int productoId, int? cantidad)
        {
            // Objeto JSON para enviar en el cuerpo de la solicitud, aunque en este caso no se envía contenido en el cuerpo de la solicitud según el ejemplo curl proporcionado
            var content = new StringContent("", Encoding.UTF8, "application/json");

            // Realiza la solicitud PUT a la API
            var response = await _httpClient.PutAsync($"Productos/PedidosCanceladosUnidad/{productoId}?cantidad={cantidad}", content);

            // Retorna la respuesta de la solicitud
            return response;
        }

        public async Task<HttpResponseMessage> AddCantidadTotalAsync(int productoId, int? cantidad)
        {
            // Objeto JSON para enviar en el cuerpo de la solicitud, aunque en este caso no se envía contenido en el cuerpo de la solicitud según el ejemplo curl proporcionado
            var content = new StringContent("", Encoding.UTF8, "application/json");

            // Realiza la solicitud PUT a la API
            var response = await _httpClient.PutAsync($"Productos/AddCantidadTotal/{productoId}?cantidad={cantidad}", content);

            // Retorna la respuesta de la solicitud
            return response;
        }
        public async Task<HttpResponseMessage> SustraerCantidadTotalAsync(int productoId, int? cantidad)
        {
            // Objeto JSON para enviar en el cuerpo de la solicitud, aunque en este caso no se envía contenido en el cuerpo de la solicitud según el ejemplo curl proporcionado
            var content = new StringContent("", Encoding.UTF8, "application/json");

            // Realiza la solicitud PUT a la API
            var response = await _httpClient.PutAsync($"Productos/SustraerCantidadTotal/{productoId}?cantidad={cantidad}", content);

            // Retorna la respuesta de la solicitud
            return response;
        }
        public async Task<HttpResponseMessage> AddCantidadTotalPorUnidadAsync(int productoId, int? cantidad)
        {
            // Objeto JSON para enviar en el cuerpo de la solicitud, aunque en este caso no se envía contenido en el cuerpo de la solicitud según el ejemplo curl proporcionado
            var content = new StringContent("", Encoding.UTF8, "application/json");

            // Realiza la solicitud PUT a la API
            var response = await _httpClient.PutAsync($"Productos/AddCantidadTotalPorUnidad/{productoId}?cantidad={cantidad}", content);

            // Retorna la respuesta de la solicitud
            return response;
        }
        public async Task<HttpResponseMessage> SustraerCantidadTotalPorUnidadAsync(int productoId, int? cantidad)
        {
            // Objeto JSON para enviar en el cuerpo de la solicitud, aunque en este caso no se envía contenido en el cuerpo de la solicitud según el ejemplo curl proporcionado
            var content = new StringContent("", Encoding.UTF8, "application/json");

            // Realiza la solicitud PUT a la API
            var response = await _httpClient.PutAsync($"Productos/SustraerCantidadTotalPorUnidad/{productoId}?cantidad={cantidad}", content);

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
        public async Task<IEnumerable<Lote>> GetLotesByDetalleCompraIdAsync(int id)
        {
            var lotes = await _httpClient.GetFromJsonAsync<IEnumerable<Lote>>($"Lotes/GetLotesByDetalleCompraId?id={id}");

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


        public async Task<HttpResponseMessage> AddCantidadALoteAsync(int loteId, int? cantidad)
        {
            // Objeto JSON para enviar en el cuerpo de la solicitud, aunque en este caso no se envía contenido en el cuerpo de la solicitud según el ejemplo curl proporcionado
            var content = new StringContent("", Encoding.UTF8, "application/json");

            // Realiza la solicitud PUT a la API
            var response = await _httpClient.PutAsync($"Lotes/AddCantidadALote/{loteId}?cantidad={cantidad}", content);

            // Retorna la respuesta de la solicitud
            return response;
        }
        public async Task<HttpResponseMessage> SustraerCantidadALoteAsync(int loteId, int? cantidad)
        {
            // Objeto JSON para enviar en el cuerpo de la solicitud, aunque en este caso no se envía contenido en el cuerpo de la solicitud según el ejemplo curl proporcionado
            var content = new StringContent("", Encoding.UTF8, "application/json");

            // Realiza la solicitud PUT a la API
            var response = await _httpClient.PutAsync($"Lotes/SustraerCantidadALote/{loteId}?cantidad={cantidad}", content);

            // Retorna la respuesta de la solicitud
            return response;
        }
        public async Task<HttpResponseMessage> AddCantidadPorUnidadALoteAsync(int loteId, int? cantidad)
        {
            // Objeto JSON para enviar en el cuerpo de la solicitud, aunque en este caso no se envía contenido en el cuerpo de la solicitud según el ejemplo curl proporcionado
            var content = new StringContent("", Encoding.UTF8, "application/json");

            // Realiza la solicitud PUT a la API
            var response = await _httpClient.PutAsync($"Lotes/AddCantidadPorUnidadALote/{loteId}?cantidad={cantidad}", content);

            // Retorna la respuesta de la solicitud
            return response;
        }
        public async Task<HttpResponseMessage> SustraerCantidadPorUnidadALoteAsync(int loteId, int? cantidad)
        {
            // Objeto JSON para enviar en el cuerpo de la solicitud, aunque en este caso no se envía contenido en el cuerpo de la solicitud según el ejemplo curl proporcionado
            var content = new StringContent("", Encoding.UTF8, "application/json");

            // Realiza la solicitud PUT a la API
            var response = await _httpClient.PutAsync($"Lotes/SustraerCantidadPorUnidadALote/{loteId}?cantidad={cantidad}", content);

            // Retorna la respuesta de la solicitud
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
            var response = await _httpClient.GetFromJsonAsync<IEnumerable<Permiso>>("Presentaciones/GetPresentaciones");
            if (response == null)
            {
                throw new NotImplementedException();
            }
            return response;
        }
        public async Task<HttpResponseMessage> CreatePermisoAsync(Permiso permiso)
        {
            var response = await _httpClient.PostAsJsonAsync("Permiso/InsertPermiso", permiso);

            if (response == null)
            {
                throw new Exception("Error al crear el Permiso.");
            }
            return response;
        }

        public async Task<Permiso> FindPermisoAsync(int id)
        {
            var response = await _httpClient.GetFromJsonAsync<Permiso>($"Permisos/GetPermisoById?id={id}");
            if (response == null)
            {
                throw new Exception("Error al crear el Permiso.");
            }
            return response;
        }

        public async Task<HttpResponseMessage> UpdatePermisoAsync(Permiso permiso)
        {
            var response = await _httpClient.PutAsJsonAsync("Permisos/UpdatePermiso/", permiso);
            if (response == null)
            {
                throw new Exception("Error al crear el Permiso.");
            }
            return response;
        }

        public async Task<HttpResponseMessage> DeletePermisoAsync(int id)
        {
            var response = await _httpClient.DeleteAsync($"Permisos/DeletePermiso/{id}");
            if (response == null)
            {
                throw new Exception("Error al eliminar el Permiso.");
            }
            return response;
        }

        //rol
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
        public async Task<HttpResponseMessage> CreateRolAsync(Rol rol)
        {
            var response = await _httpClient.PostAsJsonAsync("Roles/InsertRol", rol);

            if (response == null)
            {
                throw new Exception("Error al crear el rol.");
            }
            return response;
        }

        public async Task<Rol> FindRolAsync(int id)
        {
            var response = await _httpClient.GetFromJsonAsync<Rol>($"Roles/GetRolById?id={id}");
            if (response == null)
            {
                throw new Exception("Error al crear el rol.");
            }
            return response;
        }

        public async Task<HttpResponseMessage> UpdateRolAsync(Rol rol)
        {
            var response = await _httpClient.PutAsJsonAsync("Roles/UpdateRol/", rol);
            if (response == null)
            {
                throw new Exception("Error al crear el rol.");
            }
            return response;
        }

        public async Task<HttpResponseMessage> DeleteRolAsync(int id)
        {
            var response = await _httpClient.DeleteAsync($"Roles/DeleteRol/{id}");
            if (response == null)
            {
                throw new Exception("Error al eliminar el rol.");
            }
            return response;
        }

        //roles x permisos
        public async Task<IEnumerable<Rolxpermiso>> GetRolesxPermisosAsync()
        {
            try
            {
                var response = await _httpClient.GetFromJsonAsync<IEnumerable<Rolxpermiso>>("RolesxPermisos/GetRolesxPermisos");
                if (response == null)
                {
                    throw new Exception("No se encontró ninguna entidad.");
                }
                return response;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error al obtener los roles y permisos: {ex.Message}", ex);
            }
        }

        public async Task<UsuarioAcceso> GetAccesoAsync(int usuarioId)
        {
            var response = await _httpClient.GetFromJsonAsync<UsuarioAcceso>($"RolesxPermisos/GetRolxPermisosByUsuarioId/{usuarioId}");

            if (response == null)
            {
                // Manejar el caso en el que response sea nulo
                throw new Exception("No se encontraron los permisos asociados al usuario con el ID especificado.");
            }

            return response;
        }

        public async Task<Rolxpermiso> GetRolesxPermisosByIdAsync(int rolxPermisoId)
        {
            try
            {
                var response = await _httpClient.GetFromJsonAsync<Rolxpermiso>($"RolesxPermisos/GetRolxPermisosById/{rolxPermisoId}");
                if (response == null)
                {
                    throw new Exception("No se encontró la entidad con el ID especificado.");
                }
                return response;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error al obtener el rol y permiso por ID: {ex.Message}", ex);
            }
        }

        public async Task<PermisoAcceso> GetPermisosByPermisoIdAsync(int permisoId)
        {
            try
            {
                var response = await _httpClient.GetFromJsonAsync<PermisoAcceso>($"RolesxPermisos/GetRolxPermisosByIdPermiso/{permisoId}");
                if (response == null)
                {
                    throw new Exception("No se encontró la entidad con el ID especificado.");
                }
                return response;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error al obtener el permiso por ID: {ex.Message}", ex);
            }
        }

        public async Task<RolAcceso> GetPermisosByRolIdAsync(int rolId)
        {
            try
            {
                var response = await _httpClient.GetFromJsonAsync<RolAcceso>($"RolesxPermisos/GetRolxPermisosByRolId/{rolId}");
                if (response == null)
                {
                    throw new Exception("No se encontró la entidad con el ID especificado.");
                }
                return response;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error al obtener el permiso por ID de rol: {ex.Message}", ex);
            }
        }

        public async Task<HttpResponseMessage> CreateRolxPermisoAsync(RolxpermisoCrear rolxpermiso)
        {
            try
            {
                var response = await _httpClient.PostAsJsonAsync("RolesxPermisos/InsertRolxpermiso", rolxpermiso);
                return response;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error al crear el rol y permiso: {ex.Message}", ex);
            }
        }

        public async Task<HttpResponseMessage> DeleteRolxPermisoAsync(int rolId, int permisoId, string NombreRolxPermiso)
        {
            try
            {
                var response = await _httpClient.DeleteAsync($"RolesxPermisos/DeleteRolxPermiso/{rolId}/{permisoId}/{NombreRolxPermiso}");

                if (!response.IsSuccessStatusCode)
                {
                    // Log or handle the response status code
                }

                return response;
            }
            catch (HttpRequestException ex)
            {
                throw new Exception($"Error en la solicitud HTTP: {ex.Message}", ex);
            }
            catch (Exception ex)
            {
                throw new Exception($"Error inesperado: {ex.Message}", ex);
            }
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
        public async Task<IEnumerable<CategoriaxUnidad>> GetCategoriaxUnidadesByIdAsync(int categoriaId)
        {

            var response = await _httpClient.GetFromJsonAsync<IEnumerable<CategoriaxUnidad>>($"CategoriaxUnidad/GetCategoriasxUnidadById?id={categoriaId}");
            if (response == null)
            {
                // Manejar el caso en el que response sea nulo
                throw new Exception("No se encontró la unidad con el ID especificado.");
            }
            return response;

        }
        public async Task<IEnumerable<CategoriaxUnidad>> GetCategoriasxUnidadByIdUnidadAsync(int unidadId)
        {

            var response = await _httpClient.GetFromJsonAsync<IEnumerable<CategoriaxUnidad>>($"CategoriaxUnidad/GetCategoriasxUnidadByIdUnidad/{unidadId}");
            if (response == null)
            {
                // Manejar el caso en el que response sea nulo
                throw new Exception("No se encontró la unidad con el ID especificado.");
            }
            return response;

        }
        public async Task<HttpResponseMessage> CreateCategoriaxUnidadAsync(CategoriaxUnidad categoriaxunidad)
        {
            var response = await _httpClient.PostAsJsonAsync("CategoriaxUnidad/InsertarCategoriaxUnidad", categoriaxunidad);
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
                throw new Exception("No se encontró resultado alguno.");
            }
            return response;

        }
        public async Task<HttpResponseMessage> CreateCategoriaxPresentacionAsync(CategoriaxPresentacionAsosiacion categoriaxpresentacion)
        {
            var response = await _httpClient.PostAsJsonAsync("CategoriaxPresentacion/InsertarCategoriaxPresentacion", categoriaxpresentacion);
            if (response == null)
            {
                // Manejar el caso en el que response sea nulo
                throw new Exception("No se encontró ninguna presentacion con el ID especificado.");
            }
            return response;


        }
        public async Task<IEnumerable<CategoriaxPresentacion>> GetCategoriaxPresentacionesByIdAsync(int presentacionId)
        {
            var response = await _httpClient.GetFromJsonAsync<IEnumerable<CategoriaxPresentacion>>($"CategoriaxPresentacion/GetCategoriasxPresentacionById?id={presentacionId}");
            if (response == null)
            {
                // Manejar el caso en el que response sea nulo
                throw new Exception("No se encontró ninguna presentacion con el ID especificado.");
            }
            return response;
        }
        public async Task<IEnumerable<CategoriaxPresentacion>> GetCategoriasxPresentacionByIdPresentacionAsync(int presentacionId)
        {
            var response = await _httpClient.GetFromJsonAsync<IEnumerable<CategoriaxPresentacion>>($"CategoriaxPresentacion/GetCategoriasxPresentacionByIdPresentacion/{presentacionId}");
            if (response == null)
            {
                // Manejar el caso en el que response sea nulo
                throw new Exception("No se encontró ninguna presentacion con el ID especificado.");
            }
            return response;
        }
        public async Task<HttpResponseMessage> DeleteCategoriaxPresentacionAsync(int categoriaId, int presentacionId)
        {
            try
            {
                var response = await _httpClient.DeleteAsync($"CategoriaxPresentacion/DeleteCategoriaxPresentacion/{categoriaId}/{presentacionId}");

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
            var response = await _httpClient.GetFromJsonAsync<IEnumerable<CategoriaxMarca>>("CategoriaxMarca/GetCategoriasxMarcas");

            if (response == null)
            {
                // Manejar el caso en el que response sea nulo
                throw new Exception("No se encontró la unidad con el ID especificado.");
            }
            return response;

        }
        public async Task<IEnumerable<CategoriaxMarca>> GetCategoriaxMarcasByIdAsync(int categoriaId)
        {
            var response = await _httpClient.GetFromJsonAsync<IEnumerable<CategoriaxMarca>>($"CategoriaxMarca/GetCategoriasxMarcaById/{categoriaId}");

            if (response == null)
            {
                // Manejar el caso en el que response sea nulo
                throw new Exception("No se encontró la unidad con el ID especificado.");
            }
            return response;

        }
        public async Task<IEnumerable<CategoriaxMarca>> GetCategoriasxMarcaByIdMarcaAsync(int marcaId)
        {
            var response = await _httpClient.GetFromJsonAsync<IEnumerable<CategoriaxMarca>>($"CategoriaxMarca/GetCategoriasxMarcaByIdMarca?id={marcaId}");

            if (response == null)
            {
                // Manejar el caso en el que response sea nulo
                throw new Exception("No se encontró la unidad con el ID especificado.");
            }
            return response;

        }
        public async Task<HttpResponseMessage> CreateCategoriaxMarcaAsync(CategoriaxMarcaAsosiacion categoriaxmarca)
        {
            var response = await _httpClient.PostAsJsonAsync("CategoriaxMarca/InsertarCategoriaxMarca", categoriaxmarca);
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

        public async Task<IEnumerable<UnidadxProducto>> GetUnidadesxProductosAsync()
        {
            var response = await _httpClient.GetFromJsonAsync<IEnumerable<UnidadxProducto>>("UnidadesxProducto/GetUnidadesxProducto");

            if (response == null)
            {
                // Manejar el caso en el que response sea nulo
                throw new Exception("No se encontró la unidad con el ID especificado.");
            }
            return response;

        }
        public async Task<IEnumerable<UnidadxProducto>> GetUnidadxProductosByIdAsync(int unidadId)
        {
            var response = await _httpClient.GetFromJsonAsync<IEnumerable<UnidadxProducto>>($"UnidadesxProducto/GetUnidadesxProductoById?Id={unidadId}");

            if (response == null)
            {
                // Manejar el caso en el que response sea nulo
                throw new Exception("No se encontró la unidad con el ID especificado.");
            }
            return response;

        }
        public async Task<IEnumerable<UnidadxProducto>> GetUnidadesxProductosByIdProductoAsync(int productoId)
        {
            var response = await _httpClient.GetFromJsonAsync<IEnumerable<UnidadxProducto>>($"UnidadesxProducto/GetUnidadesxProductoByProductoId?productoId={productoId}");

            if (response == null)
            {
                // Manejar el caso en el que response sea nulo
                throw new Exception("No se encontró la unidad con el ID especificado.");
            }
            return response;

        }
        public async Task<HttpResponseMessage> CreateUnidadxProductoAsync(UnidadxProductoAsosiacion productoxUnidad)
        {
            var response = await _httpClient.PostAsJsonAsync("UnidadesxProducto/InsertarUnidad", productoxUnidad);
            return response;
        }
        public async Task<HttpResponseMessage> DeleteUnidadxProductoAsync(int unidadId, int productoId)
        {
            try
            {
                var response = await _httpClient.DeleteAsync($"UnidadesxProducto/DeleteUnidadxProducto/{unidadId}/{productoId}");

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




        public async Task<(IEnumerable<FacturaDTO>, IEnumerable<LoteDTO>)> GetFacturasYLotesAsync()
        {
            var response = await _httpClient.GetFromJsonAsync<List<object>>("Compras/FacturasYLotes");

            if (response == null || response.Count != 2)
            {
                // Manejar el caso en el que response sea nulo o no tenga el formato esperado
                throw new Exception("No se encontraron facturas y lotes o la respuesta no es válida.");
            }

            var facturas = response[0] as IEnumerable<FacturaDTO>;
            var lotes = response[1] as IEnumerable<LoteDTO>;

            if (facturas == null || lotes == null)
            {
                throw new Exception("Error en el formato de los datos recibidos.");
            }

            return (facturas, lotes);
        }

        public async Task<string> VerificarDuplicadosLotes(string numeroLote)
        {
            try
            {
                HttpResponseMessage response = await _httpClient.GetAsync($"Compras/VerificarDuplicadosLotes?numeroLote={numeroLote}");

                if (response.IsSuccessStatusCode)
                {
                    string result = await response.Content.ReadAsStringAsync();
                    return result; // Retorna "ok" o "error" dependiendo de la respuesta del servidor
                }
                else
                {
                    // Manejar el error si la solicitud no fue exitosa
                    return "error en la solicitud";
                }
            }
            catch (Exception ex)
            {
                // Manejar cualquier excepción que ocurra durante la solicitud
                return "error: " + ex.Message;
            }
        }

        public async Task<string> VerificarDuplicadosFacturas(string numeroF)
        {
            try
            {
                HttpResponseMessage response = await _httpClient.GetAsync($"Compras/VerificarDuplicadosFacturas?numeroF={numeroF}");

                if (response.IsSuccessStatusCode)
                {
                    string result = await response.Content.ReadAsStringAsync();
                    return result; // Retorna "ok" o "error" dependiendo de la respuesta del servidor
                }
                else
                {
                    // Manejar el error si la solicitud no fue exitosa
                    return "error en la solicitud";
                }
            }
            catch (Exception ex)
            {
                // Manejar cualquier excepción que ocurra durante la solicitud
                return "error: " + ex.Message;
            }
        }


    }
}


