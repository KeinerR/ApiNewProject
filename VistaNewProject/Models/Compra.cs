using System.Text.Json.Serialization;

namespace VistaNewProject.Models
{
    public class Compra
    {
        public int CompraId { get; set; }
        public int? ProveedorId { get; set; }
        public string? NumeroFactura { get; set; }
        public DateTime? FechaCompra { get; set; }
        public decimal? ValorTotalCompra { get; set; }
        public ulong? EstadoCompra { get; set; }

        public virtual Proveedor? Proveedor { get; set; }
        public virtual Lote? Lotes { get; set; } = null;

    }
    public class CompraVista
    {
        public int CompraId { get; set; }
        public int? ProveedorId { get; set; }
        public string? NumeroFactura { get; set; }
        public string ? FechaCompra { get; set; }
        public string ? ValorTotalCompra { get; set; }
        public ulong? EstadoCompra { get; set; }

    }
    public partial class Detallecompra
    {
        public Detallecompra()
        {
            Lotes = new HashSet<Lote>();
        }

        public int DetalleCompraId { get; set; }
        public int? CompraId { get; set; }
        public int? ProductoId { get; set; }
        public int? UnidadId { get; set; }
        public int? Cantidad { get; set; }
        [JsonIgnore]
        public virtual Compra? Compra { get; set; }
        [JsonIgnore]
        public virtual Producto? Producto { get; set; }
        [JsonIgnore]
        public virtual Unidad? Unidad { get; set; }
        public virtual Lote? lote { get; set; }
        public virtual ICollection<Lote> Lotes { get; set; }
    }
    public class FacturaDTO
    {
        public string? NumeroFactura { get; set; }
    }
    public class LoteDTO
    {
        public string? NumeroLote { get; set; }
    }
    public partial class CrearCompra
    {
        public int CompraId { get; set; }
        public int? ProveedorId { get; set; }
        public string? NumeroFactura { get; set; }
        public DateTime? FechaCompra { get; set; }
        public long? ValorTotalCompra { get; set; }
        public ulong? EstadoCompra { get; set; }
        public virtual ICollection<CrearDetallecompra> Detallecompras { get; set; }
    }
    public partial class CrearDetallecompra
    {
        public int DetalleCompraId { get; set; }
        public int? CompraId { get; set; }
        public int? ProductoId { get; set; }
        public int? UnidadId { get; set; }
        public int? Cantidad { get; set; }
        public virtual ICollection<LoteCrear> Lotes { get; set; }
    }
    public class LoteCrear
    {
        public int LoteId { get; set; }
        public int? DetalleCompraId { get; set; }
        public int? ProductoId { get; set; }
        public string? NumeroLote { get; set; }
        public decimal? PrecioCompra { get; set; }
        public decimal? PrecioPorPresentacion { get; set; }
        public decimal? PrecioPorUnidadProducto { get; set; }
        public decimal? PrecioPorUnidad { get; set; }
        public decimal? PrecioPorPresentacionCompra { get; set; }
        public decimal? PrecioPorUnidadProductoCompra { get; set; }
        public decimal? PrecioPorUnidadCompra { get; set; }
        public DateTime? FechaVencimiento { get; set; }
        public int? Cantidad { get; set; }
        public int? CantidadCompra { get; set; }
        public int? CantidadPorUnidadCompra { get; set; }
        public int? CantidadPorUnidad { get; set; }
        public ulong? EstadoLote { get; set; }


    }
    public class Lote
    {
        public int LoteId { get; set; }
        public int? DetalleCompraId { get; set; }
        public int? ProductoId { get; set; }
        public string? NumeroLote { get; set; }
        public decimal? PrecioCompra { get; set; }
        public decimal? PrecioPorPresentacion { get; set; }
        public decimal? PrecioPorUnidadProducto { get; set; }
        public decimal? PrecioPorUnidad{ get; set; }
        public decimal? PrecioPorPresentacionCompra { get; set; }
        public decimal? PrecioPorUnidadProductoCompra { get; set; }
        public decimal? PrecioPorUnidadCompra { get; set; }
        public DateTime? FechaVencimiento { get; set; }
        public int? Cantidad { get; set; }
        public int? CantidadCompra { get; set; }
        public int? CantidadPorUnidadCompra { get; set; }
        public int? CantidadPorUnidad { get; set; }
        public ulong? EstadoLote { get; set; }
        public virtual Detallecompra? DetalleCompra { get; set; }
        public virtual Producto? Producto { get; set; }


    }
    public class LoteVista
    {
        public int LoteId { get; set; }
        public int? DetalleCompraId { get; set; }
        public int? ProductoId { get; set; }
        public string? NumeroLote { get; set; }
        public string? PrecioCompra { get; set; }
        public string? PrecioPorPresentacion { get; set; }
        public string? PrecioPorUnidadProducto { get; set; }
        public decimal? PrecioPorUnidad { get; set; }
        public DateTime? FechaVencimiento { get; set; }
        public string? FechaCaducidad { get; set; }
        public int? Cantidad { get; set; }
        public ulong? EstadoLote { get; set; }

        public virtual Detallecompra? DetalleCompra { get; set; }


        public virtual Producto? Producto { get; set; }
    }
}