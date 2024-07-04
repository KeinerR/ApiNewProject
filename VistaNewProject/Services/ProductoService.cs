using VistaNewProject.Services;
using VistaNewProject.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

public class ProductoService
{
    private readonly IApiClient _client;

    public ProductoService(IApiClient client)
    {
        _client = client;
    }

    public async Task<Producto> ConcatenarNombreCompletoProductoAsync(int productoId)
    {
        // Recuperar la información del producto de forma asincrónica
        var producto = await _client.FindDatosProductoAsync(productoId);

        // Crear una nueva instancia de Producto con los datos necesarios
        var datosProducto = new Producto
        {
            ProductoId = producto.ProductoId,
            PresentacionId = producto.PresentacionId, // Asegúrate de que este valor sea correcto
            MarcaId = producto.MarcaId,
            CategoriaId = producto.CategoriaId,
            NombreProducto = producto.NombreProducto,
            NombrePresentacion = producto.NombrePresentacion,
            CantidadReservada = producto.CantidadReservada,
            CantidadAplicarPorMayor = producto.CantidadAplicarPorMayor,
            DescuentoAplicarPorMayor = producto.DescuentoAplicarPorMayor,
            Contenido = producto.Contenido,
            NombreMarca = producto.NombreMarca,
            CantidadPorPresentacion = producto.CantidadPorPresentacion,
            NombreCategoria = producto.NombreCategoria
        };

        // Obtener lotes para el producto actual de forma asincrónica
        var lotes = await _client.GetLotesByProductIdAsync(productoId);

        // Calcular la cantidad total por producto sumando la cantidad de lotes
        datosProducto.CantidadTotal = lotes
            .Where(l => l.EstadoLote == 1 && l.ProductoId == productoId)
            .Sum(l => l.Cantidad) ?? 0;

        // Construir el nombre completo del producto
        var nombrePresentacion = datosProducto.NombrePresentacion;
        var contenido = datosProducto.Contenido;
        var cantidad = datosProducto.CantidadPorPresentacion;
        var nombreMarca = datosProducto.NombreMarca;

        datosProducto.NombreCompletoProducto = cantidad > 1
            ? $"{nombrePresentacion} de {datosProducto.NombreProducto} x {cantidad} unidades de {contenido}"
            : $"{nombrePresentacion} de {datosProducto.NombreProducto} {nombreMarca} de {contenido}";

        // Actualizar NombrePresentacion con el nombre completo concatenado
        datosProducto.NombrePresentacion = cantidad > 1
            ? $"{nombrePresentacion} x {cantidad} unidades de {contenido}"
            : $"{nombrePresentacion} de {contenido}";

        // Devolver el producto con el nombre completo y presentación concatenados
        return datosProducto;
    }

    public async Task<string> ObtenerNombreCompletoProductoAsync(ProductoCrearYActualizar producto)
    {
        var presentacion = await _client.FindPresentacionAsync(producto.PresentacionId.Value);
        var marca = await _client.FindMarcaAsync(producto.MarcaId);

        if (presentacion == null || marca == null)
        {
            return null; // Retorna null si no se encuentran la presentación o la marca
        }

        var nombrePresentacion = presentacion.NombrePresentacion;
        var contenido = presentacion.Contenido;
        var cantidad = presentacion.CantidadPorPresentacion;
        var nombreMarca = marca.NombreMarca;

        var nombreCompletoProducto = cantidad > 1
            ? $"{nombrePresentacion} de {producto.NombreProducto} x {cantidad} unidades de {contenido}"
            : $"{nombrePresentacion} de {producto.NombreProducto} {nombreMarca} de {contenido}";

        return nombreCompletoProducto;
    }

    // Método ConcatenarNombreCompletoPresentacion
    public async Task<string> ObtenerNombreCompletoPresentacionAsync(PresentacionCrearYActualizar presentacion)
    {
        // Construir el nombre completo de la presentación
        var nombrePresentacion = presentacion.NombrePresentacion;
        var contenido = presentacion.Contenido;
        var cantidad = presentacion.CantidadPorPresentacion ?? 1;

        // Simular una operación asincrónica, si fuera necesario (por ejemplo, acceso a la base de datos)
        await Task.Delay(10);

        // Devolver el nombre completo concatenado
        return cantidad > 1 ?
            $"{nombrePresentacion} x {cantidad} unidades de {contenido}" :
            $"{nombrePresentacion} de {contenido}";
    }

    public async Task<string> ObtenerNombreCompletoUnidadAsync(Unidad unidad)
    {
        // Construir el nombre completo de la unidad
        var nombreUnidad = unidad.NombreUnidad;
        var cantidadPorUnidad = unidad.CantidadPorUnidad;
        await Task.Delay(10);

        // Devolver el nombre completo concatenado
        return $"{nombreUnidad} x {cantidadPorUnidad}";
    }

    public string FormatearFechaVencimiento(DateTime? fechaVencimiento)
    {
        if (fechaVencimiento.HasValue)
        {
            DateTime fechaSinHora = fechaVencimiento.Value.Date; // Obtiene solo la fecha sin la hora

            // Formatea la fecha sin la hora en el formato "yyyy/MM/dd"
            string fechaFormateada = $"{fechaSinHora:yyyy/MM/dd}";

            return fechaFormateada;
        }
        else
        {
            return string.Empty; // Si la fecha es nula, retorna una cadena vacía o puedes manejarlo de otra manera
        }
    }

    public string FormatearPrecio(decimal? precio)
    {
        if (precio.HasValue)
        {
            string precioFormateado = precio.Value.ToString("#,##0"); // Formatea el precio con puntos de mil
            return precioFormateado;
        }
        else
        {
            return string.Empty;
        }
    }


    public async Task<List<CompraVista>> FormatearComprasAsync(IEnumerable<Compra> compras)
    {
        var comprasVista = new List<CompraVista>();

        foreach (var compra in compras)
        {
            // Convertir a CompraVista
            var compraVista = new CompraVista
            {
                CompraId = compra.CompraId,
                ProveedorId = compra.ProveedorId,
                NumeroFactura = compra.NumeroFactura,
                FechaCompra = FormatearFechaCompra(compra.FechaCompra), // Asegúrate de definir este método
                ValorTotalCompra = FormatearPrecio(compra.ValorTotalCompra), // Formato de dos decimales
                EstadoCompra = compra.EstadoCompra
            };

            comprasVista.Add(compraVista);
        }
        // Simular una operación asíncrona al final del método
        await Task.Delay(100); // Ejemplo de una operación asíncrona ficticia
        return comprasVista;
    }


    private string FormatearFechaCompra(DateTime? fechaVencimiento)
        {
            if (fechaVencimiento.HasValue)
            {
                DateTime fechaSinHora = fechaVencimiento.Value.Date; // Obtiene solo la fecha sin la hora

                // Formatea la fecha sin la hora en el formato "yyyy/MM/dd"
                string fechaFormateada = $"{fechaSinHora:yyyy/MM/dd}";

                return fechaFormateada;
            }
            else
            {
                return string.Empty; // Si la fecha es nula, retorna una cadena vacía o puedes manejarlo de otra manera
            }
        }

   
}

