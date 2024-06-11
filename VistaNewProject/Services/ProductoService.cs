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
        var producto = (await _client.GetProductoAsync()).FirstOrDefault(p => p.ProductoId == productoId);
        var presentaciones = await _client.GetPresentacionAsync();
        var lotes = await _client.GetLoteAsync();
        var marcas = await _client.GetMarcaAsync();

        // Calcular cantidad total de lotes por ProductoId y estado activo
        var cantidadTotalPorProducto = lotes
            .Where(l => l.EstadoLote == 1 && l.ProductoId == productoId)
            .Sum(l => l.Cantidad);

        producto.CantidadTotal = cantidadTotalPorProducto;

        // Concatenar nombre completo de presentaciones
        var presentacionEncontrada = presentaciones.FirstOrDefault(p => p.PresentacionId == producto.PresentacionId);
        var nombrePresentacion = presentacionEncontrada?.NombrePresentacion ?? "Sin presentación";
        var contenido = presentacionEncontrada?.Contenido ?? "";
        var cantidad = presentacionEncontrada?.CantidadPorPresentacion ?? 1;
        var marcaEncontrada = marcas.FirstOrDefault(m => m.MarcaId == producto.MarcaId);
        var nombreMarca = marcaEncontrada?.NombreMarca ?? "Sin marca";

        producto.NombreCompleto = cantidad > 1 ?
            $"{nombrePresentacion} de {producto.NombreProducto} x {cantidad} unidades de {contenido}" :
            $"{nombrePresentacion} de {producto.NombreProducto} {nombreMarca} de {contenido}";

        return producto;
    }
}
