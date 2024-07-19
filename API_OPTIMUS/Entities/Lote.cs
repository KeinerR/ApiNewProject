using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace API_OPTIMUS.Entities;

public partial class Lote
{
    public int LoteId { get; set; }

    public int DetalleCompraId { get; set; }

    public int ProductoId { get; set; }

    public int UnidadId { get; set; }

    public int? CantidadCompraPorUnidad { get; set; }

    public string? NumeroLote { get; set; }

    public decimal? PrecioCompra { get; set; }

    public decimal? PrecioPorPresentacionCompra { get; set; }

    public decimal? PrecioPorUnidadProductoCompra { get; set; }

    public decimal? PrecioPorUnidadCompra { get; set; }

    public int? CantidadCompra { get; set; }

    public int? CantidadPorUnidadCompra { get; set; }

    public decimal? PrecioPorUnidad { get; set; }

    public decimal? PrecioPorPresentacion { get; set; }

    public decimal? PrecioPorUnidadProducto { get; set; }

    public int? Cantidad { get; set; }

    public int? CantidadPorUnidad { get; set; }

    public DateTime? FechaVencimiento { get; set; }

    public ulong? EstadoLote { get; set; }

    [JsonIgnore]
    public virtual Detallecompra? DetalleCompra { get; set; }

    [JsonIgnore]
    public virtual ICollection<Detallepedido> Detallepedidos { get; set; } = new List<Detallepedido>();

    [JsonIgnore]
    public virtual Producto? Producto { get; set; }

    [JsonIgnore]
    public virtual Unidad? Unidad { get; set; }
}
