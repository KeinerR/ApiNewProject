﻿using Microsoft.AspNetCore.Mvc;
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
        public async Task<HttpResponseMessage> CreateClienteAsync(Cliente cliente)
        {
            var response = await _httpClient.PostAsJsonAsync("Clientes/InsertarCliente", cliente);
            return response;
        }
        public async Task<Cliente> FindClienteAsync(int id)
        {
            var response = await _httpClient.GetFromJsonAsync<Cliente>($"Clientes/GetClienetById?={id}");



            return response;
        }

        public async Task<HttpResponseMessage> UpdateClienteAsync(Cliente cliente)
        {
            var response = await _httpClient.PutAsJsonAsync("Clientes/UpdateClientes", cliente);
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
        public async Task<HttpResponseMessage> CreatePedidoAsync(Pedido pedido)
        {
            var response = await _httpClient.PostAsJsonAsync("", pedido);
            return response;
        }
        public async Task<Pedido> FindPedidoAsync(int id)
        {
            var response = await _httpClient.GetFromJsonAsync<Pedido>($"?={id}");
            return response;
        }

        public async Task<HttpResponseMessage> UpdatePedidoAsync(Pedido pedido)
        {
            var response = await _httpClient.PutAsJsonAsync("Pedidos/UpdatePedido", pedido);
            return response;
        }
        public async Task<HttpResponseMessage> DeletePedidoAsync(int id)
        {
            var response = await _httpClient.DeleteAsync($"Pedidos/DeletePedido/{id}");
            return response;
        }

        /// PRESENTACION
        /// 
        public async Task<IEnumerable<Presentacion>> GetPresentacionAsync()
        {
            var response = await _httpClient.GetFromJsonAsync<IEnumerable<Presentacion>>("");

            if (response == null)
            {
                // Manejar el caso en el que response sea nulo
                throw new Exception("No se encontró la presentacion con el ID especificado.");
            }
            return response;
        }
        public async Task<HttpResponseMessage> CreatePresentacionAsync(Presentacion presentacion)
        {
            var response = await _httpClient.PostAsJsonAsync("", presentacion);
            return response;
        }
        public async Task<Presentacion> FindPresentacionAsync(int id)
        {
            var response = await _httpClient.GetFromJsonAsync<Presentacion>($"?={id}");



            return response;
        }

        public async Task<HttpResponseMessage> UpdatePresentacionAsync(Presentacion presentacion)
        {
            var response = await _httpClient.PutAsJsonAsync("", presentacion);
            return response;
        }
        public async Task<HttpResponseMessage> DeletePresentacionAsync(int id)
        {
            var response = await _httpClient.DeleteAsync($"/{id}");
            return response;
        }


        /// COMPRA
        /// 
        public async Task<IEnumerable<Compra>> GetCompraAsync()
        {
            var response = await _httpClient.GetFromJsonAsync<IEnumerable<Compra>>("");

            if (response == null)
            {
                // Manejar el caso en el que response sea nulo
                throw new Exception("No se encontró la compra con el ID especificado.");
            }
            return response;
        }
        public async Task<HttpResponseMessage> CreateCompraAsync(Compra compra)
        {
            var response = await _httpClient.PostAsJsonAsync("", compra);
            return response;
        }
        public async Task<Compra> FindCompraAsync(int id)
        {
            var response = await _httpClient.GetFromJsonAsync<Compra>($"?={id}");
            return response;
        }

        public async Task<HttpResponseMessage> UpdateCompraAsync(Compra compra)
        {
            var response = await _httpClient.PutAsJsonAsync("", compra);
            return response;
        }
        public async Task<HttpResponseMessage> DeleteCompraAsync(int id)
        {
            var response = await _httpClient.DeleteAsync($"/{id}");
            return response;
        }


        /// MARCA
        /// 
        public async Task<IEnumerable<Marca>> GetMarcaAsync()
        {
            var response = await _httpClient.GetFromJsonAsync<IEnumerable<Marca>>("");

            if (response == null)
            {
                // Manejar el caso en el que response sea nulo
                throw new Exception("No se encontró la marca con el ID especificado.");
            }
            return response;
        }
        public async Task<HttpResponseMessage> CreateMarcaAsync(Marca marca)
        {
            var response = await _httpClient.PostAsJsonAsync("", marca);
            return response;
        }
        public async Task<Marca> FindMarcaAsync(int id)
        {
            var response = await _httpClient.GetFromJsonAsync<Marca>($"?={id}");
            return response;
        }

        public async Task<HttpResponseMessage> UpdateMarcaAsync(Marca marca)
        {
            var response = await _httpClient.PutAsJsonAsync("", marca);
            return response;
        }
        public async Task<HttpResponseMessage> DeleteMarcaAsync(int id)
        {
            var response = await _httpClient.DeleteAsync($"/{id}");
            return response;
        }

        /// CATEGORIA
        /// 
        public async Task<IEnumerable<Categoria>> GetCategoriaAsync()
        {
            var response = await _httpClient.GetFromJsonAsync<IEnumerable<Categoria>>("");

            if (response == null)
            {
                // Manejar el caso en el que response sea nulo
                throw new Exception("No se encontró la categoria con el ID especificado.");
            }
            return response;
        }
        public async Task<HttpResponseMessage> CreateCategoriaAsync(Categoria categoria)
        {
            var response = await _httpClient.PostAsJsonAsync("", categoria);
            return response;
        }
        public async Task<Categoria> FindCategoriaAsync(int id)
        {
            var response = await _httpClient.GetFromJsonAsync<Categoria>($"?={id}");
            return response;
        }

        public async Task<HttpResponseMessage> UpdateCategoriaAsync(Categoria categoria)
        {
            var response = await _httpClient.PutAsJsonAsync("", categoria);
            return response;
        }
        public async Task<HttpResponseMessage> DeleteCategoriaAsync(int id)
        {
            var response = await _httpClient.DeleteAsync($"/{id}");
            return response;
        }

        /// UNIDAD
        /// 
        public async Task<IEnumerable<Unidad>> GetUnidadAsync()
        {
            var response = await _httpClient.GetFromJsonAsync<IEnumerable<Unidad>>("");

            if (response == null)
            {
                // Manejar el caso en el que response sea nulo
                throw new Exception("No se encontró la unidad con el ID especificado.");
            }
            return response;
        }
        public async Task<HttpResponseMessage> CreateUnidadAsync(Unidad unidad)
        {
            var response = await _httpClient.PostAsJsonAsync("", unidad);
            return response;
        }
        public async Task<Unidad> FindUnidadAsync(int id)
        {
            var response = await _httpClient.GetFromJsonAsync<Unidad>($"?={id}");
            return response;
        }

        public async Task<HttpResponseMessage> UpdateUnidadAsync(Unidad unidad)
        {
            var response = await _httpClient.PutAsJsonAsync("", unidad);
            return response;
        }
        public async Task<HttpResponseMessage> DeleteUnidadAsync(int id)
        {
            var response = await _httpClient.DeleteAsync($"/{id}");
            return response;
        }


        /// PRODUCTO
        /// 
        public async Task<IEnumerable<Producto>> GetProductoAsync()
        {
            var response = await _httpClient.GetFromJsonAsync<IEnumerable<Producto>>("");

            if (response == null)
            {
                // Manejar el caso en el que response sea nulo
                throw new Exception("No se encontró el producto con el ID especificado.");
            }
            return response;
        }
        public async Task<HttpResponseMessage> CreateProductoAsync(Producto producto)
        {
            var response = await _httpClient.PostAsJsonAsync("", producto);
            return response;
        }
        public async Task<Producto> FindProductoAsync(int id)
        {
            var response = await _httpClient.GetFromJsonAsync<Producto>($"?={id}");
            return response;
        }

        public async Task<HttpResponseMessage> UpdateProductoAsync(Producto producto)
        {
            var response = await _httpClient.PutAsJsonAsync("", producto);
            return response;
        }
        public async Task<HttpResponseMessage> DeleteProductoAsync(int id)
        {
            var response = await _httpClient.DeleteAsync($"/{id}");
            return response;
        }

        /// PROVEEDOR
        /// 
        public async Task<IEnumerable<Proveedor>> GetProveedorAsync()
        {
            var response = await _httpClient.GetFromJsonAsync<IEnumerable<Proveedor>>("");

            if (response == null)
            {
                // Manejar el caso en el que response sea nulo
                throw new Exception("No se encontró el proveedor con el ID especificado.");
            }
            return response;
        }
        public async Task<HttpResponseMessage> CreateProveedorAsync(Proveedor proveedor)
        {
            var response = await _httpClient.PostAsJsonAsync("", proveedor);
            return response;
        }
        public async Task<Proveedor> FindProveedorAsync(int id)
        {
            var response = await _httpClient.GetFromJsonAsync<Proveedor>($"?={id}");
            return response;
        }

        public async Task<HttpResponseMessage> UpdateProveedorAsync(Proveedor proveedor)
        {
            var response = await _httpClient.PutAsJsonAsync("", proveedor);
            return response;
        }
        public async Task<HttpResponseMessage> DeleteProveedorAsync(int id)
        {
            var response = await _httpClient.DeleteAsync($"/{id}");
            return response;
        }

        /// USUARIO
        /// 
        public async Task<IEnumerable<Usuario>> GetUsuarioAsync()
        {
            var response = await _httpClient.GetFromJsonAsync<IEnumerable<Usuario>>("");

            if (response == null)
            {
                // Manejar el caso en el que response sea nulo
                throw new Exception("No se encontró el usuario con el ID especificado.");
            }
            return response;
        }
        public async Task<HttpResponseMessage> CreateUsuarioAsync(Usuario usuario)
        {
            var response = await _httpClient.PostAsJsonAsync("", usuario);
            return response;
        }
        public async Task<Usuario> FindUsuarioAsync(int id)
        {
            var response = await _httpClient.GetFromJsonAsync<Usuario>($"?={id}");
            return response;
        }

        public async Task<HttpResponseMessage> UpdateUsuarioAsync(Usuario usuario)
        {
            var response = await _httpClient.PutAsJsonAsync("", usuario);
            return response;
        }
        public async Task<HttpResponseMessage> DeleteUsuarioAsync(int id)
        {
            var response = await _httpClient.DeleteAsync($"/{id}");
            return response;
        }

        /// MOVIMIENTO
        /// 
        public async Task<IEnumerable<Movimiento>> GetMovimientoAsync()
        {
            var response = await _httpClient.GetFromJsonAsync<IEnumerable<Movimiento>>("");

            if (response == null)
            {
                // Manejar el caso en el que response sea nulo
                throw new Exception("No se encontró el movimiento con el ID especificado.");
            }
            return response;
        }
        public async Task<HttpResponseMessage> CreateMovimientoAsync(Movimiento movimiento)
        {
            var response = await _httpClient.PostAsJsonAsync("", movimiento);
            return response;
        }
        public async Task<Movimiento> FindMovimientoAsync(int id)
        {
            var response = await _httpClient.GetFromJsonAsync<Movimiento>($"?={id}");
            return response;
        }

        public async Task<HttpResponseMessage> UpdateMovimientoAsync(Movimiento movimiento)
        {
            var response = await _httpClient.PutAsJsonAsync("", movimiento);
            return response;
        }
        public async Task<HttpResponseMessage> DeleteMovimientoAsync(int id)
        {
            var response = await _httpClient.DeleteAsync($"/{id}");
            return response;
        }

        /// Lote
        /// 
        public async Task<IEnumerable<Lote>> GetLoteAsync()
        {
            var response = await _httpClient.GetFromJsonAsync<IEnumerable<Lote>>("");

            if (response == null)
            {
                // Manejar el caso en el que response sea nulo
                throw new Exception("No se encontró el lote con el ID especificado.");
            }
            return response;
        }
        public async Task<HttpResponseMessage> CreateLoteAsync(Lote lote)
        {
            var response = await _httpClient.PostAsJsonAsync("", lote);
            return response;
        }
        public async Task<Lote> FindLoteAsync(int id)
        {
            var response = await _httpClient.GetFromJsonAsync<Lote>($"?={id}");
            return response;
        }

        public async Task<HttpResponseMessage> UpdateLoteAsync(Lote lote)
        {
            var response = await _httpClient.PutAsJsonAsync("", lote);
            return response;
        }
        public async Task<HttpResponseMessage> DeleteLoteAsync(int id)
        {
            var response = await _httpClient.DeleteAsync($"/{id}");
            return response;
        }

        /// Domicilio
        /// 
        public async Task<IEnumerable<Domicilio>> GetDomicilioAsync()
        {
            var response = await _httpClient.GetFromJsonAsync<IEnumerable<Domicilio>>("");

            if (response == null)
            {
                // Manejar el caso en el que response sea nulo
                throw new Exception("No se encontró el domicilio con el ID especificado.");
            }
            return response;
        }
        public async Task<HttpResponseMessage> CreateDomicilioAsync(Domicilio domicilio)
        {
            var response = await _httpClient.PostAsJsonAsync("", domicilio);
            return response;
        }
        public async Task<Domicilio> FindDomicilioAsync(int id)
        {
            var response = await _httpClient.GetFromJsonAsync<Domicilio>($"?={id}");
            return response;
        }

        public async Task<HttpResponseMessage> UpdateDomicilioAsync(Domicilio domicilio)
        {
            var response = await _httpClient.PutAsJsonAsync("", domicilio);
            return response;
        }
        public async Task<HttpResponseMessage> DeleteDomicilioAsync(int id)
        {
            var response = await _httpClient.DeleteAsync($"/{id}");
            return response;
        }

        /// Detallepedido
        /// 
        public async Task<IEnumerable<Detallepedido>> GetDetallepedidoAsync()
        {
            var response = await _httpClient.GetFromJsonAsync<IEnumerable<Detallepedido>>("");

            if (response == null)
            {
                // Manejar el caso en el que response sea nulo
                throw new Exception("No se encontró el detallepedido con el ID especificado.");
            }
            return response;
        }
        public async Task<HttpResponseMessage> CreateDetallepedidoAsync(Detallepedido detallepedido)
        {
            var response = await _httpClient.PostAsJsonAsync("", detallepedido);
            return response;
        }
        public async Task<Detallepedido> FindDetallepedidoAsync(int id)
        {
            var response = await _httpClient.GetFromJsonAsync<Detallepedido>($"?={id}");
            return response;
        }

        public async Task<HttpResponseMessage> UpdateDetallepedidoAsync(Detallepedido detallepedido)
        {
            var response = await _httpClient.PutAsJsonAsync("", detallepedido);
            return response;
        }
        public async Task<HttpResponseMessage> DeleteDetallepedidoAsync(int id)
        {
            var response = await _httpClient.DeleteAsync($"/{id}");
            return response;
        }

        /// Detallecompra
        /// 
        public async Task<IEnumerable<Detallecompra>> GetDetallecompraAsync()
        {
            var response = await _httpClient.GetFromJsonAsync<IEnumerable<Detallecompra>>("");

            if (response == null)
            {
                // Manejar el caso en el que response sea nulo
                throw new Exception("No se encontró el detallecompra con el ID especificado.");
            }
            return response;
        }
        public async Task<HttpResponseMessage> CreateDetallecompraAsync(Detallecompra detallecompra)
        {
            var response = await _httpClient.PostAsJsonAsync("", detallecompra);
            return response;
        }
        public async Task<Detallecompra> FindDetallecompraAsync(int id)
        {
            var response = await _httpClient.GetFromJsonAsync<Detallecompra>($"?={id}");
            return response;
        }

        public async Task<HttpResponseMessage> UpdateDetallecompraAsync(Detallecompra detallecompra)
        {
            var response = await _httpClient.PutAsJsonAsync("", detallecompra);
            return response;
        }
        public async Task<HttpResponseMessage> DeleteDetallecompraAsync(int id)
        {
            var response = await _httpClient.DeleteAsync($"/{id}");
            return response;
        }

        /// Permiso
        /// 
        public async Task<IEnumerable<Permiso>> GetPermisoAsync()
        {
            var response = await _httpClient.GetFromJsonAsync<IEnumerable<Permiso>>("");

            if (response == null)
            {
                // Manejar el caso en el que response sea nulo
                throw new Exception("No se encontró el permiso con el ID especificado.");
            }
            return response;
        }
        public async Task<HttpResponseMessage> CreatePermisoAsync(Permiso permiso)
        {
            var response = await _httpClient.PostAsJsonAsync("", permiso);
            return response;
        }
        public async Task<Permiso> FindPermisoAsync(int id)
        {
            var response = await _httpClient.GetFromJsonAsync<Permiso>($"?={id}");
            return response;
        }

        public async Task<HttpResponseMessage> UpdatePermisoAsync(Permiso permiso)
        {
            var response = await _httpClient.PutAsJsonAsync("", permiso);
            return response;
        }
        public async Task<HttpResponseMessage> DeletePermisoAsync(int id)
        {
            var response = await _httpClient.DeleteAsync($"/{id}");
            return response;
        }

        /// Rol
        /// 
        public async Task<IEnumerable<Rol>> GetRolAsync()
        {
            var response = await _httpClient.GetFromJsonAsync<IEnumerable<Rol>>("");

            if (response == null)
            {
                // Manejar el caso en el que response sea nulo
                throw new Exception("No se encontró el rol con el ID especificado.");
            }
            return response;
        }
        public async Task<HttpResponseMessage> CreateRolAsync(Rol rol)
        {
            var response = await _httpClient.PostAsJsonAsync("", rol);
            return response;
        }
        public async Task<Rol> FindRolAsync(int id)
        {
            var response = await _httpClient.GetFromJsonAsync<Rol>($"?={id}");
            return response;
        }

        public async Task<HttpResponseMessage> UpdateRolAsync(Rol rol)
        {
            var response = await _httpClient.PutAsJsonAsync("", rol);
            return response;
        }
        public async Task<HttpResponseMessage> DeleteRolAsync(int id)
        {
            var response = await _httpClient.DeleteAsync($"/{id}");
            return response;
        }

        /// Rolxpermiso
        /// 
        public async Task<IEnumerable<Rolxpermiso>> GetRolxpermisoAsync()
        {
            var response = await _httpClient.GetFromJsonAsync<IEnumerable<Rolxpermiso>>("");

            if (response == null)
            {
                // Manejar el caso en el que response sea nulo
                throw new Exception("No se encontró el rolxpermiso con el ID especificado.");
            }
            return response;
        }
        public async Task<HttpResponseMessage> CreateRolxpermisoAsync(Rolxpermiso rolxpermiso)
        {
            var response = await _httpClient.PostAsJsonAsync("", rolxpermiso);
            return response;
        }
        public async Task<Rolxpermiso> FindRolxpermisoAsync(int id)
        {
            var response = await _httpClient.GetFromJsonAsync<Rolxpermiso>($"?={id}");
            return response;
        }

        public async Task<HttpResponseMessage> UpdateRolxpermisoAsync(Rolxpermiso rolxpermiso)
        {
            var response = await _httpClient.PutAsJsonAsync("", rolxpermiso);
            return response;
        }
        public async Task<HttpResponseMessage> DeleteRolxpermisoAsync(int id)
        {
            var response = await _httpClient.DeleteAsync($"/{id}");
            return response;
        }

    }

}
