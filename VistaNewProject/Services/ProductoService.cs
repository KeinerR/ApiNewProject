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

    public async Task<List<Producto>> ConcatenarNombreCompletoProductos()
    {
        // Obtener todos los productos
        var productos = await _client.GetAllDatosProductosAsync();

        // Lista para almacenar los productos con el nombre completo concatenado
        var productosConNombreCompleto = new List<Producto>();

        foreach (var producto in productos)
        {
            // Convertir Producto a DatosProducto
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

            // Obtener lotes para el producto actual
            var lotes = await _client.GetLotesByProductIdAsync(producto.ProductoId);

            // Calcular la cantidad total por producto sumando la cantidad de lotes
            var cantidadTotalPorProducto = lotes
                .Where(l => l.EstadoLote == 1 && l.ProductoId == producto.ProductoId)
                .Sum(l => l.Cantidad);

            datosProducto.CantidadTotal = cantidadTotalPorProducto ?? 0;

            // Construir el nombre completo del producto
            var nombrePresentacion = datosProducto.NombrePresentacion;
            var contenido = datosProducto.Contenido;
            var cantidad = datosProducto.CantidadPorPresentacion;
            var nombreMarca = datosProducto.NombreMarca;

            datosProducto.NombreCompleto = cantidad > 1 ?
                $"{nombrePresentacion} de {datosProducto.NombreProducto} x {cantidad} unidades de {contenido}" :
                $"{nombrePresentacion} de {datosProducto.NombreProducto} {nombreMarca} de {contenido}";
            productosConNombreCompleto.Add(datosProducto);

            datosProducto.NombrePresentacion = cantidad > 1 ?
             $"{nombrePresentacion} x {cantidad} unidades de {contenido}" :
             $"{nombrePresentacion} de {contenido}";

            // Agregar la presentación con el nombre completo concatenado a la lista
            productosConNombreCompleto.Add(datosProducto);

        }

        // Devolver la lista de productos con el nombre completo concatenado
        return productosConNombreCompleto;
    }

    // Método ConcatenarNombreCompletoPresentacion
    public async Task<List<Presentacion>> ConcatenarNombreCompletoPresentaciones()
    {
        var presentaciones = await _client.GetPresentacionAsync();

        // Lista para almacenar las presentaciones con el nombre completo concatenado
        var presentacionesConNombreCompleto = new List<Presentacion>();

        foreach (var presentacion in presentaciones)
        {
            // Construir el nombre completo de la presentación
            var nombrePresentacion = presentacion.NombrePresentacion;
            var contenido = presentacion.Contenido;
            var cantidad = presentacion.CantidadPorPresentacion ?? 1;

            presentacion.NombreCompleto = cantidad > 1 ?
                $"{nombrePresentacion} x {cantidad} unidades de {contenido}" :
                $"{nombrePresentacion} de {contenido}";

            // Agregar la presentación con el nombre completo concatenado a la lista
            presentacionesConNombreCompleto.Add(presentacion);

        }

        // Devolver la lista de presentaciones con el nombre completo concatenado
        return presentacionesConNombreCompleto;
    }

}
