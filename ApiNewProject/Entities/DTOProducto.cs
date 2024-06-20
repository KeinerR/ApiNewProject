     using System.Text.Json.Serialization;

namespace ApiNewProject.Entities
{
    public partial class Categoria
    {
        public Categoria()
        {
            Productos = new HashSet<Producto>();
        }

        public int CategoriaId { get; set; }

        public string? NombreCategoria { get; set; }
        public ulong? EstadoCategoria { get; set; }
        [JsonIgnore]

        public virtual ICollection<Producto> Productos { get; set; }
    }
    public partial class Marca
    {
        public Marca()
        {
            Productos = new HashSet<Producto>();
        }

        public int MarcaId { get; set; }
        public string? NombreMarca { get; set; }
        public ulong? EstadoMarca { get; set; }
        [JsonIgnore]
        public virtual ICollection<Producto> Productos { get; set; }
    }
    public partial class Presentacion
    {
        public Presentacion()
        {
            Productos = new HashSet<Producto>();
        }

        public int PresentacionId { get; set; }
        public string? NombrePresentacion { get; set; }
        public string? NombreCompletoPresentacion { get; set; }
        public string? Contenido { get; set; }
        public int? CantidadPorPresentacion { get; set; }
        public string? DescripcionPresentacion { get; set; }
        public ulong? EstadoPresentacion { get; set; }
        [JsonIgnore]
        public virtual ICollection<Producto> Productos { get; set; }
    }
    public partial class Producto
    {
        public Producto()
        {
            Detallecompras = new HashSet<Detallecompra>();
            Detallepedidos = new HashSet<Detallepedido>();
            Lotes = new HashSet<Lote>();
        }

        public int ProductoId { get; set; }
        public int? PresentacionId { get; set; }
        public int? MarcaId { get; set; }
        public int? CategoriaId { get; set; }
        public string? NombreProducto { get; set; }
        public string? NombreCompletoProducto { get; set; }
        public int? CantidadTotal { get; set; } = 0;
        public int? CantidadTotalPorUnidad { get; set; } = 0;
        public int? CantidadReservada { get; set; } = 0;
        public int? CantidadPorUnidadReservada { get; set; } = 0;
        public int? CantidadAplicarPorMayor { get; set; }
        public int? DescuentoAplicarPorMayor { get; set; }
        public ulong? Estado { get; set; }
        [JsonIgnore]

        public virtual Categoria? Categoria { get; set; }
        [JsonIgnore]
        public virtual Marca? Marca { get; set; }
        [JsonIgnore]
        public virtual Presentacion? Presentacion { get; set; }
        [JsonIgnore]
        public virtual ICollection<Detallecompra> Detallecompras { get; set; }
        [JsonIgnore]
        public virtual ICollection<Detallepedido> Detallepedidos { get; set; }
        [JsonIgnore]
        public virtual ICollection<Lote> Lotes { get; set; }
    }
    public partial class ProductoCrearYActualizar
    {
        public int ProductoId { get; set; }
        public int? PresentacionId { get; set; }
        public int? MarcaId { get; set; }
        public int? CategoriaId { get; set; }
        public string? NombreProducto { get; set; }
        public string? NombreCompletoProducto { get; set; }
        public int? CantidadAplicarPorMayor { get; set; }
        public int? DescuentoAplicarPorMayor { get; set; }
        public ulong? Estado { get; set; }
    }




    public partial class Unidad
    {
        public Unidad()
        {
            Detallecompras = new HashSet<Detallecompra>();
            Detallepedidos = new HashSet<Detallepedido>();
        }
      
        public int UnidadId { get; set; }
        public string? NombreUnidad { get; set; }
        public string? NombreCompletoUnidad { get; set; }
        public int? CantidadPorUnidad { get; set; }
        public string? DescripcionUnidad { get; set; }
        public ulong? EstadoUnidad { get; set; }
        [JsonIgnore]
        public virtual ICollection<Detallecompra> Detallecompras { get; set; }
        [JsonIgnore]
        public virtual ICollection<Detallepedido> Detallepedidos { get; set; }

    }

    public partial class Proveedor
    {
        public Proveedor()
        {
            Compras = new HashSet<Compra>();
        }

        public int ProveedorId { get; set; }
        public string? NombreEmpresa { get; set; }
        public string? NombreContacto { get; set; }
        public string? Direccion { get; set; }
        public string? Telefono { get; set; }
        public string? Correo { get; set; }
        public ulong? EstadoProveedor { get; set; }
        [JsonIgnore]
        public virtual ICollection<Compra> Compras { get; set; }
    }

}
