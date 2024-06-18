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

    public async Task<List<Producto>> ConcatenarNombreCompletoProductos()
    {
        // Obtener todos los productos
        var productos = await _client.GetAllDatosProductosAsync();

        // Lista para almacenar los productos con el nombre completo concatenado
        var productosConNombreCompleto = new List<Producto>();

        foreach (var producto in productos)
        {
            // Crear una nueva instancia de Producto con los datos necesarios
            var datosProducto = new Producto
            {
                ProductoId = producto.ProductoId,
                PresentacionId = producto.PresentacionId,
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

            // Obtener lotes para el producto actual
            var lotes = await _client.GetLotesByProductIdAsync(producto.ProductoId);

            // Calcular la cantidad total por producto sumando la cantidad de lotes
            datosProducto.CantidadTotal = lotes
                .Where(l => l.EstadoLote == 1 && l.ProductoId == producto.ProductoId)
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

            // Agregar el producto a la lista
            productosConNombreCompleto.Add(datosProducto);
        }

        // Devolver la lista de productos con el nombre completo concatenado
        return productosConNombreCompleto;
    }

    public async Task<List<Producto>> ConcatenarNombreCompletoProductos(List<Producto> productos)
    {
        // Lista para almacenar los productos con el nombre completo concatenado
        var productosConNombreCompleto = new List<Producto>();

        foreach (var producto in productos)
        {
            // Crear una nueva instancia de Producto con los datos necesarios
            var datosProducto = new Producto
            {
                ProductoId = producto.ProductoId,
                PresentacionId = producto.PresentacionId,
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
            var lotes = await _client.GetLotesByProductIdAsync(producto.ProductoId);

            // Calcular la cantidad total por producto sumando la cantidad de lotes
            datosProducto.CantidadTotal = lotes
                .Where(l => l.EstadoLote == 1 && l.ProductoId == producto.ProductoId)
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

            // Agregar el producto a la lista
            productosConNombreCompleto.Add(datosProducto);
        }

        // Devolver la lista de productos con el nombre completo concatenado
        return productosConNombreCompleto;
    }

    public async Task<List<ProductoCrearYActualizar>> ProductosParaConcatenar(List<ProductoCrearYActualizar> productos)
    {
        // Lista para almacenar los productos con el nombre completo concatenado
        var productosConNombreCompleto = new List<ProductoCrearYActualizar>();

        foreach (var producto in productos)
        {
            // Cargar las propiedades de navegación si no están ya cargadas
            var presentacion = await _client.FindPresentacionAsync(producto.PresentacionId.Value);
            var marca = await _client.FindMarcaAsync(producto.MarcaId);

            if (presentacion == null || marca == null)
            {
                // Si no se encuentra la presentación o la marca, continúa con el siguiente producto
                continue;
            }

            // Crear una nueva instancia de Producto con los datos necesarios
            var datosProducto = new ProductoCrearYActualizar
            {
                ProductoId = producto.ProductoId,
                PresentacionId = producto.PresentacionId,
                MarcaId = producto.MarcaId,
                CategoriaId = producto.CategoriaId,
                NombreProducto = producto.NombreProducto,
                NombreCompletoProducto = producto.NombreCompletoProducto,
                CantidadAplicarPorMayor = producto.CantidadAplicarPorMayor,
                DescuentoAplicarPorMayor = producto.DescuentoAplicarPorMayor,
                Estado = producto.Estado
            };

            // Construir el nombre completo del producto
            var nombrePresentacion = presentacion.NombrePresentacion;
            var contenido = presentacion.Contenido;
            var cantidad = presentacion.CantidadPorPresentacion;
            var nombreMarca = marca.NombreMarca;

            datosProducto.NombreCompletoProducto = cantidad > 1
                ? $"{nombrePresentacion} de {datosProducto.NombreProducto} x {cantidad} unidades de {contenido}"
                : $"{nombrePresentacion} de {datosProducto.NombreProducto} {nombreMarca} de {contenido}";

            // Añadir el producto a la lista
            productosConNombreCompleto.Add(datosProducto);
        }

        // Devolver la lista de productos con el nombre completo concatenado
        return productosConNombreCompleto;
    }

    public async Task<List<Producto>> ConcatenarNombreCompletoProductosaAct(List<Producto> productos)
    {
        // Lista para almacenar los productos con el nombre completo concatenado
        var productosConNombreCompleto = new List<Producto>();

        foreach (var producto in productos)
        {
            // Cargar las propiedades de navegación si no están ya cargadas
            var presentacion = await _client.FindPresentacionAsync(producto.PresentacionId.Value);
            var marca = await _client.FindMarcaAsync(producto.MarcaId);

            if (presentacion == null || marca == null)
            {
                // Si no se encuentra la presentación o la marca, continúa con el siguiente producto
                continue;
            }

            // Crear una nueva instancia de Producto con los datos necesarios
            var datosProducto = new Producto
            {
                ProductoId = producto.ProductoId,
                PresentacionId = producto.PresentacionId,
                MarcaId = producto.MarcaId,
                CategoriaId = producto.CategoriaId,
                NombreProducto = producto.NombreProducto,
                NombreCompletoProducto = producto.NombreCompletoProducto,
                CantidadAplicarPorMayor = producto.CantidadAplicarPorMayor,
                DescuentoAplicarPorMayor = producto.DescuentoAplicarPorMayor,
                Estado = producto.Estado
            };

            // Construir el nombre completo del producto
            var nombrePresentacion = presentacion.NombrePresentacion;
            var contenido = presentacion.Contenido;
            var cantidad = presentacion.CantidadPorPresentacion;
            var nombreMarca = marca.NombreMarca;

            datosProducto.NombreCompletoProducto = cantidad > 1
                ? $"{nombrePresentacion} de {datosProducto.NombreProducto} x {cantidad} unidades de {contenido}"
                : $"{nombrePresentacion} de {datosProducto.NombreProducto} {nombreMarca} de {contenido}";

            // Añadir el producto a la lista
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
