using VistaNewProject.Services;
using VistaNewProject.Models;

public class ProductoService
{
    private readonly IApiClient _client;

    public ProductoService(IApiClient client)
    {
        _client = client;
    }

    public async Task<Producto> ConcatenarNombreCompletoProducto(int productoId)
    {
        // Retrieve product information asynchronously
        var producto = await _client.FindDatosProductoAsync(productoId);

        // Convert Producto to DatosProducto
        var datosProducto = new Producto
        {
            ProductoId = producto.ProductoId,
            PresentacionId = producto.ProductoId, // Revisar si es correcto asignar ProductoId a PresentacionId
            MarcaId = producto.MarcaId,
            CategoriaId = producto.CategoriaId, // Asignar el id de la categoría
            NombreProducto = producto.NombreProducto,
            NombrePresentacion = producto.NombrePresentacion,
            CantidadReservada = producto.CantidadReservada,
            CantidadAplicarPorMayor = producto.CantidadAplicarPorMayor,
            DescuentoAplicarPorMayor = producto.DescuentoAplicarPorMayor,
            Contenido = producto.Contenido,
            NombreMarca = producto.NombreMarca,
            CantidadPorPresentacion = producto.CantidadPorPresentacion,
            NombreCategoria = producto.NombreCategoria
            // etc.
        };

        var lotes = await _client.GetLotesByProductIdAsync(productoId);

        var cantidadTotalPorProducto = lotes
            .Where(l => l.EstadoLote == 1 && l.ProductoId == productoId)
            .Sum(l => l.Cantidad);

        datosProducto.CantidadTotal = cantidadTotalPorProducto ?? 0;

        var nombrePresentacion = datosProducto.NombrePresentacion;
        var contenido = datosProducto.Contenido;
        var cantidad = datosProducto.CantidadPorPresentacion;
        var nombreMarca = datosProducto.NombreMarca;

        datosProducto.NombreCompleto = cantidad > 1 ?
            $"{nombrePresentacion} de {datosProducto.NombreProducto} x {cantidad} unidades de {contenido}" :
            $"{nombrePresentacion} de {datosProducto.NombreProducto} {nombreMarca} de {contenido}";

        return datosProducto;
    }


}
