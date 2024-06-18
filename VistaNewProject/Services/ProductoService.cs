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

    public async Task<string> ObtenerNombreCompletoProducto(ProductoCrearYActualizar producto)
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
    public async Task<string> ObtenerNombreCompletoPresentacion(PresentacionCrearYActualizar producto)
    {
        // Construir el nombre completo de la presentación
        var nombrePresentacion = producto.NombrePresentacion;
        var contenido = producto.Contenido;
        var cantidad = producto.CantidadPorPresentacion ?? 1;

        // Devolver el nombre completo concatenado
        return cantidad > 1 ?
            $"{nombrePresentacion} x {cantidad} unidades de {contenido}" :
            $"{nombrePresentacion} de {contenido}";
    }


}
